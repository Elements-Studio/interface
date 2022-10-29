import axios from 'axios';
import useSWR from "swr";
import { Trans } from '@lingui/macro'
import styled from 'styled-components'
import { RouteComponentProps, Link } from 'react-router-dom'
import { Text } from 'rebass'
import QuestionHelper from '../../components/QuestionHelper'
import { AutoRow, RowFixed, RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { ButtonFarm, ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import FarmTitle from '../../components/farm/FarmTitle'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import FarmCard from '../../components/farm/FarmCard'
import CurrencyLogo from '../../components/CurrencyLogo'
import { COMMON_BASES } from '../../constants/routing'
import { unwrappedToken } from '../../utils/unwrappedToken'
import { useIsDarkMode, useIsBoost } from '../../state/user/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from 'hooks/web3'
import { useGetCurrentNetwork } from 'state/networktype/hooks'

export const FixedHeightRow = styled(RowBetween)`
  height: 30px;
`

const fetcher = (url:any) => axios.get(url).then(res => res.data)

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
  const network = useGetCurrentNetwork(chainId)
  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()
  const darkMode = useIsDarkMode();

  const lpTokenScalingFactor = 1000000000;
  const starScalingFactor = 1000000000;

  const isBoost = useIsBoost()

  const { data: list, error } = useSWR(
    `https://swap-api.starswap.xyz/${network}/v1/lpTokenFarms`,
    fetcher
  );

  if (error) return null;
  if (!list) return null;

  
  const bases = typeof chainId !== 'undefined' ? COMMON_BASES[chainId] ?? [] : []
  
  const MultiplierTips = () =>{
    return (
    <>
    <Trans>The Stepwise Multiplier represents the proportion of STAR rewards each farm receives, as a proportion of the STAR produced each block.</Trans><br/><br/>
    <Trans>For example, if a 1x farm received 1 STAR per block, a 40x farm would receive 40 STAR per block.</Trans><br /><br />
    <Trans>This amount is already included in all APR calculations for the farm.</Trans>
    <br/>
    </>
    )
  }
  return (
    <>
      <FarmTitle />
      <AutoRow justify="center" style={{ paddingTop: '1rem', maxWidth: '1200px' }}>
        {list ? list.map((item:any,index:any) => {
          const tokenX = bases.filter(token => token.symbol === item.liquidityTokenFarmId.liquidityTokenId.tokenXId)
          const tokenY = bases.filter(token => token.symbol === item.liquidityTokenFarmId.liquidityTokenId.tokenYId)
          const token0 = tokenX[0]
          const token1 = tokenY[0]
          const currency0 = unwrappedToken(token0)
          const currency1 = unwrappedToken(token1)
          return (
            <FarmCard key={index}>
              <AutoColumn justify="center">
                <RowFixed>
                  <CurrencyLogo currency={currency0} size={'48px'} style={{borderRadius: '8px'}} />
                  <CurrencyLogo currency={currency1} size={'48px'} style={{borderRadius: '8px'}} />
                </RowFixed>
                <Text fontSize={16} marginTop={23}>
                  {token0.symbol}/{token1.symbol}
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
                    {token0.symbol} - {token1.symbol} 
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
                    {Number(item.tvlInUsd).toFixed(2)}
                  </TYPE.black>
                </RowFixed>
              </FarmRow>
              <FarmRow style={{ marginTop: '10px', marginBottom: '10px' }}>
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
              <FarmRow style={{ marginTop: '10px', marginBottom: '20px' }}>
                <RowFixed>
                  <TYPE.black fontWeight={400} fontSize={14}>
                    <Trans>Daily Reward</Trans>
                  </TYPE.black>
                </RowFixed>
                <RowFixed>
                  <TYPE.black fontSize={14}>
                    {Number(item.dailyReward / starScalingFactor) || 0}
                  </TYPE.black>
                </RowFixed>
              </FarmRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  <Trans>APR</Trans>
                </Text>
                <RowFixed>
                  <Text fontSize={16} fontWeight={500}>
                    {item.estimatedApy.toFixed(2)}%
                  </Text>
                  <QuestionHelper
                    text={
                      <Trans>The estimated annualized percentage yield of rewards</Trans>
                    }
                  />
                </RowFixed>
              </FixedHeightRow>
              {
                isBoost ? (
                  <FixedHeightRow>
                    <Text fontSize={16} fontWeight={500}>
                      <Trans>Boost APR</Trans>
                    </Text>
                    <RowFixed>
                      <Text fontSize={16} fontWeight={500}>
                        {(item.estimatedApy).toFixed(2)}% ~ {(item.estimatedApy * 2.5).toFixed(2)}%
                      </Text>
                      <QuestionHelper
                        text={
                          <Trans>The boosted estimated annualized percentage yield of rewards</Trans>
                        }
                      />
                    </RowFixed>
                  </FixedHeightRow>
                ) : null
              }
              <FixedHeightRow marginBottom={16}>
                <Text fontSize={16} fontWeight={500}>
                  <Trans>Multiplier</Trans>
                </Text>
                <RowFixed>
                  <Text fontSize={16} fontWeight={500}>
                    { item.rewardMultiplier || 0 }x
                  </Text>
                  <QuestionHelper
                    text={MultiplierTips()}
                  />
                </RowFixed>
              </FixedHeightRow>
              {
                !account ? (
                  <ButtonLight onClick={toggleWalletModal}>
                    <Trans>Connect Wallet</Trans>
                  </ButtonLight>
                ): (
                  <ButtonFarm as={Link}
                    to={account ? `/farm/${token0.symbol}/${token1.symbol}` : `/farm`}
                   >
                    <TYPE.main color={'#fff'}>
                      <Trans>Stake</Trans>
                    </TYPE.main>
                  </ButtonFarm>
                )
              }
            </FarmCard>
          )
        }) : null}
      </AutoRow>
      <SwitchLocaleLink />
    </>
  )
}
