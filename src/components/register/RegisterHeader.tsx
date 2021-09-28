import { Trans } from '@lingui/macro'
import styled from 'styled-components/macro'

import { RowBetween, RowFixed } from '../Row'
import { TYPE } from '../../theme'

const StyledRegisterHeader = styled.div`
  padding: 1rem 1.25rem 0.5rem 1.25rem;
  width: 100%;
  color: ${({ theme }) => theme.text2};
`

export default function RegisterHeader() {
  return (
    <StyledRegisterHeader>
      <RowBetween>
        <RowFixed>
          <TYPE.black fontWeight={500} fontSize={16} style={{ marginRight: '8px' }}>
            <Trans>Register</Trans>
          </TYPE.black>
        </RowFixed>
      </RowBetween>
    </StyledRegisterHeader>
  )
}
