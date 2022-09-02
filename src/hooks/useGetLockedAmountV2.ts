import { useEffect, useState, useCallback } from 'react'
import { useStarcoinProvider } from './useStarcoinProvider';

export default function useGetLockedAmountV2(tokenX: string, tokenY: string, accountAddress: string): number {
  let _tokenX = tokenX;
  let _tokenY = tokenY;
  const [ret, setRet] = useState<number>(0)
  const starcoinProvider = useStarcoinProvider()

  const contractSend = useCallback(async () => {

    if (_tokenY.indexOf('STC') === -1) {
      const _temp = tokenY
      _tokenY = _tokenX
      _tokenX = _temp
    }

    const contractMethod = 'contract.call_v2'
    const functionId = '0x8c109349c6bd91411d6bc962e080c4a3::TokenSwapFarmRouter::get_boost_locked_vestar_amount'
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
  }, [tokenX, tokenY, accountAddress, starcoinProvider]);

  useEffect(() => {
    contractSend()
  });

  return ret
}
