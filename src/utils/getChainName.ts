import { STARCOIN_ID_NAME, APTOS_ID_NAME } from 'constants/chains'

export default function getChainName(chainId?: number, networkType?: string): string {
  return networkType === 'STARCOIN' ? STARCOIN_ID_NAME[chainId!] : APTOS_ID_NAME[chainId!]
}