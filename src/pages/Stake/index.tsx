import { Trans } from '@lingui/macro'
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
import StarswapBlueLogo from '../../assets/svg/starswap_logo.svg'
import PortisIcon from '../../assets/images/portisIcon.png'
import { useIsDarkMode } from '../../state/user/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from 'hooks/web3'
import getCurrentNetwork from '../../utils/getCurrentNetwork'
import axios from 'axios';
import useSWR from "swr";

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


export default function Farm({ history }: RouteComponentProps) {
  const { account, chainId } = useActiveWeb3React()
  const network = getCurrentNetwork(chainId)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const starScalingFactor = 1000000000;

  const { data: pool, error } = useSWR(
    `https://swap-api.starswap.xyz/${network}/v1/syrupPools`,
    fetcher
  );
  
  // if (error) return "An error has occurred.";
  // if (!data) return "Loading...";
  if (error) return null;
  if (!pool) return null;
  const list = pool.filter((item:any)=>item.description==='STAR');

  // const darkMode = useIsDarkMode();

  /*
  const list = [
    {
      liquidityTokenFarmId: { 
        farmAddress: "1", 
        liquidityTokenId: { tokenXId: "Bot", tokenYId: "Ddd", liquidityTokenAddress: "0x07fa08a855753f0ff7292fdcbe871216" }
      },
      description: "Bot<->Ddd Pool", 
      sequenceNumber: 11, 
      totalStakeAmount: null, 
      deactived: false, 
      createdBy: "admin", 
      updatedBy: "admin", 
      createdAt: 1630661107485, 
      updatedAt: 1630661107485 
    },
    {
      liquidityTokenFarmId: { 
        farmAddress: "2", 
        liquidityTokenId: { tokenXId: "Bot", tokenYId: "Ddd", liquidityTokenAddress: "0x07fa08a855753f0ff7292fdcbe871216" }
      },
      description: "Bot<->Ddd Pool", 
      sequenceNumber: 11, 
      totalStakeAmount: null, 
      deactived: false, 
      createdBy: "admin", 
      updatedBy: "admin", 
      createdAt: 1630661107485, 
      updatedAt: 1630661107485 
    },
    {
      liquidityTokenFarmId: { 
        farmAddress: "0x07fa08a855753f0ff7292fdcbe871216", 
        liquidityTokenId: { tokenXId: "Bot", tokenYId: "Ddd", liquidityTokenAddress: "0x07fa08a855753f0ff7292fdcbe871216" }
      },
      description: "Bot<->Ddd Pool", 
      sequenceNumber: 11, 
      totalStakeAmount: null, 
      deactived: false, 
      createdBy: "admin", 
      updatedBy: "admin", 
      createdAt: 1630661107485, 
      updatedAt: 1630661107485 
    },
    {
      liquidityTokenFarmId: { 
        farmAddress: "3", 
        liquidityTokenId: { tokenXId: "Bot", tokenYId: "Ddd", liquidityTokenAddress: "0x07fa08a855753f0ff7292fdcbe871216" }
      },
      description: "Bot<->Ddd Pool", 
      sequenceNumber: 11, 
      totalStakeAmount: null, 
      deactived: false, 
      createdBy: "admin", 
      updatedBy: "admin", 
      createdAt: 1630661107485, 
      updatedAt: 1630661107485 
    },
    {
      liquidityTokenFarmId: { 
        farmAddress: "0x07fa08a855753f0ff7292fdcbe871216", 
        liquidityTokenId: { tokenXId: "Bot", tokenYId: "Ddd", liquidityTokenAddress: "0x07fa08a855753f0ff7292fdcbe871216" }
      },
      description: "Bot<->Ddd Pool", 
      sequenceNumber: 11, 
      totalStakeAmount: null, 
      deactived: false, 
      createdBy: "admin", 
      updatedBy: "admin", 
      createdAt: 1630661107485, 
      updatedAt: 1630661107485 
    },
    {
      liquidityTokenFarmId: { 
        farmAddress: "0x07fa08a855753f0ff7292fdcbe871216", 
        liquidityTokenId: { tokenXId: "Bot", tokenYId: "Ddd", liquidityTokenAddress: "0x07fa08a855753f0ff7292fdcbe871216" }
      },
      description: "Bot<->Ddd Pool", 
      sequenceNumber: 11, 
      totalStakeAmount: null, 
      deactived: false, 
      createdBy: "admin", 
      updatedBy: "admin", 
      createdAt: 1630661107485, 
      updatedAt: 1630661107485 
    },
  ]
  */
  const tips = (base: any) =>{
    return (
    <>
    <Trans>The estimated annualized percentage yield of rewards.</Trans><br/><br/>
    7<Trans>Days</Trans>(2x) = { base ? (base * 2).toFixed(4) : '0'}%<br/>
    14<Trans>Days</Trans>(3x) = { base ? (base * 3).toFixed(4) : '0'}%<br/>
    30<Trans>Days</Trans>(4x) = { base ? (base * 4).toFixed(4) : '0'}%<br/>
    60<Trans>Days</Trans>(6x) = { base ? (base * 6).toFixed(4) : '0'}%<br/>
    90<Trans>Days</Trans>(8x) = { base ? (base * 8).toFixed(4) : '0'}%
    <br/>
    <br/>
    <Trans>STAR Stake APR Formula</Trans>
    <br/>
    </>
    )
  }

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
                    <TYPE.black fontSize={14}>{item.syrupPoolId.poolAddress.substring(0, 16) + '...'}</TYPE.black>
                  </RowFixed>
                </FarmRow>
                <FarmRow style={{ marginTop: '10px' }}>
                  <RowFixed>
                    <TYPE.black fontWeight={400} fontSize={14}>
                      <Trans>TVL in USDT</Trans>
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
                  <Text fontSize={16} fontWeight={500}>
                    &nbsp;&nbsp;&nbsp;&nbsp;<Trans>APR</Trans>
                  </Text>
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500}>
                      {(item.estimatedApy * 2).toFixed(2)}% ~ {(item.estimatedApy * 8).toFixed(2)}%
                    </Text>
                    <QuestionHelper text={tips(item.estimatedApy)} />
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
                <TYPE.body fontSize={12} style={{ marginTop: '12px', display: 'inline-flex' }}>
                  <Link to={`/stake/simulator`}>
                    <Trans>Boost Simulator</Trans>
                  </Link>
                </TYPE.body>
                <TYPE.body fontSize={12} style={{ margin: '12px 0 0 24px', display: 'inline-flex' }}>
                  <Link to={`/stake/buyBack`}>
                    <Trans>Buy Back</Trans>
                  </Link>
                </TYPE.body>
              </FarmCard>
            ))
          : null}
      </AutoRow>
      <SwitchLocaleLink />
    </>
  )
}
