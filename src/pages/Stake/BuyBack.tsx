import { Trans } from '@lingui/macro'
import { useState, useEffect } from 'react'
import JSBI from 'jsbi'
import { Percent } from '@uniswap/sdk-core'
import styled from 'styled-components'
import { RouteComponentProps, Link } from 'react-router-dom'
import { Text } from 'rebass'
import { providers } from '@starcoin/starcoin';
import QuestionHelper from '../../components/QuestionHelper'
import Row, { AutoRow, RowFixed, RowBetween } from '../../components/Row'
import { TYPE, IconWrapper } from '../../theme'
import { ButtonFarm } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { Input as NumericalInput } from '../../components/NumericalInput'
import FarmTitle from '../../components/farm/FarmTitle'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { ArrowLeft } from 'react-feather'
import FarmCard from '../../components/farm/FarmCard'
import CurrencyLogo from '../../components/CurrencyLogo'
import { marginTop, maxWidth, paddingTop } from 'styled-system'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import STCLogo from '../../assets/images/stc.png'
import FAILogo from '../../assets/images/fai_token_logo.png'
import FAIBlueLogo from '../../assets/images/fai_token_logo_blue.png'
import STCBlueLogo from '../../assets/svg/stc.svg'
import StarswapBlueLogo from '../../assets/svg/starswap_logo.svg'
import PortisIcon from '../../assets/images/portisIcon.png'
import { useIsDarkMode, useIsBoost } from '../../state/user/hooks'
import { useActiveWeb3React } from 'hooks/web3'
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import getCurrentNetwork from '../../utils/getCurrentNetwork'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import axios from 'axios'
import useSWR from 'swr'
import useGetVestarCount from '../../hooks/useGetVestarCount';
import useGetBuyBackInfo from '../../hooks/useGetBuyBackInfo';
import BigNumber from 'bignumber.js'
import { COMMON_BASES } from '../../constants/routing'
import { unwrappedToken } from '../../utils/unwrappedToken'

export const FixedHeightRow = styled(RowBetween)`
  height: 30px;
`

const fetcher = (url: any) => axios.get(url).then((res) => res.data)

const RadioContainer = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  width: 100%;
  margin-top: 16px;
  margin-bottom: 16px;
  padding-top: 12px;
  padding-left: 16px;
  display: flex;
  justify-content: space-between;
`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 4px;
`
const FarmRow = styled(RowBetween)`
  background: ${({ theme }) => theme.bg7};
  line-height: 20px;
  border-radius: 8px;
  padding: 6px 16px;
  margin-top: 10px;
`

const Container = styled(TYPE.topTitle)`
  margin-top: 1rem !important;
  text-align: center;
`
const TitleTotal = styled.div<{ margin?: string; maxWidth?: string }>`
  position: relative;
  max-width: ${({ maxWidth }) => maxWidth ?? '480px'};
  width: 100%;
  background: linear-gradient(241deg, #FF978E20 0%, #FB548B20 100%);
  font-size: 20px;
  border-radius: 24px;
  margin-top: 2rem;
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: center;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

const scalingFactor = 1000000000

export default function BuyBack({ history }: RouteComponentProps) {
  let address = ''
  const { account, chainId } = useActiveWeb3React()
  if (account) {
    address = account.toLowerCase();
  }
  const info = useGetBuyBackInfo()

  return (
    <>
      <Container style={{ display: 'flex' }}>
        <Link to="/stake" style={{ transform: 'translateX(-40px)' }}>
          <StyledArrowLeft />
        </Link>
        <Trans>STAR Buy Back</Trans>
      </Container>
      <AutoRow justify="center" style={{ paddingTop: '1rem', maxWidth: '1200px' }}>
        <FarmCard style={{ width: '450px', maxWidth: '450px' }}>
          <FarmRow>
            <RowFixed>
              <TYPE.black fontWeight={400} fontSize={14}>
                <Trans>Total STC Amount</Trans>
              </TYPE.black>
            </RowFixed>
            <RowFixed>
              <TYPE.black fontSize={14}>
              {info[1] / scalingFactor}
              </TYPE.black>
            </RowFixed>
          </FarmRow>
          <FarmRow>
            <RowFixed>
              <TYPE.black fontWeight={400} fontSize={14}>
                <Trans>Remaining STC Amount</Trans>
              </TYPE.black>
            </RowFixed>
            <RowFixed>
              <TYPE.black fontSize={14}>
              {info[0] / scalingFactor}
              </TYPE.black>
            </RowFixed>
          </FarmRow>
          <FarmRow>
            <RowFixed>
              <TYPE.black fontWeight={400} fontSize={14}>
                <Trans>Begin Time</Trans>
              </TYPE.black>
            </RowFixed>
            <RowFixed>
              <TYPE.black fontSize={14}>
              {(new Date(info[3]*1000)+'').slice(4,24)}
              </TYPE.black>
            </RowFixed>
          </FarmRow>
          <FarmRow>
            <RowFixed>
              <TYPE.black fontWeight={400} fontSize={14}>
                <Trans>Interval Duration</Trans>
              </TYPE.black>
            </RowFixed>
            <RowFixed>
              <TYPE.black fontSize={14}>
              {info[5]/60} M 
              </TYPE.black>
            </RowFixed>
          </FarmRow>
          <FarmRow>
            <RowFixed>
              <TYPE.black fontWeight={400} fontSize={14}>
                <Trans>Release STC Amount Per Time</Trans>
              </TYPE.black>
            </RowFixed>
            <RowFixed>
              <TYPE.black fontSize={14}>
              {info[2] / scalingFactor}
              </TYPE.black>
            </RowFixed>
          </FarmRow>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Latest boughtback time</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
              {(new Date(info[4]*1000)+'').slice(4,24)}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Next Release Time</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
              {(new Date(info[6]*1000)+'').slice(4,24)}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Next Release STC Amount</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
              {info[7]}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <FixedHeightRow marginBottom={16}>
            <Text fontSize={16} fontWeight={500}>
              <Trans>STAR For Next Buy Back</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
              {info[7]}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <ButtonFarm
            as={Link}
            to={window.starcoin && account ? `/stake/STAR` : '/stake'}
            onClick={() => {
              if (!(window.starcoin && account)) {
                alert('Please Connect StarMask Wallet First! \n请先链接StarMask钱包')
              }
            }}
          >
            <TYPE.main color={'#fff'}>
              <Trans>Buy Back</Trans>
            </TYPE.main>
          </ButtonFarm>
        </FarmCard>
      </AutoRow>
      <SwitchLocaleLink />
    </>
  )
}
