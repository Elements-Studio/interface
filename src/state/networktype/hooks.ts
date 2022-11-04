import { useCallback } from 'react'
import { FACTORY_ADDRESS_STARCOIN as V2_FACTORY_ADDRESS_STARCOIN, FACTORY_ADDRESS_APTOS as V2_FACTORY_ADDRESS_APTOS } from '@starcoin/starswap-v2-sdk'
import { STCSCAN_SUFFIXES, APTOS_SUFFIXES } from 'utils/getExplorerLink'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { useActiveWeb3React } from 'hooks/web3'
import { AppState } from '../index'
import { setType } from './actions'

export function useSetType(): (key: string) => void {
    const dispatch = useAppDispatch()

    return useCallback(
        (key: string) => {
            dispatch(setType({ key }))
        },
        [dispatch]
    )
}

export function useGetType(): string {
    return useAppSelector((state: AppState) => state.networktype.type)
}

export function useGetV2FactoryAddress(): string {
    const networkType = useGetType()
    const { chainId } = useActiveWeb3React()
    // console.log('useGetV2FactoryAddress', { networkType, chainId })
    if (networkType === 'APTOS' && chainId === 1) {
        return '0x9bf32e42c442ae2adbc87bc7923610621469bf183266364503a7a434fe9d50ca'
    }
    return networkType === 'APTOS' ? V2_FACTORY_ADDRESS_APTOS : V2_FACTORY_ADDRESS_STARCOIN
}


export function useGetCurrentNetwork(chainId: number | undefined) {
    const networkType = useGetType()
    if (networkType === 'APTOS') {
        const name = APTOS_SUFFIXES[chainId ? chainId : 1]
        return name ? `aptos-${ name }` : undefined
    }
    return STCSCAN_SUFFIXES[chainId ? chainId : 1]
}
