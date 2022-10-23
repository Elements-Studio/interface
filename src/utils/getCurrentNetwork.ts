import { STCSCAN_SUFFIXES, APTOS_SUFFIXES } from './getExplorerLink'
import getNetworkType from './getNetworkType'

export default function getCurrentNetwork(chainId: number | undefined) {
  const networkType = getNetworkType()
  if (networkType === 'APTOS') {
    return `aptos-${ APTOS_SUFFIXES[chainId ? chainId : 1] }`
  }
  return STCSCAN_SUFFIXES[chainId ? chainId : 1]
}
