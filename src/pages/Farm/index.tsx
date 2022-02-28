import { Trans } from '@lingui/macro'
import { useCallback, useContext, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { RouteComponentProps, Link } from 'react-router-dom'
import { Text } from 'rebass'
import QuestionHelper from '../../components/QuestionHelper'
import Row, { AutoRow, RowFixed, RowBetween } from '../../components/Row'
import { TYPE,IconWrapper } from '../../theme'
import { ButtonFarm } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import FarmTitle from '../../components/farm/FarmTitle'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import FarmCard from '../../components/farm/FarmCard'
import CurrencyLogo from '../../components/CurrencyLogo'
import { marginTop, maxWidth, paddingTop } from 'styled-system'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import STCLogo from '../../assets/images/stc.png'
import FAILogo from '../../assets/images/fai_token_logo.png'
import STCBlueLogo from '../../assets/images/stc_logo_blue.png'
import StarswapBlueLogo from '../../assets/svg/starswap_product_logo_blue.svg'
import PortisIcon from '../../assets/images/portisIcon.png'
import { useIsDarkMode } from '../../state/user/hooks'
import { useActiveWeb3React } from 'hooks/web3'

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
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 4px;
`
const FarmRow = styled(RowBetween)`
  background: ${({ theme }) => theme.bg7};
  line-height: 20px;
  border-radius: 8px;
  padding: 6px 16px;
`


export default function Farm({ history }: RouteComponentProps) {
  let network = 'barnard';
  const { account, chainId } = useActiveWeb3React()
  if (chainId === 1) {
    network = 'main';
  }
  if (chainId === 252) {
    network = 'proxima';
  }

  const lpTokenScalingFactor = 1000000000;

  const { data, error } = useSWR(
    // `http://k8s-default-starswap-af6ced600d-1022591271.ap-northeast-1.elb.amazonaws.com/${network}-old/v1/lpTokenFarms`,
    `https://swap-api.starcoin.org/${network}-old/v1/lpTokenFarms`,
    fetcher
  );

  
  // if (error) return "An error has occurred.";
  // if (!data) return "Loading...";
  if (error) return null;
  if (!data) return null;
  const list = data;

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

  return (
    <>
      <FarmTitle />
      <AutoRow justify="center" style={{ paddingTop: '50px', maxWidth: '1200px' }}>
        {list ? list.map((item:any,index:any) => (
            <FarmCard key={index}>
              <AutoColumn justify="center">
                <RowFixed>
                  <StyledEthereumLogo src={STCBlueLogo} size={'48px'} />
                  <StyledEthereumLogo src={item.liquidityTokenFarmId.liquidityTokenId.tokenXId === 'STAR' ? StarswapBlueLogo : FAILogo } style={{ marginRight: '1.25rem' }} size={'48px'} />
                </RowFixed>
                <Text fontSize={16} marginTop={23}>
                  {item.liquidityTokenFarmId.liquidityTokenId.tokenYId}/{item.liquidityTokenFarmId.liquidityTokenId.tokenXId}
                </Text>
              </AutoColumn>
              <FarmRow style={{ marginTop: '30px' }}>
                <RowFixed>
                  <TYPE.black fontWeight={400} fontSize={14}>
                    <Trans>Token Pair</Trans>
                  </TYPE.black>
                </RowFixed>
                <RowFixed>
                  <TYPE.black fontSize={14}>
                    {item.liquidityTokenFarmId.liquidityTokenId.tokenXId} - {item.liquidityTokenFarmId.liquidityTokenId.tokenYId} 
                  </TYPE.black>
                </RowFixed>
              </FarmRow>
              <FarmRow style={{ marginTop: '10px' }}>
                <RowFixed>
                  <TYPE.black fontWeight={400} fontSize={14}>
                    <Trans>TVL in USDT</Trans>
                  </TYPE.black>
                </RowFixed>
                <RowFixed>
                  <TYPE.black fontSize={14}>
                    {Number(item.tvlInUsd / lpTokenScalingFactor)}
                  </TYPE.black>
                </RowFixed>
              </FarmRow>
              <FarmRow style={{ marginTop: '10px', marginBottom: '20px' }}>
                <RowFixed>
                  <TYPE.black fontWeight={400} fontSize={14}>
                    <Trans>Harvest Token</Trans>
                  </TYPE.black>
                </RowFixed>
                <RowFixed>
                  <TYPE.black fontSize={14}>
                    {item.rewardTokenId}
                  </TYPE.black>
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
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  <Trans>APR</Trans>
                </Text>
                <RowFixed>
                  <Text fontSize={16} fontWeight={500}>
                    {item.estimatedApy}%
                  </Text>
                  <QuestionHelper
                    text={
                      <Trans>The estimated annualized percentage yield of rewards.</Trans>
                    }
                  />
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  <Trans>Multiplier</Trans>
                </Text>
                <RowFixed>
                  <Text fontSize={16} fontWeight={500}>
                    { item.rewardMultiplier || 0 }x
                  </Text>
                  <QuestionHelper
                    text={
                      <Trans>The Multiplier represents the proportion of STAR rewards each farm receives, as a proportion of the STAR produced each block.<br /><br />
                      For example, if a 1x farm received 1 STAR per block, a 40x farm would receive 40 STAR per block.<br /><br />
                      This amount is already included in all APR calculations for the farm.</Trans>
                    }
                  />
                </RowFixed>
              </FixedHeightRow>
              <ButtonFarm as={Link} to={(window.starcoin && account)? `/farm/${item.liquidityTokenFarmId.liquidityTokenId.tokenXId}/${item.liquidityTokenFarmId.liquidityTokenId.tokenYId}` : `/farm`}>
                <TYPE.main color={'#fff'}>
                  <Trans>Stake</Trans>
                </TYPE.main>
              </ButtonFarm>
            </FarmCard>
        )) : null}
      </AutoRow>
      <SwitchLocaleLink />
    </>
  )
}
