import { useMemo } from 'react'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { useActiveWeb3React } from './web3'
import { useArgentWalletDetectorContract } from './useContract'
import { useWallet } from '@starcoin/aptos-wallet-adapter';


export default function useIsArgentWallet(): boolean {
  const {account: aptosAccount} = useWallet();
 const account: any = aptosAccount?.address || '';
  const argentWalletDetector = useArgentWalletDetectorContract()
  const inputs = useMemo(() => [account ?? undefined], [account])
  const call = useSingleCallResult(argentWalletDetector, 'isArgentWallet', inputs, NEVER_RELOAD)
  return call?.result?.[0] ?? false
}
