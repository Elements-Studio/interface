import { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js';
import axios from 'axios'
import { useActiveWeb3React } from './web3'
import { useStarcoinProvider } from './useStarcoinProvider';
import getNetworkType from '../utils/getNetworkType'
import getCurrentNetwork from '../utils/getCurrentNetwork'

export default function useComputeBoostFactor(
  lockedAmount: BigNumber | number,
  lockedFarmAmount: BigNumber | number,
  totalFarmAmount: BigNumber | number
): number {
  const [ret, setRet] = useState<number>(100)
  const starcoinProvider = useStarcoinProvider()
  const { chainId } = useActiveWeb3React()
  const network = getCurrentNetwork(chainId)
  const networkType = getNetworkType()

  const contractSend = useCallback(async () => {
    if (lockedAmount && lockedFarmAmount && totalFarmAmount) {
      if (networkType === 'APTOS') {
        const url = `https://swap-api.starcoin.org/${ network }/v1/contract-api/computeBoostFactor?userLockedVestarAmount=${ new BigNumber(lockedAmount).toNumber() }&userLockedFarmAmount=${ new BigNumber(lockedFarmAmount).toNumber() }&totalFarmAmount=${ totalFarmAmount }`
        axios.get(url).then(res => {
          setRet(res?.data || 0)
        })
      } else {
        const contractMethod = 'contract.call_v2'
        const functionId = '0x8c109349c6bd91411d6bc962e080c4a3::Boost::compute_boost_factor'
        const tyArgs: any[] = []
        const args: any[] = [`${ new BigNumber(lockedAmount).toNumber() }u128`, `${ new BigNumber(lockedFarmAmount).toNumber() }u128`, `${ totalFarmAmount }u128`]

        await new Promise((resolve, reject) => {
          return starcoinProvider
            ?.send(contractMethod, [
              {
                function_id: functionId,
                type_args: tyArgs,
                args,
              },
            ])
            .then((result: Array<number>) => {
              setRet(result[0] || 0)
            })
        })
      }
    }
  }, [lockedAmount, lockedFarmAmount, totalFarmAmount, starcoinProvider])

  useEffect(() => {
    contractSend()
  })

  return ret
}
