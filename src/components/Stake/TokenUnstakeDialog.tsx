import { FACTORY_ADDRESS_STARCOIN as V2_FACTORY_ADDRESS } from '@starcoin/starswap-v2-sdk'
import { useState, useContext } from 'react'
import { Trans } from '@lingui/macro'
import { TYPE } from '../../theme'
import styled, { ThemeContext } from 'styled-components'
import { ColumnCenter } from '../Column'
import { RowBetween, AutoRow } from '../Row'
import Modal from '../Modal'
import { STAR } from '../../constants/tokens'
import { ButtonFarm, ButtonBorder } from 'components/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useActiveWeb3React } from 'hooks/web3'
import { useStarcoinProvider } from 'hooks/useStarcoinProvider'
import { arrayify, hexlify } from '@ethersproject/bytes'
import { utils, bcs } from '@starcoin/starcoin'
import BigNumber from 'bignumber.js';
import { TxnBuilderTypes, BCS } from '@starcoin/aptos';
import { useGetType, useGetV2FactoryAddress } from 'state/networktype/hooks'

const Container = styled.div`
  width: 100%;
  button:disabled {
    background: #EDEEF2!important;
    div {
      color: #565A69!important;
    }
  }
`
interface TokenUnstakeDialogProps {
  id: any,
  isOpen: boolean
  onDismiss: () => void
}

export default function TokenUnstakeDialog({
  id,
  onDismiss,
  isOpen,
}: TokenUnstakeDialogProps) {
  const provider = useStarcoinProvider();
  const { chainId } = useActiveWeb3React()
  const networkType = useGetType()

  const theme = useContext(ThemeContext)

  const [loading, setLoading] = useState(false);
  
  const ADDRESS = useGetV2FactoryAddress()

  async function onClickConfirm() {
    const starAddress = STAR[(chainId ? chainId : 1)].address;
    try {
      const MODULE = 'TokenSwapSyrupScript'
      const FUNC = 'unstake'
      let payloadHex: string
      if (networkType === 'APTOS') {
        const tyArgs = [
          new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString(starAddress)),
        ]

        const args = [BCS.bcsSerializeUint64(new BigNumber(parseInt(id)).toNumber())]
        
        const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
          TxnBuilderTypes.EntryFunction.natural(
            `${ ADDRESS }::${MODULE}`,
            FUNC,
            tyArgs,
            args,
          ),
        );
        payloadHex = hexlify(BCS.bcsToBytes(entryFunctionPayload))
      } else {
        const functionId = `${ADDRESS}::${MODULE}::${FUNC}`;
        const strTypeArgs = [starAddress];
        const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);

        const unstakeIdSCSHex = (function () {
          const se = new bcs.BcsSerializer();
          se.serializeU64(parseInt(id));
          return hexlify(se.getBytes());
        })();

        const args = [
          arrayify(unstakeIdSCSHex)
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
            <Trans>Unstake STAR</Trans>
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