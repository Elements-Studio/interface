import { Currency } from '@uniswap/sdk-core'
import { ExtendedStar, WETH9_EXTENDED } from '../constants/tokens'
import { supportedChainId } from './supportedChainId'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency
  const formattedChainId = supportedChainId(currency.chainId)
  if (formattedChainId && WETH9_EXTENDED[formattedChainId] && currency.equals(WETH9_EXTENDED[formattedChainId]))
    return ExtendedStar.onChain(currency.chainId)
  return currency
}
