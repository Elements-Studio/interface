import { STCSCAN_SUFFIXES } from './getExplorerLink'

export default function getCurrentNetwork(chainId: number | undefined) {
  return STCSCAN_SUFFIXES[chainId ? chainId : 1]
}
