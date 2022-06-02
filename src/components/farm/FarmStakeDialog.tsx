import { Currency, Token } from '@uniswap/sdk-core'
import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from '@starcoin/starswap-v2-sdk'
import { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState, useContext } from 'react'
import ReactGA from 'react-ga'
import { t, Trans } from '@lingui/macro'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { TYPE } from '../../theme'
import styled, { ThemeContext } from 'styled-components'
import Column, { AutoColumn, ColumnCenter, ColumnRight } from '../Column'
import Row, { RowBetween, AutoRow } from '../Row'
import Modal from '../Modal'
import { ButtonFarm, ButtonBorder, ButtonText } from 'components/Button'
import { useActiveWeb3React } from 'hooks/web3'
import { useStarcoinProvider } from 'hooks/useStarcoinProvider'
import BigNumber from 'bignumber.js';
import { arrayify, hexlify } from '@ethersproject/bytes';
import { utils, bcs } from '@starcoin/starcoin';
import CircularProgress from '@mui/material/CircularProgress'
import useComputeBoostFactor from '../../hooks/useComputeBoostFactor'
import useGetLockedAmount from '../../hooks/useGetLockedAmount'

const Container = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  width: 100%;
  height: 88px;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
`

const Input = styled.input`
  color: ${({ theme }) => theme.text1};
  width: 0;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  -webkit-appearance: textfield;
  text-align: right;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

const PredictBoostFactorSpan = styled.span`
  color: #fd748d;
  font-size: 16px;
`

interface FarmStakeDialogProps {
  tokenX: any,
  tokenY: any,
  lpTokenBalance: number,
  lpTokenScalingFactor: number,
  isOpen: boolean
  onDismiss: () => void,
  lpStakingData: any
}

export default function FarmStakeDialog({
  tokenX,
  tokenY,
  lpTokenBalance,
  lpTokenScalingFactor,
  onDismiss,
  isOpen,
  lpStakingData
}: FarmStakeDialogProps) {

  const starcoinProvider = useStarcoinProvider();
  const { account, chainId } = useActiveWeb3React()
  let address = '';
  if (account) {
    address = account.toLowerCase()
  }

  const theme = useContext(ThemeContext)
  
  const [stakeNumber, setStakeNumber] = useState<any>('')
  const [loading, setLoading] = useState(false);
  const [predictBoostFactor, setPredictBoostFactor] = useState<number>(100)

  function parseStakeNumber(value: string) {
    setStakeNumber(value)
  }

  const lockedAmount = useGetLockedAmount(tokenX, tokenY, address);
  const boostFactor = useComputeBoostFactor(
    lockedAmount,
    new BigNumber(Number(lpStakingData?.stakedLiquidity) + Number(stakeNumber) * lpTokenScalingFactor),
    lpStakingData?.farmTotalLiquidity
  )
  
  useEffect(() => {
    setPredictBoostFactor(boostFactor)
  }, [boostFactor])

  async function onClickStakeConfirm() {
    try {
      const functionId = `${V2_FACTORY_ADDRESS}::TokenSwapFarmScript::stake`;
      const strTypeArgs = [tokenX, tokenY];
      const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);

      const stakeAmount = new BigNumber(stakeNumber).times('1000000000'); // stakeAmount * 1e9

      const stakeAmountSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU128(new BigNumber(stakeAmount).toNumber());
        return hexlify(se.getBytes());
      })();
      const args = [
        arrayify(stakeAmountSCSHex)
      ];

      const scriptFunction = utils.tx.encodeScriptFunction(
        functionId,
        structTypeTags,
        args,
      );
      const payloadInHex = (function () {
        const se = new bcs.BcsSerializer();
        scriptFunction.serialize(se);
        return hexlify(se.getBytes());
      })();

      const response = await starcoinProvider.getSigner().sendUncheckedTransaction({
        data: payloadInHex,
      });
      console.log({ response });
      setLoading(true);
      setInterval(async () => {
        const txnInfo = await starcoinProvider.getTransactionInfo(response);
        console.log({txnInfo})
        if (txnInfo.status === 'Executed') {
          setLoading(false);
          onDismiss();
          clearInterval();
          window.location.reload();
        }
      }, 3000);
    } catch (error) {
      console.error(error);
    }
    return false;
  }
 
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} dialogBg={theme.bgCard}>
      <ColumnCenter style={{ padding: '27px 32px' }}>
        <AutoRow>
          <TYPE.black fontWeight={500} fontSize={20}>
            <Trans>Stake LP Token</Trans>
          </TYPE.black>
        </AutoRow>
        <RowBetween style={{ marginTop: '8px' }}>
          <TYPE.black fontWeight={500} fontSize={14} style={{ marginTop: '10px', lineHeight: '20px' }}>
            <Trans>LP Token Balance</Trans>：{lpTokenBalance / lpTokenScalingFactor}
          </TYPE.black>
        </RowBetween>
        <Container>
          <Input
            placeholder={'0.0'}
            value={stakeNumber}
            onChange={(e) => parseStakeNumber(e.target.value)}
            style={{
              height: '28px',
              background: 'transparent',
              textAlign: 'left',
              marginTop: '28px',
              marginLeft: '18px',
            }}
          />
          <ColumnRight style={{ marginRight: '25px', textAlign: 'right' }}>
            <ButtonText
              style={{ marginTop: '28px', lineHeight: '28px' }}
              onClick={() => {
                setStakeNumber((lpTokenBalance / lpTokenScalingFactor).toString())
              }}
            >
              <TYPE.black fontWeight={500} fontSize={20} color={'#FD748D'} style={{ lineHeight: '28px' }}>
                <Trans>MAX</Trans>
              </TYPE.black>
            </ButtonText>
          </ColumnRight>
        </Container>
        <RowBetween style={{ marginTop: '8px' }}>
          <TYPE.black fontWeight={500} fontSize={14} style={{ marginTop: '10px', lineHeight: '20px' }}>
            <Trans>Predict the updated Boost Factor value</Trans>：<PredictBoostFactorSpan>{predictBoostFactor / 100}X</PredictBoostFactorSpan>
          </TYPE.black>
        </RowBetween>
        {loading && (
          <CircularProgress
            size={64}
            sx={{
              marginTop: '10px',
              zIndex: 1,
            }}
          />
        )}
        <RowBetween style={{ marginTop: '24px' }}>
          <ButtonBorder marginRight={22} onClick={onDismiss}>
            <TYPE.black fontSize={20}>
              <Trans>Cancel</Trans>
            </TYPE.black>
          </ButtonBorder>
          <ButtonFarm
            onClick={() => {
              onClickStakeConfirm()
              // setTimeout(onDismiss, 2500);
              // setTimeout("window.location.reload()", 10000);
            }}
          >
            <TYPE.main color={'#fff'}>
              <Trans>Confirm</Trans>
            </TYPE.main>
          </ButtonFarm>
        </RowBetween>
        <RowBetween style={{ marginTop: '24px' }}>
          <TYPE.main color={'#FB578C'} fontSize={14}>
            <Trans>Note: Stake operation will harvest your previously earned STAR automatically.</Trans>
          </TYPE.main>
        </RowBetween>
      </ColumnCenter>
    </Modal>
  )
}