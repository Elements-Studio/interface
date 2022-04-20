import { Trans } from '@lingui/macro'
import { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import { AutoRow, RowFixed, RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { ButtonFarm, ButtonBorder } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import FarmCard from '../../components/farm/FarmCard'
import MyStakeListTitle from '../../components/Stake/MyStakeListTitle'
import TokenStakeDialog from '../../components/Stake/TokenStakeDialog'
import TokenUnstakeDialog from '../../components/Stake/TokenUnstakeDialog'
import StarswapBlueLogo from '../../assets/svg/starswap_product_logo_blue.svg'
import { useActiveWeb3React } from '../../hooks/web3'
import { useIsBoost } from '../../state/user/hooks'
import { STAR } from '../../constants/tokens'
import { useStarcoinProvider } from 'hooks/useStarcoinProvider'
import { useUserStarStaked } from 'hooks/useTokenSwapFarmScript'
import getCurrentNetwork from '../../utils/getCurrentNetwork'
import useSWR from 'swr'
import axios from 'axios';

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
const TitleTotal = styled.div<{ margin?: string; maxWidth?: string }>`
  position: relative;
  max-width: ${({ maxWidth }) => maxWidth ?? '480px'};
  width: 100%;
  background: linear-gradient(241deg, #FF978E20 0%, #FB548B20 100%);
  font-size: 20px;
  border-radius: 24px;
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: center;
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

export default function FarmStake({
  match: {
    params: { token },
  },
}: RouteComponentProps<{ token: string }>) {

  let address = '';
  let hasAccount = false;
  let isAuthorization = true
  let hasStake = true

  const { account, chainId } = useActiveWeb3React()
  const network = getCurrentNetwork(chainId)

  if (account) {
    hasAccount = true;
    address = account.toLowerCase();
  }
  const STAR_address = STAR[(chainId ? chainId : 1)].address

  const starScalingFactor = 1000000000;

  const userStarStaked:any = useUserStarStaked(address, STAR_address)?.data || [];
  if (userStarStaked === [] || userStarStaked[0]?.length > 0) {
    hasStake = false;
  }

  const provider = useStarcoinProvider()

  const { data: starBalance } = useSWR([address].length ? [provider, 'getBalance', ...address] : null, () =>
    provider.getBalance(address, STAR_address)
  )

  const isBoost = useIsBoost()
  let myStakeList = [];

  let { data } = useSWR(
    `https://swap-api.starswap.xyz/${network}/v1/${isBoost ? 'getAccountSyrupStakes' : 'syrupStakes'}?accountAddress=${address}&tokenId=${token}`,
    fetcher
  );
  myStakeList = data ? data : []
  // if (error) return "An error has occurred.";
  // if (!data) return "Loading...";

  const [ stakeDialogOpen, setStakeDialogOpen ] = useState(false)
  const [ unstakeDialogOpen, setUnstakeDialogOpen ] = useState(false)
  const [ unstakeId, setUnstakeId ] = useState('')

  // const { data: veStarAmount } = useSWR(
  //   `https://swap-api.starswap.xyz/${network}/v1/getAccountVeStarAmount?accountAddress=${address}`,
  //   fetcher
  // );
  const [ veStarAmount, setVeStarAmount ] = useState(0)
  
  useEffect(
    () => {
      if (isBoost) {
        const url = `https://swap-api.starswap.xyz/${network}/v1/getAccountVeStarAmount?accountAddress=${address}`
        axios.get(url).then(res => res.data).then(data => setVeStarAmount(data))
        return
      }
    },
    [isBoost]
  )
  const veStarScalingFactor = 1000000000;

  const handleDismissStake = useCallback(() => {
    setStakeDialogOpen(false)
  }, [setStakeDialogOpen])

  const handleDismissUnstake = useCallback(() => {
    setUnstakeDialogOpen(false)
  }, [setUnstakeDialogOpen])

  function handleUnstakeId(id:any) {
    setUnstakeId(id);
  };
  return (
    <>
      <Container style={{ paddingTop: '1rem' }}>
        {
          (isBoost) ? (
            <TitleTotal>
              <Trans>veStar Balance</Trans>: {veStarAmount / veStarScalingFactor}
            </TitleTotal>
          ) : null
        }
        <AutoRow justify="center">
          <FarmCard>
            <AutoColumn justify="center">
              <RowFixed>
                <StyledEthereumLogo src={StarswapBlueLogo} size={'48px'} />
              </RowFixed>
              <TYPE.body fontSize={24} style={{ marginTop: '24px' }}>
                <Trans>STAR Balance</Trans>
              </TYPE.body>
              <TYPE.body color={'#FE7F8D'} fontSize={16} style={{ marginTop: '16px' }}>
                {
                  hasAccount ? (
                    <BalanceText style={{ flexShrink: 0, fontSize: '1.5em' }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                      {starBalance ? (Number(starBalance) / starScalingFactor) : 0} <Trans>STAR</Trans>
                    </BalanceText>
                  ) : null
                }
              </TYPE.body>
              <ButtonFarm style={{ marginTop: '16px' }}
                disabled={!hasAccount || !(starBalance ? (starBalance > 0) : false)}
                onClick={() => { setStakeDialogOpen(true) }} 
              >
                <TYPE.main color={'#FE7F8D'}>
                  <BalanceText color={'#fff'} style={{ flexShrink: 0}} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                    <Trans>Stake</Trans>
                  </BalanceText>
                </TYPE.main>
              </ButtonFarm>
            </AutoColumn>
          </FarmCard>
        </AutoRow>
        <MyStakeListTitle />
        { (myStakeList && myStakeList.length > 0) ? myStakeList.map((item:any)=> {
          const isWait = item.endTime > (Date.now() / 1000)
          const isEnoughVeStar = isBoost ? veStarAmount >= item.veStarAmount : true
          return (
            <AutoRow justify="center" key={item.id}>
              <FarmCard>
                <AutoColumn justify="center">
                  <RowFixed>
                    <StyledEthereumLogo src={StarswapBlueLogo} style={{ marginRight: '1.25rem' }} size={'48px'} />
                  </RowFixed>
                  <TYPE.body fontSize={24} style={{ marginTop: '24px' }}>{token}</TYPE.body>
                  <TYPE.body fontSize={24} style={{ marginTop: '16px' }}>ID: {item.id}</TYPE.body>
                  <TYPE.body fontSize={24} style={{ marginTop: '16px' }}>{(parseInt(item.amount) / starScalingFactor).toString()}</TYPE.body>
                  <TYPE.body fontSize={16} style={{ marginTop: '16px' }}><Trans>Start</Trans>: {(new Date(item.startTime*1000)+'').slice(4,24)}</TYPE.body>
                  <TYPE.body fontSize={16} style={{ marginTop: '16px' }}><Trans>End</Trans>: {(new Date(item.endTime*1000)+'').slice(4,24)}</TYPE.body>
                  <TYPE.body fontSize={16} style={{ marginTop: '16px' }}><Trans>Stepwise Multiplier</Trans>: {item.stepwiseMultiplier}</TYPE.body>
                  <TYPE.body fontSize={16} style={{ color: 'red', marginTop: '16px' }}><Trans>Expected Gain</Trans>: {Number(item.expectedGain / starScalingFactor) || 0 }</TYPE.body>
                    {!hasAccount ? (
                      <ButtonBorder style={{ marginTop: '16px' }} color={'#FE7F8D'}>
                        <TYPE.black fontSize="20px" color={'#FE7F8D'}>
                          <Trans>Connect Wallet</Trans>
                        </TYPE.black>
                      </ButtonBorder>
                    ) : (
                      !isAuthorization ? (
                        <ButtonBorder style={{ marginTop: '16px' }} color={'#FE7F8D'}>
                          <TYPE.black fontSize="20px" color={'#FE7F8D'}>
                            <Trans>Authorization</Trans>
                          </TYPE.black>
                        </ButtonBorder>
                      ) : (
                        <>
                          <RowBetween style={{ marginTop: '16px' }}>
                            <ButtonFarm id={item.id} onClick={() => { handleUnstakeId(item.id); setUnstakeDialogOpen(true);  }} disabled={isWait || !isEnoughVeStar}>
                              <TYPE.main color={'#fff'}>
                                { (isWait) ? 
                                  <Trans>Wait</Trans> : <Trans>Unstake</Trans>
                                }
                              </TYPE.main>
                            </ButtonFarm>
                          </RowBetween>
                          {
                            (!isWait && !isEnoughVeStar) ? (
                              <TYPE.body fontSize={12} style={{ marginTop: '12px' }}>
                                <Trans>The veSTAR balance is not enough.</Trans>
                              </TYPE.body>
                            ): null
                          }
                          
                        </>
                      )
                    )}
                </AutoColumn>
              </FarmCard>
            </AutoRow>
          )
        }) : (
          <AutoRow justify="center">
            <h3><Trans>No Staking</Trans></h3>
          </AutoRow>
        )
        }
      </Container>
      <SwitchLocaleLink />
      <TokenStakeDialog
        stakeTokenBalance={Number(starBalance) || 0}
        stakeTokenScalingFactor={starScalingFactor}
        token={token}
        isOpen={stakeDialogOpen}
        onDismiss={handleDismissStake}
      />
      <TokenUnstakeDialog
        unstakeId={unstakeId}
        stakeTokenScalingFactor={starScalingFactor}
        token={token}
        isOpen={unstakeDialogOpen}
        onDismiss={handleDismissUnstake}
      />
    </>
  )
}