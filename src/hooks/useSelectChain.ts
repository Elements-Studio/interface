import { useActiveWeb3React } from 'hooks/web3'
import { getConnection } from 'connection/utils'
import { SupportedChainId } from 'constants/chains'
import { useCallback } from 'react'
import addPopup from 'state/application/reducer'
import { updateConnectionError } from 'state/connection/reducer'
import { useAppDispatch } from 'state/hooks'
import { switchChain } from 'utils/switchChain'

export default function useSelectChain() {
  const dispatch = useAppDispatch()
  const { connector } = useActiveWeb3React()

  return useCallback(
    async (targetChain: any) => {
      if (!connector) return

      const connectionType = getConnection(connector as any).type

      try {
        dispatch(updateConnectionError({ connectionType, error: undefined }))
        // await switchChain(connector, targetChain)
      } catch (error) {
        console.error('Failed to switch networks', error)

        dispatch(updateConnectionError({ connectionType, error: error.message }))
        // dispatch(addPopup({ content: { failedSwitchNetwork: targetChain }, key: `failed-network-switch` }))
      }
    },
    [connector, dispatch]
  )
}
