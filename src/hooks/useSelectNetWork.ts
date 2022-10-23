import { useCallback } from 'react'
import { useAppDispatch } from 'state/hooks'
// import { switchChain } from 'utils/switchChain'
import { useGetType, useSetType } from 'state/networktype/hooks'

export default function useSelectChain() {
  const dispatch = useAppDispatch()
  const networkType = useGetType();
  const setType = useSetType();

  return useCallback(
    async (targetChain: string) => {
      if (!networkType) { return }

      try {
        setType(targetChain);
        // await switchChain(connector, targetChain)
      } catch (error) {
        console.error('Failed to switch networks', error)

        // dispatch(updateConnectionError({ connectionType, error: error.message }))
        // dispatch(addPopup({ content: { failedSwitchNetwork: targetChain }, key: `failed-network-switch` }))
      }
    },
    [networkType, setType]
  )
}
