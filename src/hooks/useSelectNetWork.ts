import { useCallback } from 'react'
import { useAppDispatch } from 'state/hooks'
import { useActiveWeb3React } from 'hooks/web3'
import { useWeb3React } from '@starcoin/starswap-web3-core'
// import { switchChain } from 'utils/switchChain'
import { useGetType, useSetType } from 'state/networktype/hooks'
import { switchToNetwork } from 'utils/switchToNetwork'
import { useWallet } from '@starcoin/aptos-wallet-adapter'
import getChainId from 'utils/getChainId'

export default function useSelectChain() {
  const dispatch = useAppDispatch()
  const networkType = useGetType();
  const setType = useSetType();
  const { library } = useActiveWeb3React()
  const {account: aptosAccount, network: aptosNetwork} = useWallet();
  const chainId = getChainId(aptosNetwork?.name);
  const account: any = aptosAccount?.address || '';
  return useCallback(
    async (targetChain: string) => {
      if (!networkType) { return }
      if (!library?.provider?.request || !chainId) {
        return
      }
      try {
        const targetChainId = 1
        await switchToNetwork({ library, chainId: targetChainId, networkType: targetChain })
          .then((resp) => {
            // resp should be null
          })
          .catch((error) => console.log({ error }))
        // await switchChain(connector, targetChain)
      } catch (error) {
        console.error('Failed to switch networks', error)

        // dispatch(updateConnectionError({ connectionType, error: error.message }))
        // dispatch(addPopup({ content: { failedSwitchNetwork: targetChain }, key: `failed-network-switch` }))
      }
    },
    [networkType, setType, chainId, library]
  )
}
