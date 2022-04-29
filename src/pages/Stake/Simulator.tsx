import { Trans } from '@lingui/macro'
import { useState, useEffect } from 'react'
import JSBI from 'jsbi'
import { Percent } from '@uniswap/sdk-core'
import styled from 'styled-components'
import { RouteComponentProps, Link } from 'react-router-dom'
import { Text } from 'rebass'
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
import STCBlueLogo from '../../assets/images/stc_logo_blue.png'
import StarswapBlueLogo from '../../assets/svg/starswap_product_logo_blue.svg'
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
import BigNumber from 'bignumber.js'

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

export default function Simulator({ history }: RouteComponentProps) {
  let address = ''
  const { account, chainId } = useActiveWeb3React()
  if (account) {
    address = account.toLowerCase();
  }
  const vestarCount = useGetVestarCount()
  const network = getCurrentNetwork(chainId)

  const darkMode = useIsDarkMode()

  const { data, error } = useSWR(`https://swap-api.starswap.xyz/${network}/v1/lpTokenFarms`, fetcher)
  // const isBoost = useIsBoost()
  const [stakedLpArr, setStateLpArr] = useState<string[]>(['1', '1'])
  const [duration, setDuration] = useState<any>(604800)
  const [parseTime, setParseTime] = useState('')

  // TotalVeSTARAmount

  // user input star
  const [lockedValue, setLockedValue] = useState('')
  const [veStarPercentage, setShareOfVeStar] = useState('')
  const [shareVeStar, setShareVeStar] = useState('');
  const [boostFactor, setBoostFactor] = useState('')

  const [ veStarAmount, setVeStarAmount ] = useState(0)

  useEffect(
    () => {
      const url = `https://swap-api.starswap.xyz/${network}/v1/getAccountVeStarAmountAndBoostSignature?accountAddress=${address}`
      axios.get(url).then(res => res.data).then(data => {
        setVeStarAmount(data.veStarAmount)
      })
    },
    [address]
  )
  useEffect(() => {
    // userInputStarToVeStar
    const _userVeStarCount = Number(((Number(lockedValue) * scalingFactor * (duration / 86400)) / (365 * 2)).toFixed(0))
    setShareVeStar(_userVeStarCount + '')
    // share of  veSTAR
    if (vestarCount) {
      const veStarPercentage = new Percent(JSBI.BigInt(_userVeStarCount + veStarAmount), JSBI.BigInt(_userVeStarCount + veStarAmount + vestarCount)).toFixed(9)
      setShareOfVeStar(veStarPercentage)
    }
  }, [veStarAmount, lockedValue, duration, vestarCount, data])

  const getBoostFactor = (index: any) => {
    const BoostFactor = (Number(veStarPercentage) / Number(new BigNumber((2/3) * Number(stakedLpArr[index]) * scalingFactor / data[index].totalStakeAmount))) + 1
    return isNaN(BoostFactor) ? 1.0 : Infinity === BoostFactor ? 1.0 : Math.min(2.5, BoostFactor).toFixed(2)
  }

  const handleDurationChange = (event: any) => {
    setDuration(event.target.value)
  }

  useEffect(() => {
    setParseTime((new Date(new Date().getTime() + duration * 1000) + '').slice(4, 21))
  }, [duration])



  if (error) return null
  if (!data) return null
  const list = data

  const farmAPRTips = () => {
    return (
      <>
        <Trans>
          The Stepwise Multiplier represents the proportion of STAR rewards each farm receives, as a proportion of the
          STAR produced each block.
        </Trans>
        <br />
        <br />
        <Trans>For example, if a 1x farm received 1 STAR per block, a 40x farm would receive 40 STAR per block.</Trans>
        <br />
        <br />
        <Trans>This amount is already included in all APR calculations for the farm.</Trans>
        <br />
      </>
    )
  }

  return (
    <>
      <Container style={{ display: 'flex' }}>
        <Link to="/stake" style={{ transform: 'translateX(-40px)' }}>
          <StyledArrowLeft />
        </Link>
        <Trans>Stake Simulator</Trans>
      </Container>
      <AutoRow justify="center" style={{ paddingTop: '1rem', maxWidth: '1200px' }}>
        <FarmCard style={{ width: '450px', maxWidth: '450px' }}>
          <FixedHeightRow marginBottom={10}>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Your Locked</Trans>
            </Text>
            <RowFixed style={{ width: '150px' }}>
              <NumericalInput
                className="token-amount-input"
                value={lockedValue}
                onUserInput={(val) => {
                  setLockedValue(val)
                }}
              />
              <Text fontSize={16} fontWeight={500} marginLeft={2}>
                <Trans>STAR</Trans>
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <RadioContainer>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <Trans>Duration</Trans>
              </FormLabel>
              <RadioGroup aria-label="duration" name="duration" value={duration} onChange={handleDurationChange}>
                <FormControlLabel value="604800" control={<Radio />} label={`7 Days (2x)`} />
                <FormControlLabel value="1209600" control={<Radio />} label={`14 Days (3x)`} />
                <FormControlLabel value="2592000" control={<Radio />} label={`30 Days (4x)`} />
                <FormControlLabel value="5184000" control={<Radio />} label={`60 Days (6x)`} />
                <FormControlLabel value="7776000" control={<Radio />} label={`90 Days (8x)`} />
              </RadioGroup>
            </FormControl>
          </RadioContainer>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Lock Until</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
                {parseTime}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Total veSTAR</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
                {vestarCount / scalingFactor}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Your veSTAR Balance</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
                {Number(veStarAmount) / scalingFactor}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Your veSTAR Estimated</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
                {Number(shareVeStar) / scalingFactor}
              </Text>
              <QuestionHelper text={<Trans>Your veSTAR Estimated Tips</Trans>} />
            </RowFixed>
          </FixedHeightRow>
          <FixedHeightRow>
            <Text fontSize={16} fontWeight={500}>
              <Trans>Percentage</Trans>
            </Text>
            <RowFixed>
              <Text fontSize={16} fontWeight={500}>
                {(Number(veStarPercentage))} %
              </Text>
              <QuestionHelper text={<Trans>Percentage Tips</Trans>} />
            </RowFixed>
          </FixedHeightRow>
        </FarmCard>
      </AutoRow>
      <AutoRow justify="center" style={{ paddingTop: '1rem', maxWidth: '1200px' }}>
        {list
          ? list.map((item: any, index: any) => (
              <FarmCard key={index} style={{ width: '400px', maxWidth: '400px' }}>
                <AutoColumn justify="center">
                  <RowFixed>
                    <StyledEthereumLogo src={STCBlueLogo} size={'48px'} style={{ marginRight: '1.25rem' }} />
                    <StyledEthereumLogo
                      src={
                        item.liquidityTokenFarmId.liquidityTokenId.tokenXId === 'STAR'
                          ? StarswapBlueLogo
                          : darkMode
                          ? FAIBlueLogo
                          : FAILogo
                      }
                      size={'48px'}
                    />
                  </RowFixed>
                  <Text fontSize={16} marginTop={23}>
                    {item.liquidityTokenFarmId.liquidityTokenId.tokenYId}/
                    {item.liquidityTokenFarmId.liquidityTokenId.tokenXId}
                  </Text>
                </AutoColumn>
                <FixedHeightRow marginTop={30} marginBottom={10}>
                  <Text fontSize={16} fontWeight={500}>
                    <Trans>You staked lp amount</Trans>
                  </Text>
                  <RowFixed style={{ width: '100px' }}>
                    <NumericalInput
                      className="token-amount-input"
                      value={stakedLpArr[index] || ''}
                      onUserInput={(val) => {
                        let _tmp = stakedLpArr
                        _tmp[index] = val
                        setStateLpArr([..._tmp])
                      }}
                    />
                  </RowFixed>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text fontSize={16} fontWeight={500}>
                    <Trans>Your share of staking</Trans>
                  </Text>
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500}>
                      {Number(Number(stakedLpArr[index]) * scalingFactor / data[index].totalStakeAmount).toFixed(9)} %
                    </Text>
                  </RowFixed>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text fontSize={16} fontWeight={500}>
                    <Trans>Boost Factor</Trans>
                  </Text>
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500}>
                      {getBoostFactor(index)}X
                    </Text>
                    <QuestionHelper text={<Trans>Boost Factor Tips</Trans>} />
                  </RowFixed>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text fontSize={16} fontWeight={500}>
                    <Trans>Boost APR</Trans>
                  </Text>
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500}>
                      {((getBoostFactor(index) as number) * item.estimatedApy).toFixed(2)}%
                    </Text>
                    <QuestionHelper
                      text={<Trans>The boosted estimated annualized percentage yield of rewards</Trans>}
                    />
                  </RowFixed>
                </FixedHeightRow>
              </FarmCard>
            ))
          : null}
      </AutoRow>
      <SwitchLocaleLink />
    </>
  )
}
