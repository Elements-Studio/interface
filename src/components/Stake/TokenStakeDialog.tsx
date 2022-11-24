import { Currency, Token } from '@uniswap/sdk-core'
import { FACTORY_ADDRESS_STARCOIN as V2_FACTORY_ADDRESS } from '@starcoin/starswap-v2-sdk'
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
import { STAR_NAME } from '../../constants/tokens'
import { useIsBoost } from '../../state/user/hooks'
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
import useSWR from 'swr'
import axios from 'axios'
import { TxnBuilderTypes, BCS } from '@starcoin/aptos';
import { useGetType, useGetV2FactoryAddress, useGetCurrentNetwork } from 'state/networktype/hooks'
import getChainName from 'utils/getChainName'
import { useWallet } from '@starcoin/aptos-wallet-adapter'


const fetcher = (url:any) => axios.get(url).then(res => res.data)

const Container = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  width: 100%;
  height: 88px;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
`
const ConainerDisabled = styled.div`
width: 100%;
button:disabled {
  background: #EDEEF2!important;
  div {
    color: #565A69!important;
  }
}
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

interface TokenStakeDialogProps {
  token: any,
  stakeTokenBalance: number,
  stakeTokenScalingFactor: number,
  isOpen: boolean
  onDismiss: () => void
}

export default function TokenStakeDialog({
  token,
  stakeTokenBalance,
  stakeTokenScalingFactor,
  onDismiss,
  isOpen,
}: TokenStakeDialogProps) {

  const provider = useStarcoinProvider();
  const {account: aptosAccount, network: aptosNetwork} = useWallet();
  const chainId = Number(aptosNetwork?.chainId || 1);
  const account: any = aptosAccount?.address || '';
  const network = useGetCurrentNetwork(chainId)
  const networkType = useGetType()
  const theme = useContext(ThemeContext)
  const ADDRESS = useGetV2FactoryAddress()

  const [stakeNumber, setStakeNumber] = useState<any>('')
  const [duration, setDuration] = useState<any>(604800);
  const [loading, setLoading] = useState(false);

  const { data: pool, error } = useSWR(
    `https://swap-api.starcoin.org/${network}/v1/syrupPools`,
    fetcher
  );

  const { data, error: error2 } = useSWR(
    `https://swap-api.starswap.xyz/${network}/v1/syrupMultiplierPools?tokenId=STAR&estimateApr=true`,
    fetcher
  );

  const isBoost = useIsBoost()

  // if (error) return "An error has occurred.";
  // if (!data) return "Loading...";
  if (error) return null;
  if (error2) return null;
  if (!pool || !data) return null;

  const poolList = pool ?  pool.filter((item:any)=>item.description==='STAR') : [];

  const onCancle = () =>{
    setLoading(false);
    setStakeNumber(0);
    setDuration(604800);
    onDismiss();

  }
  const handleDurationChange = (event:any) => {
    setDuration(Number(event.target.value));
    // console.log({duration})
  };

  function parseStakeNumber(value: string) {
    setStakeNumber(value)
    // console.log({stakeNumber})
  }

  async function onClickStakeConfirm() {
    const chainName = getChainName(chainId, networkType)
    const token = STAR_NAME[chainName]
    const starAddress = token.address;
    try {
      const MODULE = 'TokenSwapSyrupScript'
      const FUNC = 'stake'
      let payloadHex: string
      if (networkType === 'APTOS') {
        const tyArgs = [
          new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString(starAddress)),
        ]
        const stakeAmount = new BigNumber(parseFloat(stakeNumber)).times(Math.pow(10, token.decimals)); 

        const args = [BCS.bcsSerializeUint64(new BigNumber(duration).toNumber()), BCS.bcsSerializeU128(new BigNumber(stakeAmount).toNumber())]
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

        const stakeAmount = new BigNumber(parseFloat(stakeNumber)).times(Math.pow(10, token.decimals)); 

        const stakeAmountSCSHex = (function () {
          const se = new bcs.BcsSerializer();
          se.serializeU128(new BigNumber(stakeAmount).toNumber());
          return hexlify(se.getBytes());
        })();

        const stakeDuration = duration;

        const stakeDurationSCSHex = (function () {
          const se = new bcs.BcsSerializer();
          se.serializeU64(new BigNumber(stakeDuration).toNumber());
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

  const veStarAmount = (isBoost && stakeNumber && duration) ? (stakeNumber * (duration / 86400) / ( 365 * 2 )) : 0
  const veStarAmountText = veStarAmount > 0 ? veStarAmount.toFixed(9) : undefined
  const isTest = process.env.REACT_APP_STARSWAP_IN_TEST === 'true';
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
              {/* {
                isTest ? (
                  <>
                  <FormControlLabel key="100" value="100" control={<Radio />} label="100 Seconds" />
                  <FormControlLabel key="3600" value="3600" control={<Radio />} label="1 hour" />
                  </>
                ) : null
              } */}
              {
                data.map((item: any) => {
                  if (item.pledgeTimeSeconds === 100) {
                    return (
                      <FormControlLabel key={item.pledgeTimeSeconds}  value={item.pledgeTimeSeconds} control={<Radio />} label={`100 Seconds (${item.multiplier}x)  ${ item.estimatedApr.toFixed(4) }%`}/>
                    )
                  }else if(item.pledgeTimeSeconds === 3600) {
                    return (
                      <FormControlLabel key={item.pledgeTimeSeconds} value={item.pledgeTimeSeconds} control={<Radio />} label={`1 hour (${item.multiplier}x)  ${ item.estimatedApr.toFixed(4) }%`}/>
                    )
                  }else{
                    return (
                      <FormControlLabel key={item.pledgeTimeSeconds} value={item.pledgeTimeSeconds} control={<Radio />} label={`${item.pledgeTimeSeconds/3600/24} Days (${item.multiplier}x)  ${ item.estimatedApr.toFixed(4) }%`}/>
                    )
                  }
                })
              }
            </RadioGroup>
          </FormControl>
        </RadioContainer>
        {
          veStarAmountText && (
            <>
              <AutoRow><Trans>When you Stake, you will get {veStarAmountText} veSTAR immediately.</Trans></AutoRow>
              <AutoRow><Trans>When you Unstake, you need to have at least {veStarAmountText} veSTAR in your balance to unstake.</Trans></AutoRow>
            </>
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
        <ConainerDisabled>
          <RowBetween style={{ marginTop: '24px' }}>
            <ButtonBorder marginRight={22} onClick={onCancle} >
              <TYPE.black fontSize={20}>
                <Trans>Cancel</Trans>
              </TYPE.black>
            </ButtonBorder>
            <ButtonFarm disabled={!(isBoost ? veStarAmount > 0 : stakeNumber > 0)} onClick={() => {
              onClickStakeConfirm();
            }}>
              <TYPE.main color={'#fff'}>
                <Trans>Confirm</Trans>
              </TYPE.main>
            </ButtonFarm>
          </RowBetween>
        </ConainerDisabled>
      </ColumnCenter>
    </Modal>
  )
}