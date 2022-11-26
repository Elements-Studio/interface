import { Trans } from '@lingui/macro'
import axios from 'axios';
import useSWR from "swr";
import { useCallback, useContext, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { RouteComponentProps, Link } from 'react-router-dom'
import { Text } from 'rebass'
import QuestionHelper from '../../components/QuestionHelper'
import Row, { AutoRow, RowFixed, RowBetween } from '../../components/Row'
import { TYPE,IconWrapper } from '../../theme'
import { ButtonFarm, ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import StakeTitle from '../../components/Stake/StakeTitle'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import FarmCard from '../../components/farm/FarmCard'
import CurrencyLogo from '../../components/CurrencyLogo'
import { marginTop, maxWidth, paddingTop } from 'styled-system'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import STCLogo from '../../assets/images/stc.png'
import STCBlueLogo from '../../assets/svg/stc.svg'
import StarswapBlueLogo from '../../assets/svg/starswap_logo_blue.svg'
import PortisIcon from '../../assets/images/portisIcon.png'
import { useIsDarkMode } from '../../state/user/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from 'hooks/web3'
import { useGetType, useGetCurrentNetwork } from 'state/networktype/hooks'
import { useWallet } from '@starcoin/aptos-wallet-adapter'
import getChainId from 'utils/getChainId';

export const FixedHeightRow = styled(RowBetween)`
  height: 30px;
`

const fetcher = (url:any) => axios.get(url).then(res => res.data)

/*
const fetcher = (
  url:any,
  {
    method: 'POST', 
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {"key" : "some text"}
  }
  ) => fetch(url).then((res) => res.json());
*/

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 4px;
`
const FarmRow = styled(RowBetween)`
  background: ${({ theme }) => theme.bg7};
  line-height: 20px;
  border-radius: 8px;
  padding: 6px 16px;
`


export default function Stake({ history }: RouteComponentProps) {
  const {account: aptosAccount, network: aptosNetwork} = useWallet();
  const chainId = getChainId(aptosNetwork?.name);
  const account: any = aptosAccount?.address || '';
  const network = useGetCurrentNetwork(chainId)
  const networkType = useGetType()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const starScalingFactor = 1000000000;

  const { data: pool, error } = useSWR(
    `https://swap-api.starswap.xyz/${network}/v1/syrupPools`,
    fetcher
  );
  
  const { data, error: error2 } = useSWR(
    `https://swap-api.starswap.xyz/${network}/v1/syrupMultiplierPools?tokenId=STAR&estimateApr=true`,
    fetcher
  );

  // if (error) return "An error has occurred.";
  // if (!data) return "Loading...";
  if (error) return null;
  if (error2) return null;
  if (!pool || !data) return null;
  
  const list = pool.filter((item:any)=>item.description==='STAR');

  // const darkMode = useIsDarkMode();

  /*
  const data = [
    {
      "pledgeTimeSeconds": 100,
      "multiplier": 1,
      "assetAmount": 0,
      "assetWeight": 0,
      "poolRatio": 0,
      "estimatedApr": 0
    },
    {
      "pledgeTimeSeconds": 3600,
      "multiplier": 1,
      "assetAmount": 0,
      "assetWeight": 0,
      "poolRatio": 0,
      "estimatedApr": 0
    },
    {
      "pledgeTimeSeconds": 604800,
      "multiplier": 1,
      "assetAmount": 144798212259248,
      "assetWeight": 144798212259248,
      "poolRatio": 0.008305096,
      "estimatedApr": 4.1602162
    },
    {
      "pledgeTimeSeconds": 1209600,
      "multiplier": 2,
      "assetAmount": 16467204830351,
      "assetWeight": 32934409660702,
      "poolRatio": 0.001888997,
      "estimatedApr": 8.320431
    },
    {
      "pledgeTimeSeconds": 2592000,
      "multiplier": 6,
      "assetAmount": 14025708880698,
      "assetWeight": 84154253284188,
      "poolRatio": 0.00482678,
      "estimatedApr": 24.9612958
    },
    {
      "pledgeTimeSeconds": 5184000,
      "multiplier": 9,
      "assetAmount": 32471861200349,
      "assetWeight": 292246750803141,
      "poolRatio": 0.016762206,
      "estimatedApr": 37.4419479
    },
    {
      "pledgeTimeSeconds": 7776000,
      "multiplier": 12,
      "assetAmount": 1406727415929985,
      "assetWeight": 16880728991159820,
      "poolRatio": 0.96821692,
      "estimatedApr": 49.9225958
    }
  ]
  */
  const tips = (data: any) =>{
    const list = data.filter((item:any)=>item.estimatedApr > 0).map((item: any) => {
      return (
        <>
        {item.pledgeTimeSeconds/3600/24}<Trans>Days</Trans>({item.multiplier}x) = { item.estimatedApr.toFixed(4) }%<br/>
        </>
      )
    })
      
    return (
    <>
    <Trans>The estimated annualized percentage yield of rewards.</Trans><br/><br/>
    {list}
    <br/>
    </>
    )
  }
  let aprMin = 0
  let aprMax = 0
  data.map((item:any,index:any)=> {
    item.key = index
    if (item.estimatedApr > 0 ) {
      if( item.estimatedApr > aprMax) {
        aprMax = item.estimatedApr 
      }
      if (aprMin === 0){
        aprMin = item.estimatedApr 
      }else if (item.estimatedApr < aprMin){
        aprMin = item.estimatedApr 
      }
    }
  })
  return (
    <>
      <StakeTitle />
      <AutoRow justify="center" style={{ paddingTop: '30px', maxWidth: '1200px' }}>
        {list
          ? list.map((item: any, index: any) => (
              <FarmCard key={index}>
                <AutoColumn justify="center">
                  <RowFixed>
                    <StyledEthereumLogo src={StarswapBlueLogo} size={'48px'} />
                    {/*
                  <StyledEthereumLogo src={EthereumLogo} style={{ marginRight: '1.25rem' }} size={'48px'} />
                  */}
                  </RowFixed>
                  <Text fontSize={16} marginTop={23}>
                    {item.syrupPoolId.tokenId}
                  </Text>
                </AutoColumn>
                <FarmRow style={{ marginTop: '30px' }}>
                  <RowFixed>
                    <TYPE.black fontWeight={400} fontSize={14}>
                      <Trans>Token Address</Trans>
                    </TYPE.black>
                  </RowFixed>
                  <RowFixed>
                    <TYPE.black fontSize={14}>{ item.syrupPoolId.poolAddress.substring(0,7) + '...' + item.syrupPoolId.poolAddress.substring(item.syrupPoolId.poolAddress.length-5) }</TYPE.black>
                    <QuestionHelper text={item.syrupPoolId.poolAddress} />
                  </RowFixed>
                </FarmRow>
                <FarmRow style={{ marginTop: '10px' }}>
                  <RowFixed>
                    <TYPE.black fontWeight={400} fontSize={14}>
                      <Trans>TVL in USD</Trans>
                    </TYPE.black>
                  </RowFixed>
                  <RowFixed>
                    <TYPE.black fontSize={14}>{item.tvlInUsd.toFixed(2) || 0}</TYPE.black>
                  </RowFixed>
                </FarmRow>
                <FarmRow style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <RowFixed>
                    <TYPE.black fontWeight={400} fontSize={14}>
                      <Trans>Total Stake Amount</Trans>
                    </TYPE.black>
                  </RowFixed>
                  <RowFixed>
                    <TYPE.black fontSize={14}>
                      {Number(item.totalStakeAmount / starScalingFactor).toFixed(2) || 0}
                    </TYPE.black>
                  </RowFixed>
                </FarmRow>
                <FarmRow style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <RowFixed>
                    <TYPE.black fontWeight={400} fontSize={14}>
                      <Trans>Reward Token</Trans>
                    </TYPE.black>
                  </RowFixed>
                  <RowFixed>
                    <TYPE.black fontSize={14}>{item.rewardTokenId}</TYPE.black>
                  </RowFixed>
                </FarmRow>
                <FarmRow style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <RowFixed>
                    <TYPE.black fontWeight={400} fontSize={14}>
                      <Trans>Daily Reward</Trans>
                    </TYPE.black>
                  </RowFixed>
                  <RowFixed>
                    <TYPE.black fontSize={14}>{Number(item.dailyReward / starScalingFactor) || 0}</TYPE.black>
                  </RowFixed>
                </FarmRow>
                { 
                  networkType === 'STARCOIN' && (
                    <FarmRow style={{ marginTop: '10px', marginBottom: '10px' }}>
                      <RowFixed>
                        <TYPE.black fontWeight={400} fontSize={14}>
                          <Trans>Pool Created</Trans>
                        </TYPE.black>
                      </RowFixed>
                      <RowFixed>
                        <TYPE.black fontSize={14}>{(new Date(item.createdAt) + '').slice(4, 24)}</TYPE.black>
                      </RowFixed>
                    </FarmRow>
                  ) 
                }
                <FarmRow style={{ marginTop: '10px', marginBottom: '20px' }}>
                  <RowFixed>
                    <TYPE.black fontWeight={400} fontSize={14}>
                      <Trans>Pool Updated</Trans>
                    </TYPE.black>
                  </RowFixed>
                  <RowFixed>
                    <TYPE.black fontSize={14}>{(new Date(item.updatedAt) + '').slice(4, 24)}</TYPE.black>
                  </RowFixed>
                </FarmRow>
                {/* <FarmRow style={{ marginTop: '10px', background: '#2FD8B2', marginBottom: '30px' }}>
                <RowFixed>
                  <TYPE.black fontWeight={400} fontSize={14}>
                    <Trans>Estimated annualized rate of return:</Trans>       
                  </TYPE.black>
                </RowFixed>
                <RowFixed>
                  <TYPE.black fontSize={14} style={{wordBreak: 'break-all'}}>
                    {item.estimatedApy}
                  </TYPE.black>
                </RowFixed>
              </FarmRow> */}
                <FixedHeightRow marginBottom={16}>
                  <Text fontSize={14} fontWeight={400}>
                    &nbsp;&nbsp;&nbsp;&nbsp;<Trans>APR</Trans>
                  </Text>
                  <RowFixed>
                    <Text fontSize={15} fontWeight={500}>
                      {aprMin.toFixed(2)}% ~ {aprMax.toFixed(2)}%
                    </Text>
                    <QuestionHelper text={tips(data)} />
                  </RowFixed>
                </FixedHeightRow>
                {/* <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  <Trans>Stepwise Multiplier</Trans>
                </Text>
                <RowFixed>
                  <Text fontSize={16} fontWeight={500}>
                    {item.rewardMultiplier || 1}
                  </Text>
                  <QuestionHelper
                    text={
                      <Trans>The Stepwise Multiplier represents the proportion of STAR rewards each farm receives, as a proportion of the STAR produced each block.<br /><br />
                      For example, if a 1x farm received 1 STAR per block, a 40x farm would receive 40 STAR per block.<br /><br />
                      This amount is already included in all APR calculations for the farm.</Trans>
                    }
                  />
                </RowFixed>
              </FixedHeightRow> */}
                {
                  !account ? (
                    <ButtonLight onClick={toggleWalletModal}>
                      <Trans>Connect Wallet</Trans>
                    </ButtonLight>
                  ): (
                    <ButtonFarm as={Link}
                      to={account ? `/stake/STAR` : '/stake'}
                    >
                      <TYPE.main color={'#fff'}>
                        <Trans>Stake</Trans>
                      </TYPE.main>
                    </ButtonFarm>
                  )
                }
                {
                  networkType === 'STARCOIN' && (
                    <TYPE.body fontSize={12} style={{ marginTop: '12px', display: 'inline-flex' }}>
                      <Link to={`/stake/simulator`}>
                        <Trans>Boost Simulator</Trans>
                      </Link>
                    </TYPE.body>
                  )
                }
                {
                  networkType === 'STARCOIN' && (
                    <TYPE.body fontSize={12} style={{ margin: '12px 0 0 24px', display: 'inline-flex' }}>
                      <Link to={`/stake/buyBack`}>
                        <Trans>Buy Back</Trans>
                      </Link>
                    </TYPE.body>
                  )
                }
              </FarmCard>
            ))
          : null}
      </AutoRow>
      <SwitchLocaleLink />
    </>
  )
}
