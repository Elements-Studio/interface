import { useEffect, useState, useCallback } from 'react'
import { providers } from '@starcoin/starcoin'

export default function useGetLockedAmount(tokenX: string, tokenY: string, accountAddress: string): number {
  let _tokenX = tokenX;
  let _tokenY = tokenY;
  const [ret, setRet] = useState<number>(0)
  const contractSend = useCallback(async () => {
    let starcoinProvider: any

    try {
      if (window.starcoin) {
        starcoinProvider = new providers.Web3Provider(window.starcoin, 'any')
      }
    } catch (error) {
      console.error(error)
    }

    if (_tokenY.indexOf('STC') === -1) {
      const _temp = tokenY
      _tokenY = _tokenX
      _tokenX = _temp
    }

    const contractMethod = 'contract.call_v2'
    const functionId = '0x8c109349c6bd91411d6bc962e080c4a3::TokenSwapFarmBoost::get_boost_locked_vestar_amount'
    const tyArgs: any[] = [_tokenY, _tokenX]
    const args: any[] = [accountAddress]

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
  }, [tokenX, tokenY, accountAddress]);

  useEffect(() => {
    contractSend()
  });

  return ret
}
