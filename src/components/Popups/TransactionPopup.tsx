import { useContext } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks/web3'
import { TYPE } from '../../theme'
import { ExternalLink } from '../../theme/components'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { useGetType } from 'state/networktype/hooks'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import { Trans } from '@lingui/macro'
import { useWallet } from '@starcoin/aptos-wallet-adapter'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const {network: aptosNetwork} = useWallet();
  const chainId = Number(aptosNetwork?.chainId || 1);
  const networkType = useGetType()

  const theme = useContext(ThemeContext)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? <CheckCircle color={theme.green1} size={24} /> : <AlertCircle color={theme.red1} size={24} />}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</TYPE.body>
        {chainId && (
          <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION, networkType)}>
            <Trans>View on Explorer</Trans>
          </ExternalLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  )
}
