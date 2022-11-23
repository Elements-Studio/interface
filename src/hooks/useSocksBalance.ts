import JSBI from 'jsbi'
import { useMemo } from 'react'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { useActiveWeb3React } from './web3'
import { useSocksController } from './useContract'
import { useWallet } from '@starcoin/aptos-wallet-adapter';


export default function useSocksBalance(): JSBI | undefined {
  const {account: aptosAccount} = useWallet();
 const account: any = aptosAccount?.address || '';
  const socksContract = useSocksController()

  const inputs = useMemo(() => [account ?? undefined], [account])
  const { result } = useSingleCallResult(socksContract, 'balanceOf', inputs, NEVER_RELOAD)
  const data = result?.[0]
  return data ? JSBI.BigInt(data.toString()) : undefined
}

export function useHasSocks(): boolean | undefined {
  const balance = useSocksBalance()
  return useMemo(() => balance && JSBI.greaterThan(balance, JSBI.BigInt(0)), [balance])
}
