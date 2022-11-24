export enum NetworkType {
  STARCOIN = 'STARCOIN',
  APTOS = 'APTOS',
}

export enum SupportedChainId_STARCOIN {
  MAINNET = 1,
  PROXIMA = 252,
  BARNARD = 251,
  HALLEY = 253,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
}

export enum SupportedChainId_APTOS {
  APTOS_MAIN = 1,
  APTOS_TEST = 2,
  APTOS_DEV = 34
}

export const STARCOIN_ID_NAME: { [chainId: number]: string } = {
  [SupportedChainId_STARCOIN.MAINNET]: 'MAINNET',
  [SupportedChainId_STARCOIN.PROXIMA]: 'PROXIMA',
  [SupportedChainId_STARCOIN.BARNARD]: 'BARNARD',
  [SupportedChainId_STARCOIN.HALLEY]: 'HALLEY',
}

export const APTOS_ID_NAME: { [chainId: number]: string } = {
  [SupportedChainId_APTOS.APTOS_MAIN]: 'APTOS_MAIN',
  [SupportedChainId_APTOS.APTOS_TEST]: 'APTOS_TEST',
  [SupportedChainId_APTOS.APTOS_DEV]: 'APTOS_DEV'
}

export const SupportedChainId2 = {
  [NetworkType.STARCOIN]: SupportedChainId_STARCOIN,
  [NetworkType.APTOS]: SupportedChainId_APTOS
}

export enum SupportedChainId {
  MAINNET = 1,
  PROXIMA = 252,
  BARNARD = 251,
  HALLEY = 253,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
  APTOS_MAIN = 1,
  APTOS_TEST = 2,
  APTOS_DEV = 34
}

export const SupportedChainNameId: { [name: string]: number } = {
  'MAINNET': 1,
  'PROXIMA': 252,
  'BARNARD': 251,
  'HALLEY': 253,
  'ROPSTEN': 3,
  'RINKEBY': 4,
  'GOERLI': 5,
  'KOVAN': 42,
  'ARBITRUM_ONE': 42161,
  'ARBITRUM_RINKEBY': 421611,
  'APTOS_MAIN': 1,
  'APTOS_TEST': 2,
  'APTOS_DEV': 34
}

export const NETWORK_LABELS: { [chainId in SupportedChainId | number]: string } = {
  [SupportedChainId.MAINNET]: 'Mainnet',
  [SupportedChainId.PROXIMA]: 'Proxima',
  [SupportedChainId.BARNARD]: 'Barnard',
  [SupportedChainId.HALLEY]: 'Halley',
  [SupportedChainId.RINKEBY]: 'Rinkeby',
  [SupportedChainId.ROPSTEN]: 'Ropsten',
  [SupportedChainId.GOERLI]: 'Görli',
  [SupportedChainId.KOVAN]: 'Kovan',
  [SupportedChainId.ARBITRUM_ONE]: 'Arbitrum',
  [SupportedChainId.ARBITRUM_RINKEBY]: 'Arbitrum Testnet',
  [SupportedChainId.APTOS_MAIN]: 'mainnet',
  [SupportedChainId.APTOS_DEV]: 'devnet',
  [SupportedChainId.APTOS_TEST]: 'testnet'
}
