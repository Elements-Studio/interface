import { SupportedChainId } from '../constants/chains'

export const STCSCAN_SUFFIXES: { [chainId: number]: string } = {
  [SupportedChainId.MAINNET]: 'main',
  [SupportedChainId.PROXIMA]: 'proxima',
  [SupportedChainId.BARNARD]: 'barnard',
  [SupportedChainId.HALLEY]: 'halley',
}

export const APTOS_SUFFIXES: { [chainId: number]: string } = {
  [SupportedChainId.APTOS_MAIN]: 'mainnet',
  [SupportedChainId.APTOS_TEST]: 'testnet',
  [SupportedChainId.APTOS_DEV]: 'devnet',
  [SupportedChainId.APTOS_MAIN_OTHER]: 'Mainnet',
  [SupportedChainId.APTOS_TEST_OTHER]: 'Testnet',
  [SupportedChainId.APTOS_DEV_OTHER]: 'Devnet',
}

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  // TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(chainId: number, data: string, type: ExplorerDataType, networkType: string = 'STARCOIN'): string {
  // if (chainId === SupportedChainId.ARBITRUM_ONE) {
  //   switch (type) {
  //     case ExplorerDataType.TRANSACTION:
  //       return `https://explorer.arbitrum.io/tx/${data}`
  //     case ExplorerDataType.ADDRESS:
  //       return `https://explorer.arbitrum.io/address/${data}`
  //     case ExplorerDataType.BLOCK:
  //       return `https://explorer.arbitrum.io/block/${data}`
  //     default:
  //       return `https://explorer.arbitrum.io/`
  //   }
  // }

  // if (chainId === SupportedChainId.ARBITRUM_RINKEBY) {
  //   switch (type) {
  //     case ExplorerDataType.TRANSACTION:
  //       return `https://rinkeby-explorer.arbitrum.io/tx/${data}`
  //     case ExplorerDataType.ADDRESS:
  //       return `https://rinkeby-explorer.arbitrum.io/address/${data}`
  //     case ExplorerDataType.BLOCK:
  //       return `https://rinkeby-explorer.arbitrum.io/block/${data}`
  //     default:
  //       return `https://rinkeby-explorer.arbitrum.io/`
  //   }
  // }

  if (networkType === 'STARCOIN') {
    const prefix = `https://stcscan.io/${ STCSCAN_SUFFIXES[chainId] ?? '' }`

    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `${ prefix }/transactions/detail/${ data }`

      // case ExplorerDataType.TOKEN:
      //   return `${prefix}/token/${data}`

      case ExplorerDataType.BLOCK:
        return `${ prefix }/blocks/detail/${ data }`

      case ExplorerDataType.ADDRESS:
        return `${ prefix }/address/${ data }`
      default:
        return `${ prefix }`
    }
  }

  if (networkType === 'APTOS') {
    const prefix = 'https://explorer.aptoslabs.com'
    const network = APTOS_SUFFIXES[chainId]

    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `${ prefix }/txn/${ data }?network=${ network }`

      // case ExplorerDataType.TOKEN:
      //   return `${prefix}/token/${data}`

      case ExplorerDataType.BLOCK:
        return `${ prefix }/block/${ data }?network=${ network }`

      case ExplorerDataType.ADDRESS:
        return `${ prefix }/account/${ data }?network=${ network }`
      default:
        return `${ prefix }`
    }
  }

  return ''
}
