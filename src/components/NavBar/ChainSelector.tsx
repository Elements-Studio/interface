import { getNetworkInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { useOnClickOutsideIgnore } from 'hooks/useOnClickOutsideIgnore'
// import useSelectChain from 'hooks/useSelectChain'
// import useSyncChainQuery from 'hooks/useSyncChainQuery'
import { Box } from 'nft/components/Box'
import { Portal } from 'nft/components/common/Portal'
import { Column, Row } from 'nft/components/Flex'
import { TokenWarningRedIcon } from 'nft/components/icons'
import { subhead } from 'nft/css/common.css'
import { themeVars } from 'nft/css/sprinkles.css'
import { isMobile } from 'react-device-detect'
import { useCallback, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { useTheme } from 'styled-components/macro'
import {useGetType} from 'state/networktype/hooks'

import * as styles from './ChainSelector.css'
import ChainSelectorRow from './ChainSelectorRow'
import { NavDropdown } from './NavDropdown'

const NETWORK_SELECTOR_CHAINS = [
  'STARCOIN',
  'APTOS'
]

interface ChainSelectorProps {
  leftAlign?: boolean
}

export const ChainSelector = ({ leftAlign }: ChainSelectorProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const theme = useTheme()

  const ref = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  useOnClickOutsideIgnore(ref, () => setIsOpen(false), [modalRef])

  const networkType = useGetType();
  const info = networkType ? getNetworkInfo(networkType) : undefined

  // const selectChain = useSelectChain()
  // useSyncChainQuery()

  const [pendingChainId, setPendingChainId] = useState<string | undefined>(undefined)

  const onSelectChain = useCallback(
    async (targetChainId: string) => {
      setPendingChainId(targetChainId)
      // await selectChain(targetChainId)
      setPendingChainId(undefined)
      setIsOpen(false)
    },
    // [selectChain, setIsOpen]
    [setIsOpen]
  )

  if (!networkType) {
    return null
  }

  const isSupported = !!info

  const dropdown = (
    <NavDropdown top="56" left={leftAlign ? '0' : 'auto'} right={leftAlign ? 'auto' : '0'} ref={modalRef}>
      <Column paddingX="8">
        {NETWORK_SELECTOR_CHAINS.map((chainId: string) => (
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
    color: theme.textSecondary,
  }

  return (
    <Box position="relative" ref={ref}>
      <Row
        as="button"
        gap="8"
        className={styles.ChainSelector}
        background={isOpen ? 'accentActiveSoft' : 'none'}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isSupported ? (
          <>
            <TokenWarningRedIcon fill={themeVars.colors.textSecondary} width={24} height={24} />
            <Box as="span" className={subhead} display={{ sm: 'none', xxl: 'flex' }} style={{ lineHeight: '20px' }}>
              Unsupported
            </Box>
          </>
        ) : (
          <>
            <img src={info.logoUrl} alt={info.label} className={styles.Image} />
            <Box as="span" className={subhead} display={{ sm: 'none', xxl: 'flex' }} style={{ lineHeight: '20px' }}>
              {info.label}
            </Box>
          </>
        )}
        {isOpen ? <ChevronUp {...chevronProps} /> : <ChevronDown {...chevronProps} />}
      </Row>
      {isOpen && (isMobile ? <Portal>{dropdown}</Portal> : <>{dropdown}</>)}
    </Box>
  )
}
