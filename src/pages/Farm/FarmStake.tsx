import { Trans } from '@lingui/macro'
import { useCallback, useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import Row, { AutoRow, RowFixed, RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { ButtonFarm, ButtonBorder } from '../../components/Button'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import FarmCard from '../../components/farm/FarmCard'
import FarmStakeDialog from '../../components/farm/FarmStakeDialog'
import FarmHarvestDialog from '../../components/farm/FarmHarvestDialog'
import FarmUnstakeDialog from '../../components/farm/FarmUnstakeDialog'
import GetAllStakeDialog from '../../components/farm/GetAllStakeDialog'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import STCLogo from '../../assets/images/stc.png'
import STCBlueLogo from '../../assets/images/stc_logo_blue.png'
import StarswapBlueLogo from '../../assets/svg/starswap_product_logo_blue.svg'
import PortisIcon from '../../assets/images/portisIcon.png'
import ArbitrumLogo from '../../assets/svg/arbitrum_logo.svg'
import { useActiveWeb3React } from '../../hooks/web3'
import { useSTCBalances, useTokenBalance } from 'state/wallet/hooks'
import { useStarcoinProvider } from 'hooks/useStarcoinProvider'
import { useLookupTBDGain, useUserStaked } from 'hooks/useTokenSwapFarmScript'
import { useUserLiquidity } from 'hooks/useTokenSwapRouter'
import useSWR from 'swr'


const Container = styled.div`
  width: auto;
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 4px;
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

  console.log({tokenX})
  console.log({tokenY})

  const { account, chainId } = useActiveWeb3React()

  if (account) {
    hasAccount = true;
    address = account.toLowerCase();
  }
  // const userSTCBalance = useSTCBalances(address ? [address] : [])?.[address ?? '']

  const x = "0x1::STC::STC";
  // const y = "0x9350502a3af6c617e9a42fa9e306a385::BX_USDT::BX_USDT";
  // const y = "0x2d81a0427d64ff61b11ede9085efa5ad::XUSDT::XUSDT";
  // const y = "0xfe125d419811297dfab03c61efec0bc9::FAI::FAI";
  let y;
  if (tokenY === 'STAR' || tokenX === 'STAR') {
    y = "0x8c109349c6bd91411d6bc962e080c4a3::STAR::STAR";
  }
  if (tokenY === 'FAI' || tokenX === 'FAI') {
    y = "0xfe125d419811297dfab03c61efec0bc9::FAI::FAI";
  }
  if (tokenY === 'XUSDT' || tokenX === 'XUSDT') {
    y = "0x2d81a0427d64ff61b11ede9085efa5ad::XUSDT::XUSDT";
  }

  // const lpTokenScalingFactor = 1000000000000000000;
  const lpTokenScalingFactor = 1000000000;
  const tbdScalingFactor = 1000000000;

  const tbdGain:any = useLookupTBDGain(address, x, y)?.data || 0;
  const userLiquidity:any = useUserLiquidity(address, x, y)?.data || 0;
  const userStaked:any = useUserStaked(address, x, y)?.data || 0;
  if (userStaked[0] > 0) {
    hasStake = true;
  }


  const provider = useStarcoinProvider()

  /*
  const tbdGainParams = {
    // function_id: "0x3db7a2da7444995338a2413b151ee437:TokenSwapFarmScript::lookup_gain", 
    function_id: "0x8c109349c6bd91411d6bc962e080c4a3:TokenSwapFarmScript::lookup_gain", 
    type_args: [
        "0x1::STC::STC",
        // "0x9350502a3af6c617e9a42fa9e306a385::BX_USDT::BX_USDT"
        "0x2d81a0427d64ff61b11ede9085efa5ad::XUSDT::XUSDT"
    ],
    args: [address] 
  }
  const [tbdGain, setTBDGain] = useState<any>('')
  provider.callV2(tbdGainParams).then(result => {
    setTBDGain(result)
  }, function(error) {
    console.log({error});
  });
  */

  /*
  const liquidityParams = {
    // function_id: "0x3db7a2da7444995338a2413b151ee437::TokenSwapRouter::liquidity", 
    function_id: "0x8c109349c6bd91411d6bc962e080c4a3::TokenSwapRouter::liquidity", 
    type_args: [
        "0x1::STC::STC",
        // "0x9350502a3af6c617e9a42fa9e306a385::BX_USDT::BX_USDT"
        "0x2d81a0427d64ff61b11ede9085efa5ad::XUSDT::XUSDT"
    ],
    args: [address] 
  }
  const [liquidity, setLiquidity] = useState<any>('')
  provider.callV2(liquidityParams).then(result => {
    setLiquidity(result)
  }, function(error) {
    console.log({error});
  });
  */
  // const liquidity = 10000000;

  /* 
  const alreadyStakeParams = {
    // function_id: "0x3db7a2da7444995338a2413b151ee437::TokenSwapFarmScript::query_stake", 
    function_id: "0x8c109349c6bd91411d6bc962e080c4a3::TokenSwapFarmScript::query_stake", 
    type_args: [
        "0x1::STC::STC",
        // "0x9350502a3af6c617e9a42fa9e306a385::BX_USDT::BX_USDT"
        "0x2d81a0427d64ff61b11ede9085efa5ad::XUSDT::XUSDT"
    ],
    args: [address] 
  }
  const [alreadyStake, setAlreadyStake] = useState<any>('')
  provider.callV2(alreadyStakeParams).then(result => {
    setAlreadyStake(result)
    console.log(result)
    if (result[0] > 0) {
      hasStake = true;
    }
  }, function(error) {
    console.log({error});
  });
  */
  // const alreadStake = 1000;

  /*
  const { data: results } = useSWR(addresses.length ? [provider, 'getBalance', ...addresses] : null, () =>
    Promise.all(addresses.map((address) => provider!.getBalance(address)))
  )
  */
  // console.log({results})

  // const LPTokenAddress = '0x3db7a2da7444995338a2413b151ee437::TokenSwap::LiquidityToken<0x00000000000000000000000000000001::STC::STC, 0x2d81a0427d64ff61b11ede9085efa5ad::XUSDT::XUSDT>'
  // const LPTokenAddress = '0x8c109349c6bd91411d6bc962e080c4a3::TokenSwap::LiquidityToken<0x00000000000000000000000000000001::STC::STC, 0x2d81a0427d64ff61b11ede9085efa5ad::XUSDT::XUSDT>'
  // const userLPTokenBalance = useTokenBalance(address ? address : '', LPTokenAddress);
  // console.log({userLPTokenBalance})
  /*
  let hasAccount = true 
  let isAuthorization = true
  let hasStake = true
  */

  /*
  if(address=='1'){
    hasAccount = false
  } else if(address=='2'){
    isAuthorization = false
  } else if(address=='3'){
    hasStake = false
  }
  */

  const [ stakeDialogOpen, setStakeDialogOpen ] = useState(false)
  const [ harvestDialogOpen, setHarvestDialogOpen ] = useState(false)
  const [ allStakeDialogOpen, setAllStakeDialogOpen ] = useState(false)
  const [ unstakeDialogOpen, setUnstakeDialogOpen ] = useState(false)

  const handleDismissStake = useCallback(() => {
    setStakeDialogOpen(false)
  }, [setStakeDialogOpen])

  const handleDismissHarvest = useCallback(() => {
    setHarvestDialogOpen(false)
  }, [setHarvestDialogOpen])

  const handleDismissAllStake = useCallback(() => {
    setAllStakeDialogOpen(false)
  }, [setAllStakeDialogOpen])

  const handleDismissUnstake = useCallback(() => {
    setUnstakeDialogOpen(false)
  }, [setUnstakeDialogOpen])

  return (
    <>
      <Container style={{ paddingTop: '50px' }}>
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
                {
                  hasAccount ? (
                    <BalanceText style={{ flexShrink: 0, fontSize: '1.5em' }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                      {tbdGain / tbdScalingFactor} <Trans>STAR</Trans>
                    </BalanceText>
                  ) : null
                }
              </TYPE.body>
              <ButtonFarm style={{ marginTop: '16px' }}
                disabled={!hasAccount || !(tbdGain > 0)}
                onClick={() => { setHarvestDialogOpen(true) }} 
              >
                <TYPE.main color={'#FE7F8D'}>
                  <BalanceText color={'#fff'} style={{ flexShrink: 0}} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                    <Trans>Harvest</Trans>
                  </BalanceText>
                </TYPE.main>
              </ButtonFarm>
            </AutoColumn>
          </FarmCard>
          <FarmCard>
            <AutoColumn justify="center">
              <RowFixed>
                <StyledEthereumLogo src={STCBlueLogo} style={{ marginRight: '1.25rem' }} size={'48px'} />
                <StyledEthereumLogo src={EthereumLogo} size={'48px'} />
              </RowFixed>
              <TYPE.body fontSize={24} style={{ marginTop: '24px' }}>{tokenY}/{tokenX}</TYPE.body>
              <TYPE.body fontSize={24} style={{ marginTop: '16px' }}>{userStaked / lpTokenScalingFactor}</TYPE.body>
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
                    <RowBetween style={{ marginTop: '16px' }}>
                      <ButtonFarm onClick={() => { setStakeDialogOpen(true) }} disabled={!(userLiquidity > 0)}>
                        <TYPE.main color={'#fff'}>
                          <Trans>Stake</Trans>
                        </TYPE.main>
                      </ButtonFarm>
                      <ButtonBorder onClick={() => { setUnstakeDialogOpen(true) }} disabled={!hasStake} marginLeft={16}>
                        <TYPE.black fontSize={20}>
                          <Trans>Unstake</Trans>
                        </TYPE.black>
                      </ButtonBorder>
                    </RowBetween>
                  )
                )}
            </AutoColumn>
          </FarmCard>
        </AutoRow>
        <AutoRow justify="flex-end">
          <StyledGetLink as={Link} to={`/add/v2/${tokenY}`}>
            <TYPE.black fontWeight={500} fontSize={14} color={'#FB578C'} style={{ lineHeight: '20px' }}>
              <Trans>Obtain</Trans> STC/FAI LP Token
            </TYPE.black>
          </StyledGetLink>
        </AutoRow>
      </Container>
      <SwitchLocaleLink />
      <FarmHarvestDialog
        tbdEarned={tbdGain}
        tbdScalingFactor={tbdScalingFactor}
        tokenX={x}
        tokenY={y}
        isOpen={harvestDialogOpen}
        onDismiss={handleDismissHarvest}
      />
      <FarmStakeDialog
        lpTokenBalance={userLiquidity}
        lpTokenScalingFactor={lpTokenScalingFactor}
        tokenX={x}
        tokenY={y}
        isOpen={stakeDialogOpen}
        onDismiss={handleDismissStake}
      />
      <FarmUnstakeDialog
        userStaked={userStaked}
        lpTokenScalingFactor={lpTokenScalingFactor}
        tokenX={x}
        tokenY={y}
        isOpen={unstakeDialogOpen}
        onDismiss={handleDismissUnstake}
      />
      {/*
      <GetAllStakeDialog
        isOpen={allStakeDialogOpen}
        onDismiss={handleDismissAllStake}
      />
      */}
    </>
  )
}