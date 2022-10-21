import { useActiveWeb3React } from 'hooks/web3'
import Loader from 'components/Loader'
import { getChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { CheckMarkIcon } from 'nft/components/icons'
import styled, { useTheme } from 'styled-components/macro'

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
  color: ${({ theme }) => theme.text1};
  width: 240px;
  transition: visibility 150ms linear, opacity 150ms linear;
    background-color;

  &:hover {
    background-color: ${({ theme }) => theme.bg3};
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
  color: ${({ theme }) => theme.text1};
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
  targetChain: SupportedChainId
  onSelectChain: (targetChain: number) => void
  isPending: boolean
}) {
  const { chainId } = useActiveWeb3React()
  const active = chainId === targetChain
  const { label, logoUrl } = getChainInfo(targetChain)

  // const theme = useTheme()

  return (
    <Container onClick={() => onSelectChain(targetChain)}>
      <Logo src={logoUrl} alt={label} />
      <Label>{label}</Label>
      {isPending && <ApproveText>Approve in wallet</ApproveText>}
      <Status>
        {active && <CheckMarkIcon width={LOGO_SIZE} height={LOGO_SIZE} />}
        {isPending && <Loader width={LOGO_SIZE} height={LOGO_SIZE} />}
      </Status>
    </Container>
  )
}
