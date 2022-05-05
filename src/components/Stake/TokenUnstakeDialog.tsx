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
import { STAR } from '../../constants/tokens'
import { ButtonFarm, ButtonBorder, ButtonText } from 'components/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useActiveWeb3React } from 'hooks/web3'
import { useStarcoinProvider } from 'hooks/useStarcoinProvider'
import BigNumber from 'bignumber.js'
import { arrayify, hexlify } from '@ethersproject/bytes'
import { utils, bcs } from '@starcoin/starcoin'

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
  token: any,
  unstakeId: any,
  stakeTokenScalingFactor: number,
  isOpen: boolean
  onDismiss: () => void
}

export default function TokenUnstakeDialog({
  token,
  unstakeId,
  stakeTokenScalingFactor,
  onDismiss,
  isOpen,
}: TokenUnstakeDialogProps) {
  const starcoinProvider = useStarcoinProvider();
  const { account, chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

  const [loading, setLoading] = useState(false);
  
  async function onClickUnstakeConfirm() {
    try {
      const functionId = `${V2_FACTORY_ADDRESS}::TokenSwapSyrupScript::unstake`;
      const strTypeArgs = [STAR[(chainId ? chainId : 1)].address];
      const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);

      const unstakeIdSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU64(parseInt(unstakeId));
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
      const payloadInHex = (function () {
        const se = new bcs.BcsSerializer();
        scriptFunction.serialize(se);
        return hexlify(se.getBytes());
      })();

      await starcoinProvider.getSigner().sendUncheckedTransaction({
        data: payloadInHex,
      });
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
              onClickUnstakeConfirm();
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