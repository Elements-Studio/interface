import { Currency } from '@uniswap/sdk-core'
import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import STCLogo from '../../assets/svg/stc.svg'
import STCBlueLogo from '../../assets/svg/stc.svg'
import STARLogo from '../../assets/images/starswap_logo_star_round.jpg'
import STARBlueLogo from '../../assets/svg/starswap_logo.svg'
import FAILogo from '../../assets/images/fai_token_logo.png'
import FAIBlueLogo from '../../assets/images/fai_token_logo_blue.png'
import WENLogo from '../../assets/svg/starswap_wen.svg'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import Logo from '../Logo'
import { useIsDarkMode } from '../../state/user/hooks'

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 4px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  ...rest
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (!currency || currency.isNative) return []

    // if (currency.isToken) {
    if (currency.symbol === 'Bot') {
      // const defaultUrls = currency.chainId === 1 ? [getTokenLogoURL(currency.address)] : []
      const defaultUrls = currency.chainId === 1 ? [getTokenLogoURL('0xdAC17F958D2ee523a2206206994597C13D831ec7')] : []
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls]
      }
      return defaultUrls
    }
    return []
  }, [currency, uriLocations])

  /*
  if (currency?.isNative) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} {...rest} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} {...rest} />
  */
  

  const darkMode = useIsDarkMode();

  if (currency?.isNative) {
    // return <StyledEthereumLogo src={STCLogo} size={size} style={style} {...rest} />
    if (darkMode) {
      return <StyledEthereumLogo src={STCBlueLogo} size={size} style={style} {...rest} />
    }
    return <StyledEthereumLogo src={STCBlueLogo} size={size} style={style} {...rest} />
  } else if (currency?.symbol === 'STAR'){
    if (darkMode) {
      return <StyledEthereumLogo src={STARBlueLogo} size={size} style={style} {...rest} />
    }
    return <StyledEthereumLogo src={STARLogo} size={size} style={style} {...rest} />
  } else if (currency?.symbol === 'FAI'){
    if (darkMode) {
      return <StyledEthereumLogo src={FAIBlueLogo} size={size} style={style} {...rest} />
    }
    return <StyledEthereumLogo src={FAILogo} size={size} style={style} {...rest} />
  } else if (currency?.symbol === 'WEN'){
    if (darkMode) {
      return <StyledEthereumLogo src={WENLogo} size={size} style={style} {...rest} />
    }
    return <StyledEthereumLogo src={WENLogo} size={size} style={style} {...rest} />
  } else {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} {...rest} />
  }
}
