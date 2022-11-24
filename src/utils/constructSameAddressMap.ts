import { SupportedChainId } from '../constants/chains'

const MAINNET_AND_TESTNETS = [
  SupportedChainId.MAINNET,
  SupportedChainId.PROXIMA,
  SupportedChainId.BARNARD,
  SupportedChainId.HALLEY,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN,
  SupportedChainId.APTOS_MAIN,
  SupportedChainId.APTOS_TEST,
  SupportedChainId.APTOS_DEV,
  SupportedChainId.APTOS_MAIN_OTHER,
  SupportedChainId.APTOS_TEST_OTHER,
  SupportedChainId.APTOS_DEV_OTHER,

]

export function constructSameAddressMap<T extends string>(
  address: T,
  additionalNetworks: SupportedChainId[] = []
): { [chainId: number]: T } {
  return MAINNET_AND_TESTNETS.concat(additionalNetworks).reduce<{ [chainId: number]: T }>((memo, chainId) => {
    memo[chainId] = address
    return memo
  }, {})
}
