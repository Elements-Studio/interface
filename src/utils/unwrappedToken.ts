import { Currency } from '@uniswap/sdk-core'
import { ExtendedStar, ExtendedApt, WETH9_EXTENDED } from '../constants/tokens'
import { supportedChainId } from './supportedChainId'
import getNetworkType from './getNetworkType'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency
  const formattedChainId = supportedChainId(currency.chainId)
  const networkType = getNetworkType()
  if (formattedChainId && WETH9_EXTENDED[formattedChainId] && currency.equals(WETH9_EXTENDED[formattedChainId]))
    return networkType === 'STARCOIN' ? ExtendedStar.onChain(currency.chainId) : ExtendedApt.onChain(currency.chainId)
  return currency
}
