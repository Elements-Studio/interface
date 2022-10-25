import { FACTORY_ADDRESS_STARCOIN as V2_FACTORY_ADDRESS_STARCOIN, FACTORY_ADDRESS_APTOS as V2_FACTORY_ADDRESS_APTOS } from '@starcoin/starswap-v2-sdk'
import getNetworkType from '../utils/getNetworkType'


export function useV2FactoryAddress(): string {
  const networkType = getNetworkType()
  return networkType === 'APTOS' ? V2_FACTORY_ADDRESS_APTOS : V2_FACTORY_ADDRESS_STARCOIN
}
