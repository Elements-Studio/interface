import { useMemo } from 'react'
import { useWallet } from '@starcoin/aptos-wallet-adapter'
import { AptosClient } from '@starcoin/aptos';

export function useAptosProvider(): AptosClient {
  const { network: aptosNetwork } = useWallet();
  const networkName = aptosNetwork?.name
  return useMemo(() => {
    try {
      const NODE_URL = `https://fullnode.${ networkName }.aptoslabs.com`
      const client = new AptosClient(NODE_URL)
      return client
    } catch {
      throw ('new AptosClient failed')
    }
  }, [networkName])
}
