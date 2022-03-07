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
import { useActiveWeb3React } from 'hooks/web3'
import { useStarcoinProvider } from 'hooks/useStarcoinProvider'
import BigNumber from 'bignumber.js';
import { arrayify, hexlify } from '@ethersproject/bytes';
import { utils, bcs } from '@starcoin/starcoin';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from '@mui/material/CircularProgress'

const Container = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  width: 100%;
  height: 88px;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
`

const RadioContainer = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  width: 100%;
  margin-top: 16px;
  padding-top: 12px;
  padding-left: 16px;
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

interface FarmStakeDialogProps {
  token: any,
  pool: any,
  stakeTokenBalance: number,
  stakeTokenScalingFactor: number,
  isOpen: boolean
  onDismiss: () => void
}

export default function FarmStakeDialog({
  token,
  pool,
  stakeTokenBalance,
  stakeTokenScalingFactor,
  onDismiss,
  isOpen,
}: FarmStakeDialogProps) {

  const starcoinProvider = useStarcoinProvider();
  const { account, chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)
  
  const [stakeNumber, setStakeNumber] = useState<any>('')
  const [duration, setDuration] = useState<any>('');
  const [loading, setLoading] = useState(false);

  const handleDurationChange = (event:any) => {
    setDuration(event.target.value);
    // console.log({duration})
  };

  function parseStakeNumber(value: string) {
    setStakeNumber(value)
    // console.log({stakeNumber})
  }

  async function onClickStakeConfirm() {
    try {
      const functionId = `${V2_FACTORY_ADDRESS}::TokenSwapSyrupScript::stake`;
      const strTypeArgs = [STAR[(chainId ? chainId : 1)].address];
      const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);

      const stakeAmount = new BigNumber(parseFloat(stakeNumber)).times('1000000000'); // stakeAmount * 1e9
      // const stakeAmount = 50; // stakeAmount * 1e9
      const stakeDuration = duration;

      const stakeDurationSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU64(new BigNumber(stakeDuration).toNumber());
        return hexlify(se.getBytes());
      })();
      const stakeAmountSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU128(new BigNumber(stakeAmount).toNumber());
        return hexlify(se.getBytes());
      })();
      const args = [
        arrayify(stakeDurationSCSHex),
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
            <Trans>Stake Token</Trans>
          </TYPE.black>
        </AutoRow>
        <RowBetween style={{ marginTop: '8px' }}>
          <TYPE.black fontWeight={500} fontSize={14} style={{ marginTop: '10px', lineHeight: '20px' }}>
            <Trans>STAR Balance</Trans>：{stakeTokenBalance / stakeTokenScalingFactor}
          </TYPE.black>
        </RowBetween>
        <Container>
          <Input
            placeholder={'0.0'}
            value={stakeNumber}
            onChange={(e) => parseStakeNumber(e.target.value)}
            style={{ height: '28px', width: '100%', background: 'transparent', textAlign: 'left', marginTop: '28px', marginLeft: '18px' }}
          />
          <ColumnRight style={{ marginRight: '24px', textAlign: 'right' }}>
            <ButtonText style={{ marginTop: '28px', lineHeight: '28px' }} onClick={() => { setStakeNumber((stakeTokenBalance / stakeTokenScalingFactor).toString()) }}>
              <TYPE.black fontWeight={500} fontSize={20} color={'#FD748D'} style={{ lineHeight: '28px' }}>
                <Trans>MAX</Trans>
              </TYPE.black>
            </ButtonText>
          </ColumnRight>
        </Container>
        <RadioContainer>
          <FormControl component="fieldset">
            <FormLabel component="legend"><Trans>Duration</Trans></FormLabel>
            <RadioGroup aria-label="duration" name="duration" value={duration} onChange={handleDurationChange}>
              {/*
              <FormControlLabel value="10" control={<Radio />} label="10 Seconds" />
              <FormControlLabel value="86400" control={<Radio />} label="1 Day" />
              <FormControlLabel value="31536000" disabled control={<Radio />} label="(365 Days)" />
              <FormControlLabel value="100" control={<Radio />} label="100 Seconds" />
              <FormControlLabel value="3600" control={<Radio />} label="1 hour" />
              */}
              <FormControlLabel value="604800" control={<Radio />} label={`7 Days (2x)  ${pool !== [] ? (pool[0].estimatedApy*2).toFixed(4) : ''}%`}/>
              <FormControlLabel value="1209600" control={<Radio />} label={`14 Days (3x)  ${pool !== [] ? (pool[0].estimatedApy*3).toFixed(4) : ''}%`}/>
              <FormControlLabel value="2592000" control={<Radio />} label={`30 Days (4x)  ${pool !== [] ? (pool[0].estimatedApy*4).toFixed(4) : ''}%`}/>
              <FormControlLabel value="5184000" control={<Radio />} label={`60 Days (6x)  ${pool !== [] ? (pool[0].estimatedApy*6).toFixed(4) : ''}%`}/>
              <FormControlLabel value="7776000" control={<Radio />} label={`90 Days (8x)  ${pool !== [] ? (pool[0].estimatedApy*8).toFixed(4) : ''}%`}/>
            </RadioGroup>
          </FormControl>
        </RadioContainer>
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
          <ButtonBorder marginRight={22} onClick={onDismiss} >
            <TYPE.black fontSize={20}>
              <Trans>Cancel</Trans>
            </TYPE.black>
          </ButtonBorder>
          <ButtonFarm onClick={() => {
            onClickStakeConfirm();
            setLoading(true);
            setTimeout(onDismiss, 30000);
            setTimeout("window.location.reload()", 60000);
          }}>
            <TYPE.main color={'#fff'}>
              <Trans>Confirm</Trans>
            </TYPE.main>
          </ButtonFarm>
        </RowBetween>
      </ColumnCenter>
    </Modal>
  )
}