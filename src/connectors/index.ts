import { Web3Provider, ExternalProvider } from '@starcoin/providers'
import { InjectedConnector } from '@starcoin/starswap-web3-injected-connector'
import { OpenBlockConnector } from '@starcoin/starswap-web3-openblock-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { SupportedChainId } from '../constants/chains'
import getLibrary from '../utils/getLibrary'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import UNISWAP_LOGO_URL from '../assets/svg/logo.svg'

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID
const WALLETCONNECT_BRIDGE_URL = process.env.REACT_APP_WALLETCONNECT_BRIDGE_URL

export const NETWORK_URLS: {
  [chainId in SupportedChainId]: string
} = {
  [SupportedChainId.MAINNET]: `https://main-seed.starcoin.org`,
  [SupportedChainId.BARNARD]: `https://barnard-seed.starcoin.org`,
  [SupportedChainId.HALLEY]: `https://halley-seed.starcoin.org`,
  [SupportedChainId.PROXIMA]: `https://proxima-seed.starcoin.org`,
  [SupportedChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${ INFURA_KEY }`,
  [SupportedChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${ INFURA_KEY }`,
  [SupportedChainId.GOERLI]: `https://goerli.infura.io/v3/${ INFURA_KEY }`,
  [SupportedChainId.KOVAN]: `https://kovan.infura.io/v3/${ INFURA_KEY }`,
  [SupportedChainId.ARBITRUM_ONE]: `https://arb1.arbitrum.io/rpc`,
  [SupportedChainId.ARBITRUM_RINKEBY]: `https://rinkeby.arbitrum.io/rpc`,
  [SupportedChainId.APTOS_MAIN]: `https://fullnode.mainnet.aptoslabs.com/v1/`,
  [SupportedChainId.APTOS_DEV]: `https://fullnode.devnet.aptoslabs.com/v1/`,
  [SupportedChainId.APTOS_TEST]: `https://fullnode.testnet.aptoslabs.com/v1/`,
}

const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.PROXIMA,
  SupportedChainId.BARNARD,
  SupportedChainId.HALLEY,
  SupportedChainId.KOVAN,
  SupportedChainId.GOERLI,
  SupportedChainId.RINKEBY,
  SupportedChainId.ROPSTEN,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.APTOS_MAIN,
  SupportedChainId.APTOS_DEV,
  SupportedChainId.APTOS_TEST
]

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: 1,
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export function getStarcoin(connector: any): any {
  if (connector instanceof InjectedConnector) {
    return window.starcoin
  }
  if (connector instanceof OpenBlockConnector) {
    return window.obstarcoin
  }
  return undefined
}

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
})

export const openblock = new OpenBlockConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
})

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  rpc: NETWORK_URLS,
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true,
  pollingInterval: 15000,
} as any)

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1,
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1],
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URLS[1],
  appName: 'Uniswap',
  appLogoUrl: UNISWAP_LOGO_URL,
})
