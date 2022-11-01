import { WETH9 } from '@uniswap/sdk-core'
import { Token, Star, Apt } from '@starcoin/starswap-sdk-core'
import { UNI_ADDRESS } from './addresses'
import { SupportedChainId, NetworkType, SupportedChainId_STARCOIN, SupportedChainId_APTOS } from './chains'

export const STC: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0x00000000000000000000000000000001::STC::STC',
    9,
    'STC',
    'STC'
  ),
  [SupportedChainId.BARNARD]: new Token(
    SupportedChainId.BARNARD,
    '0x00000000000000000000000000000001::STC::STC',
    9,
    'STC',
    'STC'
  ),
  [SupportedChainId.PROXIMA]: new Token(
    SupportedChainId.PROXIMA,
    '0x00000000000000000000000000000001::STC::STC',
    9,
    'STC',
    'STC'
  ),
}
export const FAI: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0x4ffcc98f43ce74668264a0cf6eebe42b::FAI::FAI',
    9,
    'FAI',
    'FAI'
  ),
  [SupportedChainId.BARNARD]: new Token(
    SupportedChainId.BARNARD,
    '0xfe125d419811297dfab03c61efec0bc9::FAI::FAI',
    9,
    'FAI',
    'FAI'
  ),
  [SupportedChainId.PROXIMA]: new Token(
    SupportedChainId.PROXIMA,
    '0xfe125d419811297dfab03c61efec0bc9::FAI::FAI',
    9,
    'FAI',
    'FAI'
  ),
}
export const STAR: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0x8c109349c6bd91411d6bc962e080c4a3::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
  [SupportedChainId.BARNARD]: new Token(
    SupportedChainId.BARNARD,
    '0x8c109349c6bd91411d6bc962e080c4a3::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
  [SupportedChainId.PROXIMA]: new Token(
    SupportedChainId.PROXIMA,
    '0x8c109349c6bd91411d6bc962e080c4a3::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
  [SupportedChainId.APTOS_MAIN]: new Token(
    SupportedChainId.APTOS_MAIN,
    '0x9bf32e42c442ae2adbc87bc7923610621469bf183266364503a7a434fe9d50ca::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
  [SupportedChainId.APTOS_TEST]: new Token(
    SupportedChainId.APTOS_TEST,
    '0x9bf32e42c442ae2adbc87bc7923610621469bf183266364503a7a434fe9d50ca::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
  [SupportedChainId.APTOS_DEV]: new Token(
    SupportedChainId.APTOS_DEV,
    '0x9bf32e42c442ae2adbc87bc7923610621469bf183266364503a7a434fe9d50ca::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
}
export const STAR_NAME: { [chainId: string]: Token } = {
  ['MAINNET']: new Token(
    SupportedChainId.MAINNET,
    '0x8c109349c6bd91411d6bc962e080c4a3::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
  ['BARNARD']: new Token(
    SupportedChainId.BARNARD,
    '0x8c109349c6bd91411d6bc962e080c4a3::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
  ['PROXIMA']: new Token(
    SupportedChainId.PROXIMA,
    '0x8c109349c6bd91411d6bc962e080c4a3::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
  ['APTOS_MAIN']: new Token(
    SupportedChainId.APTOS_MAIN,
    '0x9bf32e42c442ae2adbc87bc7923610621469bf183266364503a7a434fe9d50ca::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
  ['APTOS_TEST']: new Token(
    SupportedChainId.APTOS_TEST,
    '0x9bf32e42c442ae2adbc87bc7923610621469bf183266364503a7a434fe9d50ca::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
  ['APTOS_DEV']: new Token(
    SupportedChainId.APTOS_DEV,
    '0x9bf32e42c442ae2adbc87bc7923610621469bf183266364503a7a434fe9d50ca::STAR::STAR',
    9,
    'STAR',
    'Star'
  ),
}

export const XUSDT: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0xe52552637c5897a2d499fbf08216f73e::XUSDT::XUSDT',
    6,
    'XUSDT',
    'XUSDT'
  ),
  [SupportedChainId.BARNARD]: new Token(
    SupportedChainId.BARNARD,
    '0x416b32009fe49fcab1d5f2ba0153838f::XUSDT::XUSDT',
    6,
    'XUSDT',
    'XUSDT'
  ),
  [SupportedChainId.PROXIMA]: new Token(
    SupportedChainId.PROXIMA,
    '0x416b32009fe49fcab1d5f2ba0153838f::XUSDT::XUSDT',
    6,
    'XUSDT',
    'XUSDT'
  ),
  [SupportedChainId.APTOS_MAIN]: new Token(
    SupportedChainId.APTOS_MAIN,
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
    6,
    'USDT',
    'USDT'
  ),
  [SupportedChainId.APTOS_TEST]: new Token(
    SupportedChainId.APTOS_TEST,
    '0x9bf32e42c442ae2adbc87bc7923610621469bf183266364503a7a434fe9d50ca::XUSDT::XUSDT',
    6,
    'XUSDT',
    'XUSDT'
  ),
  [SupportedChainId.APTOS_DEV]: new Token(
    SupportedChainId.APTOS_DEV,
    '0x9bf32e42c442ae2adbc87bc7923610621469bf183266364503a7a434fe9d50ca::XUSDT::XUSDT',
    6,
    'XUSDT',
    'XUSDT'
  ),
}
export const XUSDT_NAME: { [chainId: string]: Token } = {
  ['MAINNET']: new Token(
    SupportedChainId.MAINNET,
    '0xe52552637c5897a2d499fbf08216f73e::XUSDT::XUSDT',
    6,
    'XUSDT',
    'XUSDT'
  ),
  ['BARNARD']: new Token(
    SupportedChainId.BARNARD,
    '0x416b32009fe49fcab1d5f2ba0153838f::XUSDT::XUSDT',
    6,
    'XUSDT',
    'XUSDT'
  ),
  ['PROXIMA']: new Token(
    SupportedChainId.PROXIMA,
    '0x416b32009fe49fcab1d5f2ba0153838f::XUSDT::XUSDT',
    6,
    'XUSDT',
    'XUSDT'
  ),
  ['APTOS_MAIN']: new Token(
    SupportedChainId.APTOS_MAIN,
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
    6,
    'USDT',
    'USDT'
  ),
  ['APTOS_TEST']: new Token(
    SupportedChainId.APTOS_TEST,
    '0x9bf32e42c442ae2adbc87bc7923610621469bf183266364503a7a434fe9d50ca::XUSDT::XUSDT',
    6,
    'XUSDT',
    'XUSDT'
  ),
  ['APTOS_DEV']: new Token(
    SupportedChainId.APTOS_DEV,
    '0x9bf32e42c442ae2adbc87bc7923610621469bf183266364503a7a434fe9d50ca::XUSDT::XUSDT',
    6,
    'XUSDT',
    'XUSDT'
  ),
}
export const APT: { [chainId: number]: Token } = {
  [SupportedChainId.APTOS_MAIN]: new Token(
    SupportedChainId.APTOS_MAIN,
    '0x1::aptos_coin::AptosCoin',
    8,
    'APT',
    'APT'
  ),
  [SupportedChainId.APTOS_TEST]: new Token(
    SupportedChainId.APTOS_TEST,
    '0x1::aptos_coin::AptosCoin',
    8,
    'APT',
    'APT'
  ),
  [SupportedChainId.APTOS_DEV]: new Token(
    SupportedChainId.APTOS_DEV,
    '0x1::aptos_coin::AptosCoin',
    8,
    'APT',
    'APT'
  ),
}
export const XETH: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0xe52552637c5897a2d499fbf08216f73e::XETH::XETH',
    18,
    'XETH',
    'XETH'
  ),
  [SupportedChainId.BARNARD]: new Token(
    SupportedChainId.BARNARD,
    '0x416b32009fe49fcab1d5f2ba0153838f::XETH::XETH',
    18,
    'XETH',
    'XETH'
  ),
  [SupportedChainId.PROXIMA]: new Token(
    SupportedChainId.PROXIMA,
    '0x416b32009fe49fcab1d5f2ba0153838f::XETH::XETH',
    18,
    'XETH',
    'XETH'
  ),
}
// export const BX_USDT: { [chainId: number]: Token } = {
//   [SupportedChainId.BARNARD]: new Token(
//     SupportedChainId.BARNARD,
//     '0x9350502a3af6c617e9a42fa9e306a385::BX_USDT::BX_USDT',
//     9,
//     'BX_USDT',
//     'BX_USDT'
//   ),
// }
// export const USDX: { [chainId: number]: Token } = {
//   [SupportedChainId.BARNARD]: new Token(
//     SupportedChainId.BARNARD,
//     '0xbd7e8be8fae9f60f2f5136433e36a091::Usdx::Usdx',
//     9,
//     'Usdx',
//     'Usdx'
//   ),
// }
export const WEN: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0xbf60b00855c92fe725296a436101c8c6::WEN::WEN',
    9,
    'WEN',
    'Wen'
  ),
  [SupportedChainId.BARNARD]: new Token(
    SupportedChainId.BARNARD,
    '0x88e2677b89841cd4ee7c15535798e1c8::WEN::WEN',
    9,
    'WEN',
    'Wen'
  ),
  [SupportedChainId.PROXIMA]: new Token(
    SupportedChainId.PROXIMA,
    '0x88e2677b89841cd4ee7c15535798e1c8::WEN::WEN',
    9,
    'WEN',
    'Wen'
  ),
}
export const SHARE: { [chainId: number]: Token } = {
  [SupportedChainId.BARNARD]: new Token(
    SupportedChainId.BARNARD,
    '0x88e2677b89841cd4ee7c15535798e1c8::SHARE::SHARE',
    9,
    'SHARE',
    'Share'
  ),
  [SupportedChainId.PROXIMA]: new Token(
    SupportedChainId.PROXIMA,
    '0x88e2677b89841cd4ee7c15535798e1c8::SHARE::SHARE',
    9,
    'SHARE',
    'Share'
  ),
}
export const AMPL = new Token(
  SupportedChainId.MAINNET,
  '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
  9,
  'AMPL',
  'Ampleforth'
)
export const DAI = new Token(
  SupportedChainId.MAINNET,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USDC = new Token(
  SupportedChainId.MAINNET,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)
export const USDC_ARBITRUM = new Token(
  SupportedChainId.ARBITRUM_ONE,
  '0xe865dF68133fcEd7c2285ff3896B406CAfAa2dB8',
  6,
  'USDC',
  'USD//C'
)
export const USDT = new Token(
  SupportedChainId.MAINNET,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD'
)
export const WBTC = new Token(
  SupportedChainId.MAINNET,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
)
export const FEI = new Token(
  SupportedChainId.MAINNET,
  '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
  18,
  'FEI',
  'Fei USD'
)
export const TRIBE = new Token(
  SupportedChainId.MAINNET,
  '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
  18,
  'TRIBE',
  'Tribe'
)
export const FRAX = new Token(
  SupportedChainId.MAINNET,
  '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  18,
  'FRAX',
  'Frax'
)
export const FXS = new Token(
  SupportedChainId.MAINNET,
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  18,
  'FXS',
  'Frax Share'
)
export const renBTC = new Token(
  SupportedChainId.MAINNET,
  '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
  8,
  'renBTC',
  'renBTC'
)
export const UMA = new Token(
  SupportedChainId.MAINNET,
  '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
  18,
  'UMA',
  'UMA Voting Token v1'
)
export const ETH2X_FLI = new Token(
  SupportedChainId.MAINNET,
  '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
  18,
  'ETH2x-FLI',
  'ETH 2x Flexible Leverage Index'
)
// Mirror Protocol compat.
export const UST = new Token(
  SupportedChainId.MAINNET,
  '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
  18,
  'UST',
  'Wrapped UST'
)
export const MIR = new Token(
  SupportedChainId.MAINNET,
  '0x09a3ecafa817268f77be1283176b946c4ff2e608',
  18,
  'MIR',
  'Wrapped MIR'
)
export const UNI: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: new Token(SupportedChainId.MAINNET, UNI_ADDRESS[1], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.RINKEBY]: new Token(SupportedChainId.RINKEBY, UNI_ADDRESS[4], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.ROPSTEN]: new Token(SupportedChainId.ROPSTEN, UNI_ADDRESS[3], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.GOERLI]: new Token(SupportedChainId.GOERLI, UNI_ADDRESS[5], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.KOVAN]: new Token(SupportedChainId.KOVAN, UNI_ADDRESS[42], 18, 'UNI', 'Uniswap'),
}

export const WETH9_EXTENDED: { [chainId: number]: Token } = {
  ...WETH9,
  [SupportedChainId.MAINNET]: Star.onChain(SupportedChainId.MAINNET).wrapped,
  [SupportedChainId.BARNARD]: Star.onChain(SupportedChainId.BARNARD).wrapped,
  [SupportedChainId.PROXIMA]: Star.onChain(SupportedChainId.PROXIMA).wrapped,
  [SupportedChainId.ARBITRUM_ONE]: new Token(
    SupportedChainId.ARBITRUM_ONE,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.ARBITRUM_RINKEBY]: new Token(
    SupportedChainId.ARBITRUM_RINKEBY,
    '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.APTOS_MAIN]: Apt.onChain(SupportedChainId.APTOS_MAIN).wrapped,
  [SupportedChainId.APTOS_TEST]: Apt.onChain(SupportedChainId.APTOS_TEST).wrapped,
  [SupportedChainId.APTOS_DEV]: Apt.onChain(SupportedChainId.APTOS_DEV).wrapped,
}

// export class ExtendedEther extends Ether {
//   public get wrapped(): Token {
//     if (this.chainId in WETH9_EXTENDED) return WETH9_EXTENDED[this.chainId]
//     throw new Error('Unsupported chain ID')
//   }

//   private static _cachedEther: { [chainId: number]: ExtendedEther } = {}

//   public static onChain(chainId: number): ExtendedEther {
//     return this._cachedEther[chainId] ?? (this._cachedEther[chainId] = new ExtendedEther(chainId))
//   }
// }

export class ExtendedStar extends Star {
  private static _cachedStar: { [chainId: number]: ExtendedStar } = {}

  public static onChain(chainId: number): ExtendedStar {
    return this._cachedStar[chainId] ?? (this._cachedStar[chainId] = new ExtendedStar(chainId))
  }
}

export class ExtendedApt extends Apt {
  private static _cachedApt: { [chainId: number]: ExtendedApt } = {}

  public static onChain(chainId: number): ExtendedApt {
    return this._cachedApt[chainId] ?? (this._cachedApt[chainId] = new ExtendedApt(chainId))
  }
}