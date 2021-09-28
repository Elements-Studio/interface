import { Trans } from '@lingui/macro'
import { useCallback, useContext, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonError, ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import RegisterHeader from '../../components/register/RegisterHeader'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { useRegisterCallback } from '../../hooks/useRegisterCallback'
import useToggledVersion from '../../hooks/useToggledVersion'
import { useActiveWeb3React } from '../../hooks/web3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/register/actions'
import { useDerivedRegisterInfo, useRegisterActionHandlers } from '../../state/register/hooks'
import AppBody from '../AppBody'

export default function Register({ history }: RouteComponentProps) {
  const { account } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

  const toggleWalletModal = useWalletModalToggle()

  const toggledVersion = useToggledVersion()

  const { currencies } = useDerivedRegisterInfo(toggledVersion)

  const { onSwitchTokens, onCurrencySelection } = useRegisterActionHandlers()

  const [{ showConfirm, registerErrorMessage }, setRegisterState] = useState<{
    showConfirm: boolean
    registerErrorMessage: string | undefined
  }>({
    showConfirm: false,
    registerErrorMessage: undefined,
  })

  const { callback: registerCallback, error: registerCallbackError } = useRegisterCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT]
  )

  const handleRegister = useCallback(() => {
    if (!registerCallback) {
      return
    }
    setRegisterState({
      showConfirm,
      registerErrorMessage: undefined,
    })
    registerCallback()
      .then((hash) => {
        setRegisterState({
          showConfirm,
          registerErrorMessage: undefined,
        })
      })
      .catch((error) => {
        setRegisterState({
          showConfirm,
          registerErrorMessage: error.message,
        })
      })
  }, [registerCallback, showConfirm])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  )

  return (
    <>
      <AppBody>
        <RegisterHeader />
        <Wrapper id="register-page">
          <AutoColumn gap={'md'}>
            <div style={{ display: 'relative' }}>
              <CurrencyInputPanel
                value=""
                currency={currencies[Field.INPUT]}
                onUserInput={() => null}
                hideInput={true}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                showCommonBases={true}
                showMaxButton={false}
                id="register-currency-input"
              />
              <ArrowWrapper clickable>
                <ArrowDown
                  size="16"
                  onClick={() => {
                    onSwitchTokens()
                  }}
                  color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.text1 : theme.text3}
                />
              </ArrowWrapper>
              <CurrencyInputPanel
                value=""
                onUserInput={() => null}
                hideInput={true}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                showCommonBases={true}
                showMaxButton={false}
                id="register-currency-output"
              />
            </div>
            <BottomGrouping>
              {!account ? (
                <ButtonLight onClick={toggleWalletModal}>
                  <Trans>Connect Wallet</Trans>
                </ButtonLight>
              ) : (
                <ButtonError
                  onClick={handleRegister}
                  id="register-button"
                  disabled={!!registerCallbackError}
                  error={!!registerCallbackError}
                >
                  <Text fontSize={20} fontWeight={500}>
                    <Trans>Register</Trans>
                  </Text>
                </ButtonError>
              )}
              {registerErrorMessage ? <SwapCallbackError error={registerErrorMessage} /> : null}
            </BottomGrouping>
          </AutoColumn>
        </Wrapper>
      </AppBody>
      <SwitchLocaleLink />
    </>
  )
}
