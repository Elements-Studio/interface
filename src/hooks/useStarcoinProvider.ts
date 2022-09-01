import { providers } from '@starcoin/starcoin'
import { NETWORK_URLS } from 'connectors'
import { SupportedChainId } from 'constants/chains'
import { useMemo } from 'react'
import { useActiveWeb3React } from './web3'

export function useStarcoinProvider(): providers.Web3Provider | providers.JsonRpcProvider {
  const { chainId } = useActiveWeb3React()
  let provider: any
  if (window.starcoin && window.starcoin.chainId) {
    provider = window.starcoin
  } else if (window.obstarcoin && window.obstarcoin.chainId) {
    provider = window.obstarcoin
  }
  return useMemo(() => {
    try {
      // We must specify the network as 'any' for starcoin to allow network changes
      return new providers.Web3Provider(provider!, 'any')
    } catch {
      return new providers.JsonRpcProvider(NETWORK_URLS[chainId as SupportedChainId])
    }
  }, [chainId, provider])
}

export function useStarcoinJsonRPCProvider(): providers.JsonRpcProvider {
  const { chainId } = useActiveWeb3React()
  return useMemo(() => {
    return new providers.JsonRpcProvider(NETWORK_URLS[chainId as SupportedChainId])
  }, [chainId])
}