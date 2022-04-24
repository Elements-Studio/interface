import { ReactNode, useMemo } from 'react'
import { useActiveWeb3React } from '../../hooks/web3'
import { Trans } from '@lingui/macro'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../earn/styled'
import { ExternalLink, TYPE } from '../../theme'
import { useActiveLocale } from 'hooks/useActiveLocale'

import styled from 'styled-components/macro'

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`
const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

export default function Banner() {
  const local = useActiveLocale()

  return (
  <TopSection gap="md">
    <VoteCard>
      <CardBGImage />
      <CardNoise />
      <CardSection>
        <AutoColumn gap="md">
          <RowBetween>
            <TYPE.white fontWeight={600}>
              <Trans>Boost is about to be online</Trans>
            </TYPE.white>
          </RowBetween>
          <ExternalLink
            style={{ color: 'white', textDecoration: 'underline' }}
            href={local === 'en-US' ? 'https://medium.com/@StarswapEN/white-list-events-vestar-boost-barnard-test-network-online-4ffb8670500b' : 'https://medium.com/@StarswapEN/white-list-events-vestar-boost-barnard-test-network-online-4ffb8670500b'}
            target="_blank"
          >
            <TYPE.white fontSize={14}>
              <Trans>How to qualify in the veSTAR boost whitelist?</Trans>
            </TYPE.white>
          </ExternalLink>
        </AutoColumn>
      </CardSection>
      <CardBGImage />
      <CardNoise />
    </VoteCard>
  </TopSection>
  )
}
