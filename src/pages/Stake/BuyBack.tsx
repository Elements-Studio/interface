import { Trans } from '@lingui/macro'
import { useState, useEffect, useCallback, ReactNode } from 'react'
import styled from 'styled-components'
import { RouteComponentProps, Link } from 'react-router-dom'
import { Text } from 'rebass'
import { arrayify, hexlify } from '@ethersproject/bytes';
import { bcs, utils, providers } from '@starcoin/starcoin';
import CircularProgress from '@mui/material/CircularProgress'
import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from '@starcoin/starswap-v2-sdk'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { AutoRow, RowFixed, RowBetween } from '../../components/Row'
import { TYPE, IconWrapper } from '../../theme'
import { ButtonError } from '../../components/Button'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { ArrowLeft } from 'react-feather'
import FarmCard from '../../components/farm/FarmCard'
import { useActiveWeb3React } from 'hooks/web3'
import { useStarcoinProvider } from 'hooks/useStarcoinProvider'
import useGetBuyBackInfo from '../../hooks/useGetBuyBackInfo';

export const FixedHeightRow = styled(RowBetween)`
  height: 30px;
`

const FarmRow = styled(RowBetween)`
  background: ${({ theme }) => theme.bg7};
  line-height: 20px;
  border-radius: 8px;
  padding: 6px 16px;
  margin-top: 10px;
`

const Container = styled(TYPE.topTitle)`
  margin-top: 1rem !important;
  text-align: center;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

const ButtonBuyBack = styled(ButtonError)`
  background: linear-gradient(241deg, #FF978E 0%, #FB548B 100%);
`

const scalingFactor = 1000000000

export default function BuyBack({ history }: RouteComponentProps) {
  let address = ''
  const { account, chainId } = useActiveWeb3React()
  if (account) {
    address = account.toLowerCase();
  }
  console.log({address})
  const [showConfirm, setShowConfirm] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [txnPending, setTxnPending] = useState(false)
  const [txnHash, setTxnHash] = useState<string | undefined>()

  const info = useGetBuyBackInfo()

  const starcoinProvider = useStarcoinProvider();

  async function onClickConfirm() {
    try {
      setAttemptingTxn(true);

      const functionId = `${V2_FACTORY_ADDRESS}::BuyBackSTAR::buy_back`;
      const typeArgs: any[] = [];
      const args: any[] = [];

      const scriptFunction = utils.tx.encodeScriptFunction(
        functionId,
        typeArgs,
        args,
      );

      const payloadInHex = (function () {
        const se = new bcs.BcsSerializer();
        scriptFunction.serialize(se);
        return hexlify(se.getBytes());
      })();

      const txnHash = await starcoinProvider.getSigner().sendUncheckedTransaction({
        data: payloadInHex,
      });
      setTxnHash(txnHash);
      setTxnPending(true)
      setAttemptingTxn(false)
    } catch (error) {
      console.error(error);
      
      setAttemptingTxn(false)
    }
    return false;
  }

  let error: ReactNode | undefined
  if (address === '') {
    error = <Trans>Not connected to a wallet</Trans>
  }

  if (info[0] === 0) {
    error = <Trans>Remaining STC amount is zero</Trans>
  }

  const sinceLatest = (new Date().getTime() - info[4]*1000)/1000/60
  if (sinceLatest < 5.0) {
    error = error ?? <Trans>Interval time less than 5 min</Trans>
  }

  if (txnPending) {
    error = error ?? <Trans>Transaction is pending</Trans>
  }

  if (txnHash === '' && !txnPending) {
    error = error ?? <Trans>Trigger buyback is successed</Trans>
  }

  const checkTxnStatus = useCallback(async (txnHash) => {
      let starcoinProvider: any
      try {
        if (window.starcoin) {
          starcoinProvider = new providers.Web3Provider(window.starcoin, 'any')
        }
      } catch (error) {
        console.error(error)
      }

      const contractMethod = "chain.get_transaction_info";
      let timing = setInterval(async function() {
        await new Promise((resolve, reject) => {
          return starcoinProvider
            ?.send(contractMethod, [txnHash])
            .then((result: number[]) => {
              if (result) {
                clearInterval(timing);
                setTxnPending(false);
              }
            })
        });
      }, 3000);
  }, [])  
  
  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash
    if (txnHash) {
      checkTxnStatus(txnHash)
      setTxnHash('')
    }
  }, [txnHash])

  const pendingText = <Trans>Trigger buyback</Trans>

  function modalHeader() {
    return (
      <div style={{margin: '30px auto', textAlign: 'center'}}>
        <RowFixed>
          <Trans>Trigger buyback</Trans>
        </RowFixed>
      </div>
    )
  }

  function modalBottom() {
    return (
      <ButtonBuyBack onClick={onClickConfirm}>
        <Text fontWeight={500} fontSize={20}>
          <Trans>Confirm</Trans>
        </Text>
      </ButtonBuyBack>
    )
  }

  return (
    <>
      <Container style={{ display: 'flex' }}>
        <TransactionConfirmationModal
          isOpen={showConfirm}
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txnHash ?? ''}
          content={() => (
            <ConfirmationModalContent
              title={<Trans>STAR Buy Back</Trans>}
              onDismiss={handleDismissConfirmation}
              topContent={modalHeader}
              bottomContent={modalBottom}
            />
          )}
          pendingText={pendingText}
        />
        <Link to="/stake" style={{ transform: 'translateX(-40px)' }}>
          <StyledArrowLeft />
        </Link>
        <Trans>STAR Buy Back</Trans>
      </Container>
      <AutoRow justify="center" style={{ paddingTop: '1rem', maxWidth: '1200px' }}>
        <FarmCard style={{ width: '450px', maxWidth: '450px' }}>
          <FarmRow>
            <RowFixed>
              <TYPE.black fontWeight={400} fontSize={14}>
                <Trans>Total STC Amount</Trans>
              </TYPE.black>
            </RowFixed>
            <RowFixed>
              <TYPE.black fontSize={14}>
              {info[1] / scalingFactor}
              </TYPE.black>
            </RowFixed>
          </FarmRow>
          <FarmRow>
            <RowFixed>
              <TYPE.black fontWeight={400} fontSize={14}>
                <Trans>Remaining STC Amount</Trans>
              </TYPE.black>
            </RowFixed>
            <RowFixed>
              <TYPE.black fontSize={14}>
              {info[0] / scalingFactor}
              </TYPE.black>
            </RowFixed>
          </FarmRow>
          <FarmRow>
            <RowFixed>
              <TYPE.black fontWeight={400} fontSize={14}>
                <Trans>Start Time</Trans>
              </TYPE.black>
            </RowFixed>
            <RowFixed>
              <TYPE.black fontSize={14}>
              {(new Date(info[3]*1000)+'').slice(4,24)}
              </TYPE.black>
            </RowFixed>
          </FarmRow>
          <FarmRow>
            <RowFixed>
              <TYPE.black fontWeight={400} fontSize={14}>
                <Trans>Release interval time</Trans>
              </TYPE.black>
            </RowFixed>
            <RowFixed>
              <TYPE.black fontSize={14}>
              {info[5]/60} M 
              </TYPE.black>
            </RowFixed>
          </FarmRow>
          <FarmRow style={{marginBottom: '10px'}}>
            <RowFixed>
              <TYPE.black fontWeight={400} fontSize={14}>
                <Trans>STC Amount per release</Trans>
              </TYPE.black>
            </RowFixed>
            <RowFixed>
              <TYPE.black fontSize={14}>
              {info[2] / scalingFactor}
              </TYPE.black>
            </RowFixed>
          </FarmRow>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Last buyback time</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
              {(new Date(info[4]*1000)+'').slice(4,24)}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              <Trans>As of next release time</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
              {(new Date(info[6]*1000)+'').slice(4,24)}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Available STC amount</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
              {info[7] / scalingFactor}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <FixedHeightRow marginBottom={16}>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Estimated buyback STAR amount</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
              {(info[8] / scalingFactor).toFixed(5)}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <ButtonBuyBack disabled={!!error} error={!!error} onClick={() => {
              setShowConfirm(true);
            }}>
            {error ?? <Trans>Trigger buyback</Trans>}
          </ButtonBuyBack>
        </FarmCard>
      </AutoRow>
      <SwitchLocaleLink />
    </>
  )
}
