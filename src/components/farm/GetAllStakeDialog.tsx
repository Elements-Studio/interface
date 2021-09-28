import { Currency, Token } from '@uniswap/sdk-core'
import { useCallback, useState, useContext } from 'react'
import ReactGA from 'react-ga'
import { t, Trans } from '@lingui/macro'
import { TYPE } from '../../theme'
import styled, { ThemeContext } from 'styled-components'
import Column, { AutoColumn, ColumnCenter } from '../Column'
import Row, { RowBetween, AutoRow } from '../Row'
import Modal from '../Modal'
import { ButtonFarm, ButtonBorder } from 'components/Button'


interface FarmStakeDialogProps {
  isOpen: boolean
  onDismiss: () => void
}

export default function FarmStakeDialog({
  onDismiss,
  isOpen,
}: FarmStakeDialogProps) {

  const theme = useContext(ThemeContext)
 
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} dialogBg={ theme.bgCard }>
      <ColumnCenter style={{ padding: '27px 32px'}}>
        <AutoRow justify={'center'}>
          <TYPE.black fontWeight={500} fontSize={20} style={{ textAlign: 'center' }}>
            <Trans>This operation extracts all pledged liquidity quotas and rewards. Do you continue to perform the operation?</Trans>
          </TYPE.black>
        </AutoRow>
        <RowBetween style={{ marginTop: '24px' }}>
          <ButtonBorder marginRight={22} onClick={onDismiss} >
            <TYPE.black>
              <Trans>Cancel</Trans>
            </TYPE.black>
          </ButtonBorder>
          <ButtonFarm onClick={() => { }}>
            <TYPE.main color={'#fff'}>
              <Trans>Confirm</Trans>
            </TYPE.main>
          </ButtonFarm>
        </RowBetween>
      </ColumnCenter>
    </Modal>
  )
}