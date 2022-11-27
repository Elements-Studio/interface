import { Currency, Token } from '@uniswap/sdk-core'
import { FACTORY_ADDRESS_STARCOIN as V2_FACTORY_ADDRESS } from '@starcoin/starswap-v2-sdk'
import { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState, useContext } from 'react'
import ReactGA from 'react-ga'
import { t, Trans } from '@lingui/macro'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { TYPE } from '../../theme'
import styled, { ThemeContext } from 'styled-components'
import { ColumnCenter, ColumnRight } from '../Column'
import { RowBetween, AutoRow } from '../Row'
import Modal from '../Modal'
import { ButtonFarm, ButtonBorder, ButtonText } from 'components/Button'
import { useStarcoinProvider } from 'hooks/useStarcoinProvider'
import BigNumber from 'bignumber.js'
import { arrayify, hexlify } from '@ethersproject/bytes'
import { utils, bcs } from '@starcoin/starcoin'
import CircularProgress from '@mui/material/CircularProgress'
import { TxnBuilderTypes, BCS } from '@starcoin/aptos';
import useComputeBoostFactor from '../../hooks/useComputeBoostFactor'
import { useGetType, useGetV2FactoryAddress } from 'state/networktype/hooks'

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

interface FarmUnstakeDialogProps {
  tokenX: any,
  tokenY: any,
  userStaked: number,
  lpTokenScalingFactor: number,
  isOpen: boolean
  onDismiss: () => void,
  lpStakingData: any,
  lockedAmount: number,
}

export default function FarmUnstakeDialog({
  tokenX,
  tokenY,
  userStaked,
  lpTokenScalingFactor,
  onDismiss,
  isOpen,
  lpStakingData,
  lockedAmount,
}: FarmUnstakeDialogProps) {

  const provider = useStarcoinProvider();
  const networkType = useGetType()

  const theme = useContext(ThemeContext)
  
  const [unstakeNumber, setUnstakeNumber] = useState<any>('')
  const [loading, setLoading] = useState(false);
  const [predictBoostFactor, setPredictBoostFactor] = useState<number>(100)

  function parseUnstakeNumber(value: string) {
    setUnstakeNumber(value)
  }

  const boostFactor = useComputeBoostFactor(
    0,
    new BigNumber(Number(lpStakingData?.stakedLiquidity) - Number(unstakeNumber) * lpTokenScalingFactor),
    lpStakingData?.farmTotalLiquidity
  )

  useEffect(() => {
    setPredictBoostFactor(boostFactor)
  }, [boostFactor])
  
  const ADDRESS = useGetV2FactoryAddress()

  async function onClickUnstakeConfirm() {
    try {
      const MODULE = 'TokenSwapFarmScript'
      const FUNC = 'unstake'
      let payloadHex: string
      if (networkType === 'APTOS') {
        const tyArgs = [
          new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString(tokenX)),
          new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString(tokenY)),
        ]
        const unstakeAmount = new BigNumber(unstakeNumber).times('1000000000'); // unstakeAmount * 1e9

        const args = [BCS.bcsSerializeU128(new BigNumber(unstakeAmount).toNumber())]
        const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
          TxnBuilderTypes.EntryFunction.natural(
            `${ ADDRESS }::${MODULE}`,
            FUNC,
            tyArgs,
            args,
          ),
        );
        payloadHex = hexlify(BCS.bcsToBytes(entryFunctionPayload))
      }else{
      const functionId = `${V2_FACTORY_ADDRESS}::TokenSwapFarmScript::unstake`;
      const strTypeArgs = [tokenX, tokenY];
      const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);

      const unstakeAmount = new BigNumber(unstakeNumber).times('1000000000'); // unstakeAmount * 1e9

      const unstakeAmountSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU128(new BigNumber(unstakeAmount).toNumber());
        return hexlify(se.getBytes());
      })();
      const args = [
        arrayify(unstakeAmountSCSHex)
      ];

      const scriptFunction = utils.tx.encodeScriptFunction(
        functionId,
        structTypeTags,
        args,
      );
      payloadHex = (function () {
        const se = new bcs.BcsSerializer();
        scriptFunction.serialize(se);
        return hexlify(se.getBytes());
      })();
    }
    const transactionHash = await provider.getSigner().sendUncheckedTransaction({
      data: payloadHex,
    })

    setLoading(true);
    let id: NodeJS.Timeout
    id = setInterval(async () => {
      const txnInfo = await provider!.send('chain.get_transaction_info', [transactionHash])
      if (networkType === 'STARCOIN' && txnInfo?.status === 'Executed' || networkType === 'APTOS' && txnInfo?.success) {
        setLoading(false);
        onDismiss();
        clearInterval(id);
        window.location.reload();
      }
    }, 3000);

    
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  const checkUnstakeNumber = useCallback(() => {
    if (unstakeNumber === '') {
      return {
        isPass: false,
        message: <Trans>Enter number</Trans>
      }
    }
    const number = new BigNumber(unstakeNumber)

    if (number.isNaN()) {
      return {
        isPass: false,
        message: <Trans>Invalid type</Trans>
      }
    }
    if (number.isZero()) {
      return {
        isPass: false,
        message: <Trans>Enter number</Trans>
      }
    }
    if (number.isNegative()) {
      return {
        isPass: false,
        message: <Trans>Invalid type</Trans>
      }
    }

    return {
      isPass: true,
      message: <Trans>Confirm</Trans>
    }
  }, [unstakeNumber, userStaked, lpTokenScalingFactor])

  const getButtonText = useCallback(() => {
    const checkRet = checkUnstakeNumber();

    if (!checkRet.isPass) {
      return checkRet.message;
    }

    return unstakeNumber === ''
                  ? <Trans>Enter number</Trans>
                  : (userStaked / lpTokenScalingFactor) < unstakeNumber
                  ? <Trans>Insufficient amount</Trans>
                  : <Trans>Confirm</Trans>
  }, [unstakeNumber, userStaked, lpTokenScalingFactor]);
 

  
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} dialogBg={theme.bgCard} maxWidth={550}>
      <ColumnCenter style={{ padding: '27px 32px' }}>
        <AutoRow>
          <TYPE.black fontWeight={500} fontSize={20}>
            <Trans>Unstake LP Token</Trans>
          </TYPE.black>
        </AutoRow>
        <RowBetween style={{ marginTop: '8px' }}>
          <TYPE.black fontWeight={500} fontSize={14} style={{ marginTop: '10px', lineHeight: '20px' }}>
            <Trans>Staked LP Token</Trans>：{userStaked / lpTokenScalingFactor}
          </TYPE.black>
        </RowBetween>
        <Container>
          <Input
            placeholder={'0.0'}
            value={unstakeNumber}
            onChange={(e) => parseUnstakeNumber(e.target.value)}
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
                setUnstakeNumber((userStaked / lpTokenScalingFactor).toString())
              }}
            >
              <TYPE.black fontWeight={500} fontSize={20} color={'#FD748D'} style={{ lineHeight: '28px' }}>
                <Trans>MAX</Trans>
              </TYPE.black>
            </ButtonText>
          </ColumnRight>
        </Container>
        {
          networkType==='STARCOIN' && (
            <RowBetween style={{ marginTop: '8px' }}>
              <TYPE.black fontWeight={500} fontSize={14} style={{ marginTop: '10px', lineHeight: '20px' }}>
                <Trans>Predict the updated Boost Factor value</Trans>：<PredictBoostFactorSpan>{predictBoostFactor / 100}X</PredictBoostFactorSpan>
              </TYPE.black>
            </RowBetween>
          )
        }
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
            disabled={((userStaked / lpTokenScalingFactor) < unstakeNumber) || unstakeNumber === '' || checkUnstakeNumber().isPass === false}
            onClick={() => {
              onClickUnstakeConfirm()
            }}
          >
            <TYPE.main color={'#fff'}>
              <Trans>{getButtonText()}</Trans>
            </TYPE.main>
          </ButtonFarm>
        </RowBetween>
      </ColumnCenter>
    </Modal>
  )
}