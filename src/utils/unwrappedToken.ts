import { Currency } from '@uniswap/sdk-core'
import { ExtendedStar, ExtendedApt, WETH9_EXTENDED_NAME } from '../constants/tokens'
import { supportedChainId } from './supportedChainId'
import getNetworkType from './getNetworkType'
import getChainName from './getChainName'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency
  const formattedChainId = supportedChainId(currency.chainId)
  const networkType = getNetworkType()
  const chainName = getChainName(formattedChainId, networkType)
  if (formattedChainId && WETH9_EXTENDED_NAME[chainName] && currency.equals(WETH9_EXTENDED_NAME[chainName]))
    return networkType === 'STARCOIN' ? ExtendedStar.onChain(currency.chainId) : ExtendedApt.onChain(currency.chainId)
  return currency
}
