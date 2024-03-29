import { useState, useEffect } from 'react'
import { useWeb3React } from '@starcoin/starswap-web3-core'
import styled from 'styled-components/macro'
import { Trans } from '@lingui/macro'
import useLocalStorage from '../../hooks/useLocalStorage'
import { network } from '../../connectors'
import { useEagerConnect, useInactiveListener, useOpenBlockListener } from '../../hooks/web3'
import { NetworkContextName } from '../../constants/misc'
import Loader from '../Loader'
import { bool } from '@starcoin/starcoin/dist/src/lib/runtime/serde'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)
  const [wallet, setWallet] = useLocalStorage("wallet", "");

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const  triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)
  
  // try to eagerly connect to OpenBlock if previous connected wallet is OpenBlock
  useOpenBlockListener(!triedEager)

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    // we should not block the page before OpenBlock sdkLoaded is true
    if (wallet !== 'OpenBlock'){
      return null
    }
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <MessageWrapper>
        <Message>
          <Trans>
            Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device.
          </Trans>
        </Message>
      </MessageWrapper>
    )
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <MessageWrapper>
        <Loader />
      </MessageWrapper>
    ) : null
  }

  return children
}
