import { useEffect, useState, useCallback } from 'react'
import { providers } from '@starcoin/starcoin'
import BigNumber from 'bignumber.js';


export default function useComputeBoostFactor(
  lockedAmount: BigNumber | number,
  lockedFarmAmount: BigNumber | number,
  totalFarmAmount: BigNumber | number
): number {
  const [ret, setRet] = useState<number>(100)
  const contractSend = useCallback(async () => {
    let starcoinProvider: any

    try {
      if (window.starcoin) {
        starcoinProvider = new providers.Web3Provider(window.starcoin, 'any')
      }
    } catch (error) {
      console.error(error)
    }

    if (lockedAmount && lockedFarmAmount && totalFarmAmount) {
      const contractMethod = 'contract.call_v2'
      const functionId = '0x8c109349c6bd91411d6bc962e080c4a3::Boost::compute_boost_factor'
      const tyArgs: any[] = []
      const args: any[] = [`${lockedAmount}u128`, `${lockedFarmAmount}u128`, `${totalFarmAmount}u128`]

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
  }, [lockedAmount, lockedFarmAmount, totalFarmAmount])

  useEffect(() => {
    contractSend()
  })

  return ret
}
