import { useActiveWeb3React } from 'hooks/web3'
import { getChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import useSelectChain from 'hooks/useSelectChain'
import useSyncChainQuery from 'hooks/useSyncChainQuery'
import { Box } from 'rebass/styled-components'
import Portal from '@reach/portal'
import Row from '../Row'
import Column from '../Column'
import { TokenWarningRedIcon } from 'nft/components/icons'
import { subhead } from 'nft/css/common.css'
import { themeVars } from 'nft/css/sprinkles.css'
import { useIsMobile } from 'nft/hooks'
import { useCallback, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { useTheme } from 'styled-components/macro'

import * as styles from './ChainSelector.css'
import ChainSelectorRow from './ChainSelectorRow'
import { NavDropdown } from './NavDropdown'

const NETWORK_SELECTOR_CHAINS = [
  SupportedChainId.MAINNET,
  SupportedChainId.ARBITRUM_ONE,
]

interface ChainSelectorProps {
  leftAlign?: boolean
}

export const ChainSelector = ({ leftAlign }: ChainSelectorProps) => {
  const { chainId } = useActiveWeb3React()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const isMobile = useIsMobile()

  // const theme = useTheme()

  const ref = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setIsOpen(false))

  const info = chainId ? getChainInfo(chainId) : undefined

  // const selectChain = useSelectChain()
  // useSyncChainQuery()

  const [pendingChainId, setPendingChainId] = useState<SupportedChainId | undefined>(undefined)

  const onSelectChain = useCallback(
    async (targetChainId: SupportedChainId) => {
      setPendingChainId(targetChainId)
      // await selectChain(targetChainId)
      setPendingChainId(undefined)
      setIsOpen(false)
    },
    [setIsOpen]
  )

  if (!chainId) {
    return null
  }

  const isSupported = info

  const dropdown = (
    <NavDropdown style={{top: '56', left: leftAlign ? '0' : 'auto', right: leftAlign ? 'auto' : '0'}} ref={modalRef}>
      <Column>
        {NETWORK_SELECTOR_CHAINS.map((chainId: SupportedChainId) => (
          <ChainSelectorRow
            onSelectChain={onSelectChain}
            targetChain={chainId}
            key={chainId}
            isPending={chainId === pendingChainId}
          />
        ))}
      </Column>
    </NavDropdown>
  )

  const chevronProps = {
    height: 20,
    width: 20,
    // color: theme.secondary1,
  }

  return (
    <Box style={{position: 'relative'}} ref={ref}>
      <Row
        className={styles.ChainSelector}
        style={{background: isOpen ? 'accentActiveSoft' : 'none'}}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isSupported ? (
          <>
            <img src={info?.logoUrl || ''} alt={info?.label || ''} className={styles.Image} />
            <Box as="span" className={subhead} display={{ sm: 'none', xxl: 'flex' }} style={{ lineHeight: '20px' }}>
              {info?.label || ''}
            </Box>
          </>
        ) : (
          <>
            <TokenWarningRedIcon fill={themeVars.colors.textSecondary} width={24} height={24} />
            <Box as="span" className={subhead} display={{ sm: 'none', xxl: 'flex' }} style={{ lineHeight: '20px' }}>
              Unsupported
            </Box>
          </>
        )}
        {isOpen ? <ChevronUp {...chevronProps} /> : <ChevronDown {...chevronProps} />}
      </Row>
      {isOpen && (isMobile ? <Portal>{dropdown}</Portal> : <>{dropdown}</>)}
    </Box>
  )
}
