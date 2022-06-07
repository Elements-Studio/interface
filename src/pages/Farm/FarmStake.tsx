import { Trans } from '@lingui/macro'
import { useCallback, useState, useEffect } from 'react'
import { ExtendedStar } from '../../constants/tokens'
import { Token, NativeCurrency } from '@uniswap/sdk-core'
import styled from 'styled-components'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import { STC, STAR, FAI, XUSDT } from '../../constants/tokens'
import { AutoRow, RowFixed, RowBetween } from '../../components/Row'
import { TYPE, ExternalLink } from '../../theme'
import { ButtonFarm, ButtonBorder } from '../../components/Button'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import FarmCard from '../../components/farm/FarmCard'
import FarmStakeDialog from '../../components/farm/FarmStakeDialog'
import FarmHarvestDialog from '../../components/farm/FarmHarvestDialog'
import FarmUnstakeDialog from '../../components/farm/FarmUnstakeDialog'
import FarmBoostDialog from '../../components/farm/FarmBoostDialog'
import CurrencyLogo from '../../components/CurrencyLogo'
import STCBlueLogo from '../../assets/images/stc_logo_blue.png'
import StarswapBlueLogo from '../../assets/svg/starswap_logo.svg'
import BoostFlame from '../../assets/svg/boost_flame.png'
import FAILogo from '../../assets/images/fai_token_logo.png'
import FAIBlueLogo from '../../assets/images/fai_token_logo_blue.png'
import { useActiveWeb3React } from '../../hooks/web3'
import { COMMON_BASES } from '../../constants/routing'
import { unwrappedToken } from '../../utils/unwrappedToken'
import { useLookupTBDGain, useUserStaked } from 'hooks/useTokenSwapFarmScript'
import { useUserLiquidity } from 'hooks/useTokenSwapRouter'
import useSWR from 'swr'
import axios from 'axios'
import { useIsDarkMode, useIsBoost } from '../../state/user/hooks'
import getCurrentNetwork from '../../utils/getCurrentNetwork'
import { useActiveLocale } from 'hooks/useActiveLocale'


const fetcher = (url:any) => axios.get(url).then(res => res.data)

const Container = styled.div`
  width: auto;
  button:disabled {
    background: #EDEEF2!important;
    div {
      color: #565A69!important;
    }
  }
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

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

const StyledGetLink = styled.a`
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  color: #FB578C;
  margin-top: 20px;
  margin-right: 20px;

  :hover {
    text-decoration: underline;
    opacity: 0.9;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }
`

export default function FarmStake({
  match: {
    params: { tokenX, tokenY },
  },
}: RouteComponentProps<{ tokenX: string, tokenY: string }>) {

  let address = '';
  let hasAccount = false;
  let isAuthorization = true
  let hasStake = false

  const { account, chainId } = useActiveWeb3React()

  if (account) {
    hasAccount = true;
    address = account.toLowerCase();
  }

  const bases = typeof chainId !== 'undefined' ? COMMON_BASES[chainId] ?? [] : []
  const _tokenX = bases.filter(token => token.symbol === tokenX)
  const _tokenY = bases.filter(token => token.symbol === tokenY)
  const token0 = _tokenX[0]
  const token1 = _tokenY[0]
  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)
  
  const addressX = (token0 as Token).address ? (token0 as Token).address : (token0.symbol=== 'STC' ? STC[(chainId ? chainId : 1)].address : '')
  const addressY = (token1 as Token).address ? (token1 as Token).address : (token1.symbol=== 'STC' ? STC[(chainId ? chainId : 1)].address : '')

  const network = getCurrentNetwork(chainId)

  const isBoost = useIsBoost()
  const [ veStarAmount, setVeStarAmount ] = useState(0)
  const [ boostFactorOrigin, setBoostFactorOrigin ] = useState(0)
  
  useEffect(
    () => {
      const url1 = `https://swap-api.starswap.xyz/${network}/v1/getAccountVeStarAmountAndBoostSignature?accountAddress=${address}`
      axios.get(url1).then(res => res.data).then(data => {
        if (isBoost) {
          setVeStarAmount(data.veStarAmount)
        }
      })
      if (isBoost) {
        const url2 = `https://swap-api.starswap.xyz/${network}/v1/getAccountFarmBoostFactor?tokenXId=${tokenX}&tokenYId=${tokenY}&accountAddress=${address}`
        axios.get(url2).then(res => res.data).then(data => {
          setBoostFactorOrigin(data)
        })
      }
    },
    [isBoost]
  )

  const { data: lpStakingData, error: errorLP } = useSWR(
    `https://swap-api.starswap.xyz/${network}/v1/getAccountFarmStakeInfo?tokenXId=${tokenX}&tokenYId=${tokenY}&accountAddress=${address}`,
    fetcher
  );

  const lpTokenScalingFactor = 1000000000;
  const tbdScalingFactor = 1000000000;
  const starScalingFactor = 1000000000;
  const stcScalingFactor = 1000000000;
  
  // boostFactor stored in Move is mulitpied by 100, 1.05 => 105
  const boostFactor = boostFactorOrigin? boostFactorOrigin/ 100 : 0;
  const tbdGain:any = useLookupTBDGain(address, addressX, addressY)?.data || 0;
  const userLiquidity:any = useUserLiquidity(address, addressX, addressY)?.data || 0;
  const { data, error } = useUserStaked(address, addressX, addressY);
  let userStaked: any = 0;
  if (error) {
    console.log(error)
  } else {
    userStaked = data || 0;
    if (userStaked[0] > 0) {
      hasStake = true;
    }
  }

  const [ stakeDialogOpen, setStakeDialogOpen ] = useState(false)
  const [ harvestDialogOpen, setHarvestDialogOpen ] = useState(false)
  const [ unstakeDialogOpen, setUnstakeDialogOpen ] = useState(false)
  const [ boostDialogOpen, setBoostDialogOpen ] = useState(false)

  const handleDismissStake = useCallback(() => {
    setStakeDialogOpen(false)
  }, [setStakeDialogOpen])

  const handleDismissHarvest = useCallback(() => {
    setHarvestDialogOpen(false)
  }, [setHarvestDialogOpen])

  const handleDismissUnstake = useCallback(() => {
    setUnstakeDialogOpen(false)
  }, [setUnstakeDialogOpen])

  const handleDismissBoost = useCallback(() => {
    setBoostDialogOpen(false)
  }, [setBoostDialogOpen])

  const local = useActiveLocale()
  return (
    <>
      <Container style={{ paddingTop: '1rem' }}>
        <AutoRow justify="center">
          <FarmCard>
            <AutoColumn justify="center">
              <RowFixed>
                <StyledEthereumLogo src={StarswapBlueLogo} size={'48px'} />
              </RowFixed>
              <TYPE.body fontSize={24} style={{ marginTop: '24px' }}>
                <Trans>STAR Earned</Trans>
              </TYPE.body>
              <TYPE.body color={'#FE7F8D'} fontSize={16} style={{ marginTop: '16px' }}>
                {hasAccount ? (
                  <BalanceText style={{ flexShrink: 0, fontSize: '1.5em' }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                    {tbdGain / tbdScalingFactor}
                  </BalanceText>
                ) : null}
              </TYPE.body>
              <ButtonFarm
                style={{ marginTop: '16px' }}
                disabled={!hasAccount || !(tbdGain > 0)}
                onClick={() => {
                  setHarvestDialogOpen(true)
                }}
              >
                <TYPE.main color={'#FE7F8D'}>
                  <BalanceText color={'#fff'} style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                    <Trans>Harvest</Trans>
                  </BalanceText>
                </TYPE.main>
              </ButtonFarm>
            </AutoColumn>
          </FarmCard>
          <FarmCard>
            <AutoColumn justify="center">
              <RowFixed>
                <CurrencyLogo
                  currency={currency0}
                  size={'48px'}
                  style={{ marginRight: '1.25rem', borderRadius: '8px' }}
                />
                <CurrencyLogo currency={currency1} size={'48px'} style={{ borderRadius: '8px;' }} />
              </RowFixed>
              <TYPE.body fontSize={24} style={{ marginTop: '24px' }}>
                {tokenX}/{tokenY}
              </TYPE.body>
              <TYPE.body fontSize={24} style={{ marginTop: '16px' }}>
                {userStaked / lpTokenScalingFactor}
              </TYPE.body>
              {!hasAccount ? (
                <ButtonBorder style={{ marginTop: '16px' }} color={'#FE7F8D'}>
                  <TYPE.black fontSize="20px" color={'#FE7F8D'}>
                    <Trans>Connect Wallet</Trans>
                  </TYPE.black>
                </ButtonBorder>
              ) : !isAuthorization ? (
                <ButtonBorder style={{ marginTop: '16px' }} color={'#FE7F8D'}>
                  <TYPE.black fontSize="20px" color={'#FE7F8D'}>
                    <Trans>Authorization</Trans>
                  </TYPE.black>
                </ButtonBorder>
              ) : (
                <RowBetween style={{ marginTop: '16px' }}>
                  <ButtonFarm
                    onClick={() => {
                      setStakeDialogOpen(true)
                    }}
                    disabled={!(userLiquidity > 0)}
                  >
                    <TYPE.main color={'#fff'}>
                      <Trans>Stake</Trans>
                    </TYPE.main>
                  </ButtonFarm>
                  <ButtonBorder
                    onClick={() => {
                      setUnstakeDialogOpen(true)
                    }}
                    disabled={!hasStake}
                    marginLeft={16}
                  >
                    <TYPE.black fontSize={20}>
                      <Trans>Unstake</Trans>
                    </TYPE.black>
                  </ButtonBorder>
                </RowBetween>
              )}
            </AutoColumn>
          </FarmCard>
        </AutoRow>
        <AutoRow justify="center">
          {isBoost ? (
            <FarmCard>
              <AutoColumn justify="center">
                <RowFixed>
                  <StyledEthereumLogo src={BoostFlame} size={'60px'} style={{ width: '45px' }} />
                </RowFixed>
                <TYPE.body fontSize={24} style={{ marginTop: '24px' }}>
                  <Trans>Boost Factor</Trans>
                </TYPE.body>
                <TYPE.body color={'#FE7F8D'} fontSize={16} style={{ marginTop: '16px' }}>
                  {hasAccount ? (
                    <BalanceText style={{ flexShrink: 0, fontSize: '1.5em' }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                      {boostFactor}
                      <Trans>x</Trans>
                    </BalanceText>
                  ) : null}
                </TYPE.body>
                <ButtonFarm
                  style={{ marginTop: '16px' }}
                  disabled={!hasAccount || !(tbdGain > 0)}
                  onClick={() => {
                    setBoostDialogOpen(true)
                  }}
                >
                  <TYPE.main color={'#FE7F8D'}>
                    <BalanceText color={'#fff'} style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                      <Trans>Boost</Trans>
                    </BalanceText>
                  </TYPE.main>
                </ButtonFarm>
                <TYPE.body fontSize={12} style={{ marginTop: '12px' }}>
                  <ExternalLink
                    href={
                      local === 'en-US'
                        ? 'https://docs.starswap.xyz/v/en/guidelines/vestar-and-boosting'
                        : 'https://docs.starswap.xyz/shi-yong-zhi-nan/ti-su-wa-kuang'
                    }
                  >
                    <Trans>Learn more about boost</Trans>
                  </ExternalLink>
                </TYPE.body>
              </AutoColumn>
            </FarmCard>
          ) : null}
          <FarmCard>
            <AutoColumn justify="center">
              {/*
              <RowFixed>
                <StyledEthereumLogo src={StarswapBlueLogo} size={'48px'} />
              </RowFixed>
              */}
              <TYPE.body fontSize={24} style={{ marginTop: '0px' }}>
                <Trans>LP Token Staking Status</Trans>
              </TYPE.body>
              {lpStakingData ? (
                <>
                  <FarmRow style={{ marginTop: '20px' }}>
                    <RowFixed>
                      <TYPE.black fontWeight={400} fontSize={14}>
                        <Trans>Staked Liquidity</Trans>
                      </TYPE.black>
                    </RowFixed>
                    <RowFixed>
                      <TYPE.black fontSize={14}>
                        {Number(lpStakingData.stakedLiquidity / lpTokenScalingFactor)}
                      </TYPE.black>
                    </RowFixed>
                  </FarmRow>
                  <FarmRow style={{ marginTop: '10px' }}>
                    <RowFixed>
                      <TYPE.black fontWeight={400} fontSize={14}>
                        <Trans>Farm Total Liquidity</Trans>
                      </TYPE.black>
                    </RowFixed>
                    <RowFixed>
                      <TYPE.black fontSize={14}>
                        {Number(lpStakingData.farmTotalLiquidity / lpTokenScalingFactor)}
                      </TYPE.black>
                    </RowFixed>
                  </FarmRow>
                  <FarmRow style={{ marginTop: '10px' }}>
                    <RowFixed>
                      <TYPE.black fontWeight={400} fontSize={14}>
                        <Trans>Percentage</Trans>
                      </TYPE.black>
                    </RowFixed>
                    <RowFixed>
                      <TYPE.black fontSize={14}>{Number(lpStakingData.sharePercentage)}</TYPE.black>
                    </RowFixed>
                  </FarmRow>
                  <FarmRow style={{ marginTop: '10px' }}>
                    <RowFixed>
                      <TYPE.black fontWeight={400} fontSize={14}>
                        <Trans>Staked Amount In USD</Trans>
                      </TYPE.black>
                    </RowFixed>
                    <RowFixed>
                      <TYPE.black fontSize={14}>{Number(lpStakingData.stakedAmountInUsd)}</TYPE.black>
                    </RowFixed>
                  </FarmRow>
                  <FarmRow style={{ marginTop: '10px' }}>
                    <RowFixed>
                      <TYPE.black fontWeight={400} fontSize={14}>
                        <Trans>Token X</Trans>
                      </TYPE.black>
                    </RowFixed>
                    <RowFixed>
                      <TYPE.black fontSize={14}>{lpStakingData.tokenXAmount.tokenId}</TYPE.black>
                    </RowFixed>
                  </FarmRow>
                  <FarmRow style={{ marginTop: '10px' }}>
                    <RowFixed>
                      <TYPE.black fontWeight={400} fontSize={14}>
                        <Trans>Token X Amount</Trans>
                      </TYPE.black>
                    </RowFixed>
                    <RowFixed>
                      <TYPE.black fontSize={14}>
                        {Number(lpStakingData.tokenXAmount.amount / starScalingFactor)}
                      </TYPE.black>
                    </RowFixed>
                  </FarmRow>
                  <FarmRow style={{ marginTop: '10px' }}>
                    <RowFixed>
                      <TYPE.black fontWeight={400} fontSize={14}>
                        <Trans>Token Y</Trans>
                      </TYPE.black>
                    </RowFixed>
                    <RowFixed>
                      <TYPE.black fontSize={14}>{lpStakingData.tokenYAmount.tokenId}</TYPE.black>
                    </RowFixed>
                  </FarmRow>
                  <FarmRow style={{ marginTop: '10px' }}>
                    <RowFixed>
                      <TYPE.black fontWeight={400} fontSize={14}>
                        <Trans>Token Y Amount</Trans>
                      </TYPE.black>
                    </RowFixed>
                    <RowFixed>
                      <TYPE.black fontSize={14}>
                        {Number(lpStakingData.tokenYAmount.amount / stcScalingFactor)}
                      </TYPE.black>
                    </RowFixed>
                  </FarmRow>
                </>
              ) : null}
            </AutoColumn>
          </FarmCard>
        </AutoRow>
        <AutoRow justify="flex-end">
          <StyledGetLink as={Link} to={`/add/v2/${tokenY}`}>
            <TYPE.black fontWeight={500} fontSize={14} color={'#FB578C'} style={{ lineHeight: '20px' }}>
              <Trans>Obtain</Trans> {tokenY}/{tokenX} LP Token
            </TYPE.black>
          </StyledGetLink>
        </AutoRow>
      </Container>
      <SwitchLocaleLink />
      <FarmHarvestDialog
        tbdEarned={tbdGain}
        tbdScalingFactor={tbdScalingFactor}
        tokenX={addressX}
        tokenY={addressY}
        isOpen={harvestDialogOpen}
        onDismiss={handleDismissHarvest}
        lpStakingData={lpStakingData}
      />
      <FarmStakeDialog
        lpTokenBalance={userLiquidity}
        lpTokenScalingFactor={lpTokenScalingFactor}
        tokenX={addressX}
        tokenY={addressY}
        isOpen={stakeDialogOpen}
        onDismiss={handleDismissStake}
        lpStakingData={lpStakingData}
      />
      <FarmUnstakeDialog
        userStaked={userStaked}
        lpTokenScalingFactor={lpTokenScalingFactor}
        tokenX={addressX}
        tokenY={addressY}
        isOpen={unstakeDialogOpen}
        onDismiss={handleDismissUnstake}
        lpStakingData={lpStakingData}
      />
      <FarmBoostDialog
        veStarAmount={veStarAmount}
        lpTokenScalingFactor={lpTokenScalingFactor}
        tokenX={addressX}
        tokenY={addressY}
        isOpen={boostDialogOpen}
        onDismiss={handleDismissBoost}
        lpStakingData={lpStakingData}
      />
    </>
  )
}