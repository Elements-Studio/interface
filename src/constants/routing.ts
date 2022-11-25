// a list of tokens by chain
import { Currency, Token } from '@uniswap/sdk-core'
import { SupportedChainId, NetworkType, SupportedChainId2, SupportedChainId_STARCOIN, SupportedChainId_APTOS, STARCOIN_ID_NAME, APTOS_ID_NAME, SupportedChainNameId } from './chains'
import getChainName from 'utils/getChainName'
import {
  STC,
  STAR,
  FAI,
  XUSDT,
  XUSDC,
  XETH,
  WEN,
  SHARE,
  AMPL,
  DAI,
  ExtendedStar,
  ExtendedApt,
  FEI,
  FRAX,
  FXS,
  MIR,
  renBTC,
  TRIBE,
  UMA,
  UNI,
  USDC,
  USDT,
  UST,
  WBTC,
  ETH2X_FLI,
  WETH9_EXTENDED,
  APT,
  STAR_NAME,
  XUSDT_NAME,
  XUSDC_NAME,
} from './tokens'


type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

type ChainNameTokenList = {
  readonly [chainName: string]: Token[]
}

type ChainCurrencyList = {
  readonly [chainId: number]: Currency[]
}

type ChainNameCurrencyList = {
  readonly [chainName: string]: Currency[]
}

// List of all mirror's assets addresses.
// Last pulled from : https://whitelist.mirror.finance/eth/tokenlists.json
// TODO: Generate this programmatically ?
const mAssetsAdditionalBases: { [tokenAddress: string]: Token[] } = {
  [UST.address]: [MIR],
  [MIR.address]: [UST],
  '0xd36932143F6eBDEDD872D5Fb0651f4B72Fd15a84': [MIR, UST], // mAAPL
  '0x59A921Db27Dd6d4d974745B7FfC5c33932653442': [MIR, UST], // mGOOGL
  '0x21cA39943E91d704678F5D00b6616650F066fD63': [MIR, UST], // mTSLA
  '0xC8d674114bac90148d11D3C1d33C61835a0F9DCD': [MIR, UST], // mNFLX
  '0x13B02c8dE71680e71F0820c996E4bE43c2F57d15': [MIR, UST], // mQQQ
  '0xEdb0414627E6f1e3F082DE65cD4F9C693D78CCA9': [MIR, UST], // mTWTR
  '0x41BbEDd7286dAab5910a1f15d12CBda839852BD7': [MIR, UST], // mMSFT
  '0x0cae9e4d663793c2a2A0b211c1Cf4bBca2B9cAa7': [MIR, UST], // mAMZN
  '0x56aA298a19C93c6801FDde870fA63EF75Cc0aF72': [MIR, UST], // mBABA
  '0x1d350417d9787E000cc1b95d70E9536DcD91F373': [MIR, UST], // mIAU
  '0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676': [MIR, UST], // mSLV
  '0x31c63146a635EB7465e5853020b39713AC356991': [MIR, UST], // mUSO
  '0xf72FCd9DCF0190923Fadd44811E240Ef4533fc86': [MIR, UST], // mVIXY
}
const WETH_ONLY: ChainTokenList = {
  [SupportedChainId.MAINNET]: [WETH9_EXTENDED[SupportedChainId.MAINNET]],
  [SupportedChainId.ROPSTEN]: [WETH9_EXTENDED[SupportedChainId.ROPSTEN]],
  [SupportedChainId.RINKEBY]: [WETH9_EXTENDED[SupportedChainId.RINKEBY]],
  [SupportedChainId.GOERLI]: [WETH9_EXTENDED[SupportedChainId.GOERLI]],
  [SupportedChainId.KOVAN]: [WETH9_EXTENDED[SupportedChainId.KOVAN]],
  [SupportedChainId.ARBITRUM_ONE]: [WETH9_EXTENDED[SupportedChainId.ARBITRUM_ONE]],
}
// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  // ...WETH_ONLY,
  // [1]: [...WETH_ONLY[1], DAI, USDC, USDT, WBTC],
  [SupportedChainId.MAINNET]: [STC[SupportedChainId.MAINNET]],
  [SupportedChainId.BARNARD]: [STC[SupportedChainId.BARNARD]],
  [SupportedChainId.PROXIMA]: [STC[SupportedChainId.PROXIMA]],
  [SupportedChainId.APTOS_MAIN]: [APT[SupportedChainId.APTOS_MAIN]],
  [SupportedChainId.APTOS_TEST]: [APT[SupportedChainId.APTOS_TEST]],
  [SupportedChainId.APTOS_DEV]: [APT[SupportedChainId.APTOS_DEV]]
}
export const ADDITIONAL_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
  // [1]: {
  //   ...mAssetsAdditionalBases,
  //   '0xF16E4d813f4DcfDe4c5b44f305c908742De84eF0': [ETH2X_FLI],
  //   '0xA948E86885e12Fb09AfEF8C52142EBDbDf73cD18': [UNI[1]],
  //   '0x561a4717537ff4AF5c687328c0f7E90a319705C0': [UNI[1]],
  //   '0xE0360A9e2cdd7d03B9408c7D3001E017BAc2EcD5': [UNI[1]],
  //   '0xa6e3454fec677772dd771788a079355e43910638': [UMA],
  //   '0xB46F57e7Ce3a284d74b70447Ef9352B5E5Df8963': [UMA],
  //   [FEI.address]: [TRIBE],
  //   [TRIBE.address]: [FEI],
  //   [FRAX.address]: [FXS],
  //   [FXS.address]: [FRAX],
  //   [WBTC.address]: [renBTC],
  //   [renBTC.address]: [WBTC],
  // }
}
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
  // [1]: {
  //   [AMPL.address]: [DAI, WETH9_EXTENDED[1]],
  // },
}

/**
 * Shows up in the currency select for swap and add liquidity
 */
// ATTENTION: COMMON_BASES is deprecated, use COMMON_BASES_NAME instead.
export const COMMON_BASES: ChainCurrencyList = {
  // [1]: [ExtendedStar.onChain(1), DAI, USDC, USDT, WBTC, WETH9_EXTENDED[1]],
  [SupportedChainId.MAINNET]: [ExtendedStar.onChain(SupportedChainId.MAINNET), STAR[SupportedChainId.MAINNET], FAI[SupportedChainId.MAINNET], WEN[SupportedChainId.MAINNET], XUSDT[SupportedChainId.MAINNET]],
  [SupportedChainId.BARNARD]: [ExtendedStar.onChain(SupportedChainId.BARNARD), STAR[SupportedChainId.BARNARD], FAI[SupportedChainId.BARNARD], WEN[SupportedChainId.BARNARD], SHARE[SupportedChainId.BARNARD], XUSDT[SupportedChainId.BARNARD], XETH[SupportedChainId.BARNARD]],
  [SupportedChainId.PROXIMA]: [ExtendedStar.onChain(SupportedChainId.PROXIMA), STAR[SupportedChainId.PROXIMA], FAI[SupportedChainId.PROXIMA], WEN[SupportedChainId.PROXIMA], SHARE[SupportedChainId.PROXIMA], XUSDT[SupportedChainId.PROXIMA], XETH[SupportedChainId.PROXIMA]],
  [3]: [ExtendedStar.onChain(3), WETH9_EXTENDED[3]],
  [4]: [ExtendedStar.onChain(4), WETH9_EXTENDED[4]],
  [5]: [ExtendedStar.onChain(5), WETH9_EXTENDED[5]],
  [42]: [ExtendedStar.onChain(42), WETH9_EXTENDED[42]],
  [SupportedChainId.ARBITRUM_ONE]: [
    ExtendedStar.onChain(SupportedChainId.ARBITRUM_ONE),
    WETH9_EXTENDED[SupportedChainId.ARBITRUM_ONE],
  ],
  [SupportedChainId.APTOS_MAIN]: [ExtendedApt.onChain(SupportedChainId.APTOS_MAIN), STAR[SupportedChainId.APTOS_MAIN], XUSDC[SupportedChainId.APTOS_MAIN]],
  [SupportedChainId.APTOS_TEST]: [ExtendedApt.onChain(SupportedChainId.APTOS_TEST), STAR[SupportedChainId.APTOS_TEST], XUSDC[SupportedChainId.APTOS_TEST]],
  [SupportedChainId.APTOS_DEV]: [ExtendedApt.onChain(SupportedChainId.APTOS_DEV), STAR[SupportedChainId.APTOS_DEV], XUSDC[SupportedChainId.APTOS_DEV]]
}

export const COMMON_BASES_NAME: ChainNameCurrencyList = {
  // ['MAINNET']: [ExtendedStar.onChain(1), DAI, USDC, USDT, WBTC, WETH9_EXTENDED[1]],
  ['MAINNET']: [ExtendedStar.onChain(SupportedChainId.MAINNET), STAR_NAME['MAINNET'], FAI[SupportedChainId.MAINNET], WEN[SupportedChainId.MAINNET], XUSDT_NAME['MAINNET']],
  ['BARNARD']: [ExtendedStar.onChain(SupportedChainId.BARNARD), STAR[SupportedChainId.BARNARD], FAI[SupportedChainId.BARNARD], WEN[SupportedChainId.BARNARD], SHARE[SupportedChainId.BARNARD], XUSDT[SupportedChainId.BARNARD], XETH[SupportedChainId.BARNARD]],
  ['PROXIMA']: [ExtendedStar.onChain(SupportedChainId.PROXIMA), STAR[SupportedChainId.PROXIMA], FAI[SupportedChainId.PROXIMA], WEN[SupportedChainId.PROXIMA], SHARE[SupportedChainId.PROXIMA], XUSDT[SupportedChainId.PROXIMA], XETH[SupportedChainId.PROXIMA]],
  ['ROPSTEN']: [ExtendedStar.onChain(3), WETH9_EXTENDED[3]],
  ['RINKEBY']: [ExtendedStar.onChain(4), WETH9_EXTENDED[4]],
  ['GOERLI']: [ExtendedStar.onChain(5), WETH9_EXTENDED[5]],
  ['KOVAN']: [ExtendedStar.onChain(42), WETH9_EXTENDED[42]],
  ['ARBITRUM_ONE']: [
    ExtendedStar.onChain(SupportedChainId.ARBITRUM_ONE),
    WETH9_EXTENDED[SupportedChainId.ARBITRUM_ONE],
  ],
  ['APTOS_MAIN']: [ExtendedApt.onChain(SupportedChainId.APTOS_MAIN), STAR_NAME['APTOS_MAIN'], XUSDC_NAME['APTOS_MAIN']],
  ['APTOS_TEST']: [ExtendedApt.onChain(SupportedChainId.APTOS_TEST), STAR_NAME['APTOS_TEST'], XUSDC_NAME['APTOS_TEST']],
  ['APTOS_DEV']: [ExtendedApt.onChain(SupportedChainId.APTOS_DEV), STAR_NAME['APTOS_DEV'], XUSDC_NAME['APTOS_DEV']],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  // [1]: [...WETH_ONLY[1], DAI, USDC, USDT, WBTC],
  [SupportedChainId.MAINNET]: [ExtendedStar.onChain(SupportedChainId.MAINNET).wrapped],
  [SupportedChainId.BARNARD]: [ExtendedStar.onChain(SupportedChainId.BARNARD).wrapped],
  [SupportedChainId.PROXIMA]: [ExtendedStar.onChain(SupportedChainId.PROXIMA).wrapped],
  [SupportedChainId.APTOS_MAIN]: [ExtendedApt.onChain(SupportedChainId.APTOS_MAIN).wrapped],
  [SupportedChainId.APTOS_TEST]: [ExtendedApt.onChain(SupportedChainId.APTOS_TEST).wrapped],
  [SupportedChainId.APTOS_DEV]: [ExtendedApt.onChain(SupportedChainId.APTOS_DEV).wrapped]
}

export const BASES_TO_TRACK_LIQUIDITY_FOR_NAME: ChainNameTokenList = {
  ['MAINNET']: [ExtendedStar.onChain(SupportedChainId.MAINNET).wrapped],
  ['BARNARD']: [ExtendedStar.onChain(SupportedChainId.BARNARD).wrapped],
  ['PROXIMA']: [ExtendedStar.onChain(SupportedChainId.PROXIMA).wrapped],
  ['APTOS_MAIN']: [ExtendedApt.onChain(SupportedChainId.APTOS_MAIN).wrapped],
  ['APTOS_TEST']: [ExtendedApt.onChain(SupportedChainId.APTOS_TEST).wrapped],
  ['APTOS_DEV']: [ExtendedApt.onChain(SupportedChainId.APTOS_DEV).wrapped]
}


export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  // [1]: [
  //   [
  //     new Token(1, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
  //     new Token(1, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin'),
  //   ],
  //   [USDC, USDT],
  //   [DAI, USDT],
  // ],
}
