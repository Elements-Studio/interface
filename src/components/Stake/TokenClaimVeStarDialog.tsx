import { FACTORY_ADDRESS_STARCOIN as V2_FACTORY_ADDRESS } from '@starcoin/starswap-v2-sdk'
import { useState, useContext } from 'react'
import { Trans } from '@lingui/macro'
import { TYPE } from '../../theme'
import styled, { ThemeContext } from 'styled-components'
import { ColumnCenter } from '../Column'
import { RowBetween, AutoRow } from '../Row'
import Modal from '../Modal'
import { STAR_NAME } from '../../constants/tokens'
import { ButtonFarm, ButtonBorder } from 'components/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useActiveWeb3React } from 'hooks/web3'
import { useStarcoinProvider } from 'hooks/useStarcoinProvider'
import { arrayify, hexlify } from '@ethersproject/bytes'
import { utils, bcs } from '@starcoin/starcoin'
import BigNumber from 'bignumber.js';
import { Types } from '@starcoin/aptos';
import { useGetType, useGetV2FactoryAddress } from 'state/networktype/hooks'
import getChainName from 'utils/getChainName'
import { useWallet } from '@starcoin/aptos-wallet-adapter'
import getChainId from 'utils/getChainId'


const Container = styled.div`
  width: 100%;
  button:disabled {
    background: #EDEEF2!important;
    div {
      color: #565A69!important;
    }
  }
`
interface TokenClaimVeStarDialogProps {
  id: any,
  veStarReward: number,
  isOpen: boolean
  onDismiss: () => void
}

export default function TokenClaimVeStarDialog({
  id,
  veStarReward,
  onDismiss,
  isOpen,
}: TokenClaimVeStarDialogProps) {
  const provider = useStarcoinProvider();
  const {network: aptosNetwork} = useWallet();
  const chainId = getChainId(aptosNetwork?.name);
  const networkType = useGetType()
  const chainName = getChainName(chainId, networkType)
  const token = STAR_NAME[chainName]
  const starAddress = token.address;

  const theme = useContext(ThemeContext)

  const [loading, setLoading] = useState(false);
  const ADDRESS = useGetV2FactoryAddress()
  const { signAndSubmitTransaction } = useWallet();

  async function onClickConfirm() {
    try { 
      const MODULE = 'TokenSwapSyrupScript'
      const FUNC = 'take_vestar_by_stake_id'
      let transactionHash: string
      if (networkType === 'APTOS') {
        const tyArgs = [starAddress]
        const args = [new BigNumber(parseInt(id)).toNumber()]
        const payload: Types.TransactionPayload = {
          type: 'entry_function_payload',
          function: `${ ADDRESS }::${ MODULE }::${ FUNC }`,
          type_arguments: tyArgs,
          arguments: args
        };
        const transactionRes = await signAndSubmitTransaction(payload);
        transactionHash = transactionRes?.hash || ''
      } else {
        const functionId = `${ADDRESS}::${MODULE}::${FUNC}`;
        const strTypeArgs = [starAddress];
        const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);

        const claimStakeIdSCSHex = (function () {
          const se = new bcs.BcsSerializer();
          se.serializeU64(parseInt(id));
          return hexlify(se.getBytes());
        })();

        const args = [
          arrayify(claimStakeIdSCSHex)
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
      let intervalId: NodeJS.Timeout
      intervalId = setInterval(async () => {
        const txnInfo = await provider!.send('chain.get_transaction_info', [transactionHash])
        if (networkType === 'STARCOIN' && txnInfo?.status === 'Executed' || networkType === 'APTOS' && txnInfo?.success) {
          setLoading(false);
          onDismiss();
          clearInterval(intervalId);
          window.location.reload();
        }
      }, 3000);
    } catch (error) {
      console.error(error);
    }
    return false;
  }
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} dialogBg={ theme.bgCard }>
      <ColumnCenter style={{ padding: '27px 32px'}}>
        <AutoRow>
          <TYPE.black fontWeight={500} fontSize={20}>
            <Trans>Claim rewared {veStarReward.toFixed(9)} veSTAR</Trans>
          </TYPE.black>
        </AutoRow>
        {loading && (
          <CircularProgress
            size={64}
            sx={{
              marginTop: '10px',
              zIndex: 1
            }}
          />
        )}
        <Container>
          <RowBetween style={{ marginTop: '24px' }}>
            <ButtonBorder marginRight={22} onClick={()=>{
              setLoading(false);
              onDismiss();
              }} >
              <TYPE.black fontSize={20}>
                <Trans>Cancel</Trans>
              </TYPE.black>
            </ButtonBorder>
            <ButtonFarm id='sss' disabled={loading} onClick={() => {
              onClickConfirm();
              setLoading(true);
              setTimeout(onDismiss, 30000);
              setTimeout("window.location.reload()", 60000);
            }}>
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