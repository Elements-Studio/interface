import Loader from 'components/Loader'
import { getNetworkInfo } from 'constants/chainInfo'
import { CheckMarkIcon } from 'nft/components/icons'
import styled, { useTheme } from 'styled-components/macro'
import {useGetType} from 'state/networktype/hooks'

const LOGO_SIZE = 20

const Container = styled.button`
  display: grid;
  background: none;
  grid-template-columns: min-content 1fr min-content;
  align-items: center;
  text-align: left;
  line-height: 24px;
  border: none;
  justify-content: space-between;
  padding: 10px 8px;
  cursor: pointer;
  border-radius: 12px;
  color: ${({ theme }) => theme.textPrimary};
  width: 240px;
  transition: ${({ theme }) => theme.transition.duration.medium} ${({ theme }) => theme.transition.timing.ease}
    background-color;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    width: 100%;
  }

  &:hover {
    background-color: ${({ theme }) => theme.backgroundOutline};
  }
`

const Label = styled.div`
  grid-column: 2;
  grid-row: 1;
  font-size: 16px;
`

const Status = styled.div`
  grid-column: 3;
  grid-row: 1;
  display: flex;
  align-items: center;
  width: ${LOGO_SIZE}px;
`

const ApproveText = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
  grid-column: 2;
  grid-row: 2;
`

const Logo = styled.img`
  height: ${LOGO_SIZE}px;
  width: ${LOGO_SIZE}px;
  margin-right: 12px;
`

export default function ChainSelectorRow({
  targetChain,
  onSelectChain,
  isPending,
}: {
  targetChain: string
  onSelectChain: (targetChain: string) => void
  isPending: boolean
}) {
  const networkType = useGetType()
  const active = networkType === targetChain
  const { label, logoUrl } = getNetworkInfo(targetChain)

  const theme = useTheme()

  return (
    <Container onClick={() => onSelectChain(targetChain)}>
      <Logo src={logoUrl} alt={label} />
      <Label>{label}</Label>
      {isPending && <ApproveText>Approve in wallet</ApproveText>}
      <Status>
        {active && <CheckMarkIcon width={LOGO_SIZE} height={LOGO_SIZE} color={theme.accentActive} />}
        {isPending && <Loader width={LOGO_SIZE} height={LOGO_SIZE} />}
      </Status>
    </Container>
  )
}
