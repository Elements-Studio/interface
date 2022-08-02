import React from 'react'
import styled from 'styled-components/macro'
import { AutoRow, RowFixed, RowBetween } from '../Row'
import { AutoColumn } from '../Column'
import FarmCard from '../farm/FarmCard'
import { TYPE } from '../../theme'
import { Trans } from '@lingui/macro'
import useMintVestarAmount from '../../hooks/useMintVestarAmount'

/**
 * The styled container element that wraps the content of most pages and the tabs.
 * 
 */


const StyledEthereumLogo = styled.img<{ size: string }>`
 width: ${({ size }) => size};
 height: ${({ size }) => size};
 border-radius: 4px;
`;


export default function FarmCardPerson({ children, rest }: { children: React.ReactNode, rest: Record<any, any> }) {
    const mintVestarAmount = useMintVestarAmount(rest.tokenTypeTag, rest.address, rest.id.toString());

  return (
    <AutoRow justify="center">
        <FarmCard>
            <AutoColumn justify="center">
                <RowFixed>
                    <StyledEthereumLogo src={rest.StarswapBlueLogo} style={{ marginRight: '1.25rem' }} size={'48px'} />
                </RowFixed>
                <TYPE.body fontSize={24} style={{ marginTop: '24px' }}>{rest.token}</TYPE.body>
                <TYPE.body fontSize={24} style={{ marginTop: '16px' }}>ID: {rest.id}</TYPE.body>
                <TYPE.body fontSize={24} style={{ marginTop: '16px' }}>{(parseInt(rest.amount) / rest.starScalingFactor).toString()}</TYPE.body>
                <TYPE.body fontSize={16} style={{ marginTop: '16px' }}><Trans>Start</Trans>: {(new Date(rest.startTime*1000)+'').slice(4,24)}</TYPE.body>
                <TYPE.body fontSize={16} style={{ marginTop: '16px' }}><Trans>End</Trans>: {(new Date(rest.endTime*1000)+'').slice(4,24)}</TYPE.body>
                <TYPE.body fontSize={16} style={{ marginTop: '16px' }}><Trans>Stepwise Multiplier</Trans>: {rest.stepwiseMultiplier}</TYPE.body>
                <TYPE.body fontSize={16} style={{ marginTop: '16px' }}><Trans>Mint veSTAR amount</Trans>: {mintVestarAmount / rest.starScalingFactor}</TYPE.body>
                <TYPE.body fontSize={16} style={{ color: 'red', marginTop: '16px' }}><Trans>Pending Gain</Trans>: {Number(rest.expectedGain / rest.starScalingFactor) || 0 }</TYPE.body>
                {children}
            </AutoColumn>
        </FarmCard>
    </AutoRow>
  )
}
