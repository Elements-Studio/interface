import { t } from '@lingui/macro'
import { Currency } from '@starcoin/starswap-sdk-core'
import { useCallback } from 'react'
import { useActiveWeb3React } from '../../hooks/web3'
import { useCurrency } from '../../hooks/Tokens'
import { Version } from '../../hooks/useToggledVersion'
import { AppState } from '../index'
import { Field, selectCurrency, switchCurrencies } from './actions'
import { useAppDispatch, useAppSelector } from 'state/hooks'

export function useRegisterState(): AppState['register'] {
  return useAppSelector((state) => state.register)
}

export function useRegisterActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
} {
  const dispatch = useAppDispatch()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken ? currency.address : currency.isNative ? 'STC' : '',
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  return {
    onSwitchTokens,
    onCurrencySelection,
  }
}

// from the current register inputs, compute the best trade and return it.
export function useDerivedRegisterInfo(toggledVersion: Version): {
  currencies: { [field in Field]?: Currency }
  inputError?: string
} {
  const { account } = useActiveWeb3React()

  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useRegisterState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  let inputError: string | undefined
  if (!account) {
    inputError = t`Connect Wallet`
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? t`Select a token`
  }

  return {
    currencies,
    inputError,
  }
}
