import { Trans } from '@lingui/macro'
import { useMemo } from 'react'
import ReactGA from 'react-ga'
import { useActiveWeb3React } from 'hooks/web3'
import styled from 'styled-components/macro'
import { StyledInternalLink, TYPE } from '../../theme'
import getCurrentNetwork from '../../utils/getCurrentNetwork'
import axios from 'axios';
import useSWR from "swr";

const fetcher = (url:any) => axios.get(url).then(res => res.data)

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

export default function FarmTitle() {
    const { chainId } = useActiveWeb3React()
    const network = getCurrentNetwork(chainId)

    const { data, error } = useSWR(
      // "http://a1277180fcb764735801852ac3de308f-21096515.ap-northeast-1.elb.amazonaws.com:80/v1/starswap/farmingTvlInUsd",
      `https://swap-api.starcoin.org/${network}/v1/syrupPoolTvlInUsd`,
      fetcher
    );

    // if (error) return "An error has occurred.";
    // if (!data) return "Loading...";
    // if (error) return null;
    // if (!data) return null;
    const tvlUSD = data?.toFixed(2) || 0;

    return (
      <>
        <Container>
          <Trans>
            Stake to Earn
          </Trans>
        </Container>
        <TitleTotal>
          <Trans>Total Value Locked in USDT</Trans>: {tvlUSD}
        </TitleTotal>
      </>
    )
}
