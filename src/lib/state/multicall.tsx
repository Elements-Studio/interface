import { createMulticall, ListenerOptions } from '@uniswap/redux-multicall'
import { useActiveWeb3React } from 'hooks/web3'
import { SupportedChainId } from 'constants/chains'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import { useMemo } from 'react'
import { combineReducers, createStore } from 'redux'

const multicall = createMulticall()
const reducer = combineReducers({ [multicall.reducerPath]: multicall.reducer })
export const store = createStore(reducer)

export default multicall

function getBlocksPerFetchForChainId(chainId: number | undefined): number {
  switch (chainId) {
    case SupportedChainId.ARBITRUM_ONE:
      return 15
    default:
      return 1
  }
}

export function MulticallUpdater() {
  const { chainId } = useActiveWeb3React()
  const latestBlockNumber = useBlockNumber()
  // const contract = useInterfaceMulticall()
  const listenerOptions: ListenerOptions = useMemo(
    () => ({
      blocksPerFetch: getBlocksPerFetchForChainId(chainId),
    }),
    [chainId]
  )

  return (
    <multicall.Updater
      chainId={chainId}
      latestBlockNumber={latestBlockNumber}
      contract={null}
      listenerOptions={listenerOptions}
    />
  )
}
