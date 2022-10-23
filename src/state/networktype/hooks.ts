import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { AppState } from '../index'
import { setType } from './actions'

export function useSetType(): (key: string) => void {
    const dispatch = useAppDispatch()

    return useCallback(
        (key: string) => {
            dispatch(setType({key}))
        },
        [dispatch]
    )
}

export function useGetType(): string {  
    return useAppSelector((state: AppState) => state.networktype.type)
}