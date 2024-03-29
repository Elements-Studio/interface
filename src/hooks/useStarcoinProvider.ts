import { providers } from '@starcoin/starcoin'
import { NETWORK_URLS } from 'connectors'
import { SupportedChainId } from 'constants/chains'
import { useMemo } from 'react'
import { useActiveWeb3React } from './web3'
import { getStarcoin } from '../connectors'

export function useStarcoinProvider(): providers.Web3Provider | providers.JsonRpcProvider {
  const { chainId, connector } = useActiveWeb3React()
  const starcoin = getStarcoin(connector)
  return useMemo(() => {
    try {
      // We must specify the network as 'any' for starcoin to allow network changes
      return new providers.Web3Provider(starcoin!, 'any')
    } catch {
      return new providers.JsonRpcProvider(NETWORK_URLS[chainId as SupportedChainId])
    }
  }, [chainId, starcoin])
}

export function useStarcoinJsonRPCProvider(): providers.JsonRpcProvider {
  const { chainId } = useActiveWeb3React()
  return useMemo(() => {
    return new providers.JsonRpcProvider(NETWORK_URLS[chainId as SupportedChainId])
  }, [chainId])
}