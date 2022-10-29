import { SupportedChainId_STARCOIN, SupportedChainId_APTOS } from 'constants/chains'
import { BigNumber } from 'ethers'
export default function getNetworkType() {
  const chainId = window.starcoin?.chainId
  let networkType = ''
  // the mainnet chainId of both Aptos and Starcoin is the same: 0x1
  // we can determine it by selectedAddress length
  if (chainId === '0x1') {
    networkType = window.starcoin?.selectedAddress?.length === 66 ? 'APTOS' : 'STARCOIN'
  } else {
    const networkVersion = BigNumber.from(chainId).toNumber()
    if (networkVersion in SupportedChainId_STARCOIN) {
      networkType = 'STARCOIN'
    } else if (networkVersion in SupportedChainId_APTOS) {
      networkType = 'APTOS'
    }
  }
  return networkType
}
