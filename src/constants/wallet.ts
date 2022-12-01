import { AbstractConnector } from '@web3-react/abstract-connector'
// import INJECTED_ICON_URL from '../assets/images/arrow-right.svg'
// import COINBASE_ICON_URL from '../assets/images/coinbaseWalletIcon.svg'
// import FORTMATIC_ICON_URL from '../assets/images/fortmaticIcon.png'
import STARMASK_ICON_URL from '../assets/images/starmask.png'
import ONEKEY_ICON_URL from '../assets/images/onekey.png'
import OPENBLOCK_ICON_URL from '../assets/images/openblock.png'
// import PORTIS_ICON_URL from '../assets/images/portisIcon.png'
// import WALLETCONNECT_ICON_URL from '../assets/images/walletConnectIcon.svg'
import { fortmatic, starmask, openblock, portis, walletconnect, walletlink } from '../connectors'

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconURL: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true,
  networkType: string[],
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  // INJECTED: {
  //   connector: injected,
  //   name: 'Injected',
  //   iconURL: INJECTED_ICON_URL,
  //   description: 'Injected web3 provider.',
  //   href: null,
  //   color: '#010101',
  //   primary: true,
  // },
  STARMASK: {
    connector: starmask,
    name: 'StarMask',
    iconURL: STARMASK_ICON_URL,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
    networkType: ['STARCOIN', 'APTOS']
  },
  // ONEKEY: {
  //   connector: injected,
  //   name: 'OneKey',
  //   iconURL: ONEKEY_ICON_URL,
  //   description: 'Easy-to-use browser extension.',
  //   href: null,
  //   color: '#E8831D',
  // },
  OPENBLOCK: {
    connector: openblock,
    name: 'OpenBlock',
    iconURL: OPENBLOCK_ICON_URL,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
    networkType: ['STARCOIN']
  },
  // WALLET_CONNECT: {
  //   connector: walletconnect,
  //   name: 'WalletConnect',
  //   iconURL: WALLETCONNECT_ICON_URL,
  //   description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
  //   href: null,
  //   color: '#4196FC',
  //   mobile: true,
  // },
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconURL: COINBASE_ICON_URL,
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5',
  // },
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconURL: COINBASE_ICON_URL,
  //   description: 'Open in Coinbase Wallet app.',
  //   href: 'https://go.cb-w.com/mtUDhEZPy1',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true,
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconURL: FORTMATIC_ICON_URL,
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true,
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconURL: PORTIS_ICON_URL,
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true,
  // },
}
