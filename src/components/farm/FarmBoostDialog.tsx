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
import getCurrentNetwork from '../../utils/getCurrentNetwork'
import BigNumber from 'bignumber.js'
import { arrayify, hexlify } from '@ethersproject/bytes'
import { utils, bcs } from '@starcoin/starcoin'
import { addHexPrefix } from '@starcoin/stc-util'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import useComputeBoostFactor from '../../hooks/useComputeBoostFactor'
import useGetLockedAmount from '../../hooks/useGetLockedAmount'


const Container = styled.div`
  width: 100%;
  button:disabled {
    background: #EDEEF2!important;
    div {
      color: #565A69!important;
    }
  }
`
const InputContainer = styled.div`
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
  tokenX: any
  tokenY: any
  veStarAmount: number
  lpTokenScalingFactor: number
  isOpen: boolean
  onDismiss: () => void
  lpStakingData: any
}

export default function FarmUnstakeDialog({
  tokenX,
  tokenY,
  veStarAmount,
  lpTokenScalingFactor,
  onDismiss,
  isOpen,
  lpStakingData,
}: FarmUnstakeDialogProps) {
  const starcoinProvider = useStarcoinProvider()
  const { account, chainId } = useActiveWeb3React()
  const network = getCurrentNetwork(chainId)
  const theme = useContext(ThemeContext)
  const [starAmount, setStarAmount] = useState('')
  const [loading, setLoading] = useState(false)

  let address = ''
  if (account) {
    address = account.toLowerCase()
  }

  const [predictBoostFactor, setPredictBoostFactor] = useState<number>(100)

  async function onClickConfirm() {
    try {
      const address = account ? account.toLowerCase() : ''
      const signature = ''

      const functionId = `${V2_FACTORY_ADDRESS}::TokenSwapFarmScript::wl_boost`
      const tyArgs = [tokenX, tokenY]

      const nodeUrl = `https://${network}-seed.starcoin.org`
      const boostAmount = new BigNumber(Number(starAmount) * lpTokenScalingFactor).toNumber()
      const args = [boostAmount, signature]

      const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(functionId, tyArgs, args, nodeUrl)

      const payloadInHex = (function () {
        const se = new bcs.BcsSerializer()
        scriptFunction.serialize(se)
        return hexlify(se.getBytes())
      })()

      const response = await starcoinProvider.getSigner().sendUncheckedTransaction({
        data: payloadInHex,
      })
      setLoading(true)
      setInterval(async () => {
        const txnInfo = await starcoinProvider.getTransactionInfo(response)
        console.log({ txnInfo })
        if (txnInfo.status === 'Executed') {
          setLoading(false)
          onDismiss()
          clearInterval()
          window.location.reload()
        }
      }, 3000)
    } catch (error) {
      console.error(error)
    }
    return false
  }

  const lockedAmount = useGetLockedAmount(tokenX, tokenY, address)
  const boostFactor = useComputeBoostFactor(
    new BigNumber(Number(lockedAmount) + Number(starAmount) * lpTokenScalingFactor),
    lpStakingData?.stakedLiquidity,
    lpStakingData?.farmTotalLiquidity
  )

  useEffect(() => {
    setPredictBoostFactor(boostFactor)
  }, [boostFactor])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} dialogBg={theme.bgCard}>
      <ColumnCenter style={{ padding: '27px 32px' }}>
        <AutoRow>
          <TYPE.black fontWeight={500} fontSize={20}>
            <Trans>Boost My LP Staking</Trans>
          </TYPE.black>
        </AutoRow>
        <RowBetween style={{ marginTop: '8px' }}>
          <TYPE.black fontWeight={500} fontSize={14} style={{ marginTop: '10px', lineHeight: '20px' }}>
            <Trans>VeStar</Trans>: {veStarAmount / lpTokenScalingFactor}
          </TYPE.black>
        </RowBetween>
        <InputContainer>
          <Input
            placeholder={'0.0'}
            value={starAmount}
            onChange={(e) => setStarAmount(e.target.value)}
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
                setStarAmount((veStarAmount / lpTokenScalingFactor).toString())
              }}
            >
              <TYPE.black fontWeight={500} fontSize={20} color={'#FD748D'} style={{ lineHeight: '28px' }}>
                <Trans>MAX</Trans>
              </TYPE.black>
            </ButtonText>
          </ColumnRight>
        </InputContainer>
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
        <Container>
          <RowBetween style={{ marginTop: '24px' }}>
            <ButtonBorder marginRight={22} onClick={onDismiss}>
              <TYPE.black fontSize={20}>
                <Trans>Cancel</Trans>
              </TYPE.black>
            </ButtonBorder>
            <ButtonFarm
              disabled={Number(starAmount) === 0}
              onClick={() => {
                onClickConfirm()
              }}
            >
              <TYPE.main color={'#fff'}>
                <Trans>Confirm</Trans>
              </TYPE.main>
            </ButtonFarm>
          </RowBetween>
        </Container>
      </ColumnCenter>
    </Modal>
  )
}