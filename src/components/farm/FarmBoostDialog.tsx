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

interface FarmUnstakeDialogProps {
  tokenX: any,
  tokenY: any,
  veStarAmount: number,
  lpTokenScalingFactor: number,
  isOpen: boolean
  onDismiss: () => void
}

export default function FarmUnstakeDialog({
  tokenX,
  tokenY,
  veStarAmount,
  lpTokenScalingFactor,
  onDismiss,
  isOpen,
}: FarmUnstakeDialogProps) {

  const starcoinProvider = useStarcoinProvider();
  const { account, chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)
  
  async function onClickUnstakeConfirm() {
    try {
      const functionId = `${V2_FACTORY_ADDRESS}::TokenSwapFarmScript::boost`;
      const strTypeArgs = [tokenX, tokenY];
      const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);

      const boostAmount = new BigNumber(veStarAmount);
      const boostAmountSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU128(new BigNumber(boostAmount).toNumber());
        return hexlify(se.getBytes());
      })();
      const args = [
        arrayify(boostAmountSCSHex)
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
            <Trans>Boost My LP Staking</Trans>
          </TYPE.black>
        </AutoRow>
        <RowBetween style={{ marginTop: '8px' }}>
          <TYPE.black fontWeight={500} fontSize={14} style={{ marginTop: '10px', lineHeight: '20px' }}>
            <Trans>VeStar:</Trans>：{veStarAmount / lpTokenScalingFactor}
          </TYPE.black>
        </RowBetween>
        <Container>
          <RowBetween style={{ marginTop: '24px' }}>
            <ButtonBorder marginRight={22} onClick={onDismiss} >
              <TYPE.black fontSize={20}>
                <Trans>Cancel</Trans>
              </TYPE.black>
            </ButtonBorder>
            <ButtonFarm 
              disabled={veStarAmount === 0} 
              onClick={() => {
                onClickUnstakeConfirm();
                setTimeout(onDismiss, 2500);
                setTimeout("window.location.reload()", 10000);
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