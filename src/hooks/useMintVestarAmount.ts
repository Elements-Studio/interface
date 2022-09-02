import { useEffect, useState, useCallback } from 'react'
import { useStarcoinProvider } from './useStarcoinProvider';

export default function useMintVestarAmount(token: string, address: string, id: number): number {
  const [ret, setRet] = useState<number>(0)
  const starcoinProvider = useStarcoinProvider()

  const contractSend = useCallback(async () => {
    const contractMethod = 'contract.call_v2'
    const functionId = '0x8c109349c6bd91411d6bc962e080c4a3::TokenSwapSyrupScript::query_vestar_amount_by_staked_id_tokentype'
    const tyArgs: any[] = [token]
    const args: any[] = [address, id];

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
  }, [token, address, id, starcoinProvider]);

  useEffect(() => {
    contractSend()
  });

  return ret
}
