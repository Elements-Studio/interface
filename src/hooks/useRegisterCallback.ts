import { Currency } from '@starcoin/starswap-sdk-core'
import { useMemo } from 'react'
import { useActiveWeb3React } from './web3'
import { useRegisterSwapPair } from './useTokenSwapScript'

export enum RegisterCallbackState {
  INVALID,
  LOADING,
  VALID,
}

export function useRegisterCallback(
  inputCurrency?: Currency,
  outputCurrency?: Currency
): {
  state: RegisterCallbackState
  callback: null | (() => Promise<string>)
  error: string | null
} {
  const { account } = useActiveWeb3React()

  const handleRegisterSwapPair = useRegisterSwapPair(account ?? undefined)

  return useMemo(() => {
    if (!account || !inputCurrency || !outputCurrency) {
      return { state: RegisterCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }

    return {
      state: RegisterCallbackState.VALID,
      callback: async function onRegister(): Promise<string> {
        return handleRegisterSwapPair(inputCurrency.wrapped.address, outputCurrency.wrapped.address).catch((error) => {
          if (error?.code === 4001) {
            throw new Error('Transaction rejected.')
          } else {
            throw new Error(`Register failed: ${error.message}`)
          }
        })
      },
      error: null,
    }
  }, [account, handleRegisterSwapPair, inputCurrency, outputCurrency])
}
