import { Web3Provider } from '@starcoin/providers'
import { useWeb3React as useWeb3ReactCore } from '@starcoin/starswap-web3-core'
import { Web3ReactContextInterface } from '@starcoin/starswap-web3-core/dist/types'
import { deepCopy } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { injected, openblock } from '../connectors'
import { NetworkContextName } from '../constants/misc'
import useInterval from './useInterval'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useEagerConnect() {
  console.log('useEagerConnect')
  const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)

  useEffect(() => {
    console.log('useEffect')
    injected.isAuthorized().then((isAuthorized) => {
      console.log('starcoin isAuthorized', isAuthorized)
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        if (isMobile && window.starcoin) {
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          setTried(true)
        }
      }
    })
  }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

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

  useEffect(() => {
    const { starcoin } = window

    if (starcoin && starcoin.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        console.log('handleChainChanged 111')
        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error)
        })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        console.log('handleAccountsChanged 222')

        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
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


/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useOpenBlockListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does
  const [obstarcoinReady, setObstarcoinReady] = useState(false)
  const { obstarcoin } = window

  useEffect(() => {
    console.log('useOpenBlockListener useEffect', window.obstarcoin)

    if (obstarcoin && obstarcoin.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        console.log('handleChainChanged 333')
        // eat errors
        activate(openblock, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error)
        })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        console.log('handleAccountsChanged 444')

        if (accounts.length > 0) {
          // eat errors
          activate(openblock, undefined, true).catch((error) => {
            console.error('Failed to activate after accounts changed', error)
          })
        }
      }

      console.log('register listener 222')
      obstarcoin.on('chainChanged', handleChainChanged)
      obstarcoin.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (obstarcoin.removeListener) {
          obstarcoin.removeListener('chainChanged', handleChainChanged)
          obstarcoin.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate, obstarcoin])
}


export function useOpenBlockConnect() {
  console.log('useOpenBlockConnect')
  const { activate, active, error } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)

  const [obstarcoinReady, setObstarcoinReady] = useState<boolean>(false)
  console.log({ active, obstarcoinReady })
  const delay = 1000
  useInterval(
    () => {
      console.log('useInterval', obstarcoinReady, window.obstarcoin)
      // Your custom logic here
      if (window.obstarcoin && !obstarcoinReady) {
        console.log('window.obstarcoin is ready now', window.obstarcoin, window.obstarcoin?.isLogin)
        const obstarcoin2 = JSON.stringify(window.obstarcoin)
        console.log(obstarcoin2, JSON.parse(obstarcoin2), JSON.parse(obstarcoin2).isLogin)
        setObstarcoinReady(true)
      }
    },
    !obstarcoinReady ? delay : null,
  )

  useEffect(() => {
    console.log('useEffect', { activate, active, obstarcoinReady })
    if (obstarcoinReady) {
      setTried(true)
    }
  }, [activate, active, obstarcoinReady]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  // useEffect(() => {
  //   if (active) {
  //     setTried(true)
  //   }
  // }, [active])

  return tried
}