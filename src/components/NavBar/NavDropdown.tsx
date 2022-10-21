import { Box, BoxProps } from '../../nft/components/Box'
import { isMobile } from 'react-device-detect'
import { ForwardedRef, forwardRef } from 'react'

import * as styles from './NavDropdown.css'

export const NavDropdown = forwardRef((props: BoxProps, ref: ForwardedRef<HTMLElement>) => {
  return <Box ref={ref} className={isMobile ? styles.mobileNavDropdown : styles.NavDropdown} {...props} />
})

NavDropdown.displayName = 'NavDropdown'
