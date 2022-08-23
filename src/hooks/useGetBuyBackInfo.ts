import { useEffect, useState, useCallback } from 'react';
import { providers } from '@starcoin/starcoin';
import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from '@starcoin/starswap-v2-sdk'
import { useActiveWeb3React } from 'hooks/web3'
import getCurrentNetwork from '../utils/getCurrentNetwork'

export default function useGetBuyBackInfo(): number[] {
  const { chainId } = useActiveWeb3React()
  const network = getCurrentNetwork(chainId)
  const [info, setInfo] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);

  const queryInfo = useCallback(async () => {
    let starcoinProvider: any

    try {
      if (window.starcoin) {
        starcoinProvider = new providers.Web3Provider(window.starcoin, 'any')
      }
    } catch (error) {
      console.error(error)
    }

    const PREFIX = `${ V2_FACTORY_ADDRESS }::BuyBackSTAR::`

    const contractMethod = "contract.call_v2";
    const functionId = `${ PREFIX }query_info`;
    const tyArgs: any[] = [];
    const args: any[] = [];

    await new Promise((resolve, reject) => {
      return starcoinProvider
        ?.send(contractMethod, [
          {
            function_id: functionId,
            type_args: tyArgs,
            args,
          },
        ])
        .then((result: number[]) => {
          if (result) {
            setInfo(result)
          }
        })
    });
  }, []);

  useEffect(
    () => {
      queryInfo();
    },
    [network]
  );

  return info;
}
