import { useEffect, useState, useContext } from 'react'
import { Trans } from '@lingui/macro'
import { TYPE } from '../../theme'
import styled, { ThemeContext } from 'styled-components'
import {ColumnCenter, ColumnRight } from '../Column'
import { RowBetween, AutoRow } from '../Row'
import Modal from '../Modal'
import { ButtonFarm, ButtonBorder, ButtonText } from 'components/Button'
import { useStarcoinProvider } from 'hooks/useStarcoinProvider'
import BigNumber from 'bignumber.js'
import { arrayify, hexlify } from '@ethersproject/bytes'
import { utils, bcs } from '@starcoin/starcoin'
import CircularProgress from '@mui/material/CircularProgress'
import { Types } from '@starcoin/aptos';
import useComputeBoostFactor from '../../hooks/useComputeBoostFactor'
import { useGetType, useGetV2FactoryAddress } from 'state/networktype/hooks'
import { useWallet } from '@starcoin/aptos-wallet-adapter'

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

interface FarmHarvestDialogProps {
  tokenX: any,
  tokenY: any,
  tbdEarned: number,
  tbdScalingFactor: number,
  isOpen: boolean,
  onDismiss: () => void,
  lpStakingData: any,
  lockedAmount: number,
}

export default function FarmHarvestDialog({
  tokenX,
  tokenY,
  tbdEarned,
  tbdScalingFactor,
  onDismiss,
  isOpen,
  lpStakingData,
  lockedAmount
}: FarmHarvestDialogProps) {

  const provider = useStarcoinProvider();
  const networkType = useGetType()

  const theme = useContext(ThemeContext)
  
  const [harvestNumber, setHarvestNumber] = useState<any>('')
  const [loading, setLoading] = useState(false);
  const [predictBoostFactor, setPredictBoostFactor] = useState<number>(100)

  function parseHarvestNumber(value: string) {
    setHarvestNumber(value)
  }

  const boostFactor = useComputeBoostFactor(
    lockedAmount,
    lpStakingData?.stakedLiquidity,
    lpStakingData?.farmTotalLiquidity
  )
  
  useEffect(() => {
    setPredictBoostFactor(boostFactor)
  }, [boostFactor])

  const ADDRESS = useGetV2FactoryAddress()
  const { signAndSubmitTransaction } = useWallet();
  async function onClickHarvestConfirm() {
    try {
      const MODULE = 'TokenSwapFarmScript'
      const FUNC = 'harvest'
      let transactionHash: string
      if (networkType === 'APTOS') {
        const tyArgs = [tokenX, tokenY]
        const harvestAmount = new BigNumber(harvestNumber).times('1000000000'); // harvestAmount * 1e9
        const args = [new BigNumber(harvestAmount).toNumber()]
        const payload: Types.TransactionPayload = {
          type: 'entry_function_payload',
          function: `${ ADDRESS }::${ MODULE }::${ FUNC }`,
          type_arguments: tyArgs,
          arguments: args
        };
        const transactionRes = await signAndSubmitTransaction(payload);
        transactionHash = transactionRes?.hash || ''
      }else{
        const functionId = `${ADDRESS}::${MODULE}::${FUNC}`;
        const strTypeArgs = [tokenX, tokenY];
        const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);
  
        const harvestAmount = new BigNumber(harvestNumber).times('1000000000');
  
        const harvestAmountSCSHex = (function () {
          const se = new bcs.BcsSerializer();
          se.serializeU128(new BigNumber(harvestAmount).toNumber());
          return hexlify(se.getBytes());
        })();
        const args = [
          arrayify(harvestAmountSCSHex)
        ];
  
        const scriptFunction = utils.tx.encodeScriptFunction(
          functionId,
          structTypeTags,
          args,
        );
        const payloadHex = (function () {
          const se = new bcs.BcsSerializer();
          scriptFunction.serialize(se);
          return hexlify(se.getBytes());
        })();
        transactionHash = await provider.getSigner().sendUncheckedTransaction({
          data: payloadHex,
        })
      }

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
 
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} dialogBg={theme.bgCard}>
      <ColumnCenter style={{ padding: '27px 32px' }}>
        <AutoRow>
          <TYPE.black fontWeight={500} fontSize={20}>
            <Trans>Harvest STAR</Trans>
          </TYPE.black>
        </AutoRow>
        <RowBetween style={{ marginTop: '8px' }}>
          <TYPE.black fontWeight={500} fontSize={14} style={{ marginTop: '10px', lineHeight: '20px' }}>
            <Trans>STAR Earned</Trans>：{tbdEarned / tbdScalingFactor}
          </TYPE.black>
        </RowBetween>
        <Container>
          <Input
            placeholder={'0.0'}
            value={harvestNumber}
            onChange={(e) => parseHarvestNumber(e.target.value)}
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
                setHarvestNumber((tbdEarned / tbdScalingFactor).toString())
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
              onClickHarvestConfirm()
            }}
          >
            <TYPE.main color={'#fff'}>
              <Trans>Confirm</Trans>
            </TYPE.main>
          </ButtonFarm>
        </RowBetween>
      </ColumnCenter>
    </Modal>
  )
}