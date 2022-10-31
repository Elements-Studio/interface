import { SupportedChainId } from 'constants/chains'
import { BigNumber, utils } from 'ethers'
import { Web3Provider } from '@starcoin/providers'

interface SwitchNetworkArguments {
  library: Web3Provider
  chainId: SupportedChainId
  networkType?: string
}

// provider.request returns Promise<any>, but wallet_switchEthereumChain must return null or throw
// see https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md for more info on wallet_switchEthereumChain
export async function switchToNetwork({ library, chainId, networkType = 'STARCOIN' }: SwitchNetworkArguments): Promise<null | void> {
  if (!library?.provider?.request) {
    return
  }
  const formattedChainId = utils.hexStripZeros(BigNumber.from(chainId).toHexString())
  return library?.provider.request({
    method: 'wallet_switchStarcoinChain',
    params: [{ chainId: formattedChainId, networkType }],
  })
}
