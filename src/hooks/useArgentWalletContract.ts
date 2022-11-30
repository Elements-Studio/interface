import { ArgentWalletContract } from '../abis/types'
import { useActiveWeb3React } from './web3'
import { useContract } from './useContract'
import useIsArgentWallet from './useIsArgentWallet'
import ArgentWalletContractABI from '../abis/argent-wallet-contract.json'
import { useWallet } from '@starcoin/aptos-wallet-adapter'
import getChainId from 'utils/getChainId';


export function useArgentWalletContract(): ArgentWalletContract | null {
  const {account: aptosAccount} = useWallet();
 const account: any = aptosAccount?.address || '';
  const isArgentWallet = useIsArgentWallet()
  return useContract(
    isArgentWallet ? account ?? undefined : undefined,
    ArgentWalletContractABI,
    true
  ) as ArgentWalletContract
}
