import { nanoid } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'

import { getNetworkLibrary } from '../connectors'
import { useAppDispatch } from 'state/hooks'
import { fetchTokenList } from '../state/lists/actions'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/resolveENSContentHash'
import { useActiveWeb3React } from './web3'
import { useWallet } from '@starcoin/aptos-wallet-adapter'
import getChainId from 'utils/getChainId'

export function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { library } = useActiveWeb3React()
  const {account: aptosAccount, network: aptosNetwork} = useWallet();
  const chainId = getChainId(aptosNetwork?.name);
  const account: any = aptosAccount?.address || '';
  const dispatch = useAppDispatch()

  const ensResolver = useCallback(
    async (ensName: string) => {
      if (!library || chainId !== 1) {
        const networkLibrary = getNetworkLibrary()
        const network = await networkLibrary.getNetwork()
        if (networkLibrary && network.chainId === 1) {
          return resolveENSContentHash(ensName, networkLibrary)
        }
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, library)
    },
    [chainId, library]
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch && dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          sendDispatch && dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }))
          throw error
        })
    },
    [dispatch, ensResolver]
  )
}
