import { Web3Provider } from '@starcoin/providers'
import { useWeb3React as useWeb3ReactCore } from '@starcoin/starswap-web3-core'
import { Web3ReactContextInterface } from '@starcoin/starswap-web3-core/dist/types'
import { deepCopy } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { starmask, openblock } from '../connectors'
import { NetworkContextName } from '../constants/misc'
import useInterval from './useInterval'
import useLocalStorage from './useLocalStorage'
import { useGetType } from 'state/networktype/hooks'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)
  const [wallet, setWallet] = useLocalStorage("wallet", "");
  const [obstarcoinReady, setObstarcoinReady] = useState<boolean>(false)
  const delay = 1000
  useInterval(
    () => {
      // wait until wasm is loaded within iframe
      if (window.obstarcoin && window.obstarcoin?.sdkLoaded) {
        setObstarcoinReady(true)
      }
    },
    !obstarcoinReady ? delay : null,
  )
  useEffect(() => {
    if (wallet === 'StarMask') {
      starmask.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(starmask, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          if (isMobile && window.starcoin) {
            activate(starmask, undefined, true).catch(() => {
              setTried(true)
            })
          } else {
            setTried(true)
          }
        }
      })
    } else if (wallet === 'OpenBlock') {
      if (obstarcoinReady) {
        setTried(true)
      }
    } else {
      setTried(true)
    }
  }, [activate, obstarcoinReady]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does
  const [wallet, setWallet] = useLocalStorage("wallet", "");

  useEffect(() => {
    const { starcoin } = window
    if (wallet === 'StarMask' && starcoin && starcoin.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(starmask, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error)
        })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(starmask, undefined, true).catch((error) => {
            console.error('Failed to activate after accounts changed', error)
          })
        }
      }

      starcoin.on('chainChanged', handleChainChanged)
      starcoin.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (starcoin.removeListener) {
          starcoin.removeListener('chainChanged', handleChainChanged)
          starcoin.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}

export function useDeactivateRegisterListener(suppress = false) {
  const { active, error, activate, deactivate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does
  const [registed, setRegisted] = useState(false)
  const networkType = useGetType()
  const { starcoin } = window
  useEffect(() => {
    if (starcoin && starcoin.on && active && !error && !registed) {
      const handleChainChanged = () => {
        // if user switch from Aptos mainnet to Starcoin mainnet, and do not connect Account,
        // then dapp wont catch this kind of change.
        // so we have to deactivate while any chain changes to fix it
        deactivate()
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          const selectedAddress = accounts[0]

          if (networkType === 'STARCOIN' && selectedAddress.length === 66) {
            deactivate()
          }
          if (networkType === 'APTOS' && selectedAddress && selectedAddress.length === 34) {
            deactivate()
          }
        }
      }

      starcoin.on('chainChanged', handleChainChanged)
      starcoin.on('accountsChanged', handleAccountsChanged)

      // only regist once
      setRegisted(true)
    }
    return undefined
  }, [active, error, activate, starcoin])
}

export function useOpenBlockListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does
  const { obstarcoin } = window
  const obstarcoinReady = obstarcoin && obstarcoin.sdkLoaded
  const [wallet, setWallet] = useLocalStorage("wallet", "");

  useEffect(() => {
    const handleChainChanged = () => {
      // eat errors
      if (window.obstarcoin && window.obstarcoin?.sdkLoaded) {
        activate(openblock, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error)
        })
      }

    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0 && window.obstarcoin && window.obstarcoin?.sdkLoaded) {
        // eat errors
        activate(openblock, undefined, true).catch((error) => {
          console.error('Failed to activate after accounts changed', error)
        })
      }
    }

    if (obstarcoin && obstarcoin.on && !active && !error && !suppress) {
      obstarcoin.on('chainChanged', handleChainChanged)
      obstarcoin.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (obstarcoin.removeListener) {
          obstarcoin.removeListener('chainChanged', handleChainChanged)
          obstarcoin.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    if (suppress && wallet === 'OpenBlock' && obstarcoinReady) {
      // Should be called by OpenBlock sdk, but they has an unkonwn bug, so we call it directly
      handleChainChanged()
    }
    return undefined
  }, [active, error, suppress, activate, obstarcoin, obstarcoinReady])
}