import { providers } from '@starcoin/starcoin'
import { NETWORK_URLS } from 'connectors'
import { SupportedChainId } from 'constants/chains'
import { useMemo } from 'react'
import { useActiveWeb3React } from './web3'

export function useStarcoinProvider(): providers.Web3Provider | providers.JsonRpcProvider {
  const { chainId } = useActiveWeb3React()
  const provider = window.starcoin ? window.starcoin : window.obstarcoin
  return useMemo(() => {
    try {
      const provider = window.starcoin ? window.starcoin : window.obstarcoin
      console.log('11 useStarcoinProvider', 'window.starcoin=', window.starcoin, 'window.obstarcoin=', window.obstarcoin, { provider })
      // We must specify the network as 'any' for starcoin to allow network changes
      return new providers.Web3Provider(provider!, 'any')
    } catch {
      console.error('providers.Web3Provider is not ok, use providers.JsonRpcProvider')
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