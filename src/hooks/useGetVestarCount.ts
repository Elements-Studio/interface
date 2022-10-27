import { useEffect, useState, useCallback } from 'react';
import axios from 'axios'
import { useStarcoinProvider } from './useStarcoinProvider';
import { useActiveWeb3React } from './web3'
import getNetworkType from '../utils/getNetworkType'
import getCurrentNetwork from '../utils/getCurrentNetwork'

export default function useGetVestarCount(): number {
  const [vestarCount, setVestarCount] = useState(0);
  const starcoinProvider = useStarcoinProvider()
  const { chainId } = useActiveWeb3React()
  const network = getCurrentNetwork(chainId)
  const networkType = getNetworkType()

  const contractSend = useCallback(async () => {
    if (networkType === 'APTOS') {
      const tokenAddress = '0xc3dbe4f07390f05b19ccfc083fc6aa5bc5d75621d131fc49557c8f4bbc11716::VESTAR::VESTAR'
      const url = `https://swap-api.starcoin.org/${ network }/v1/contract-api/getCoinSupply?token=${ tokenAddress }`
      axios.get(url).then(res => {
        setVestarCount(res?.data || 0)
      })
    } else {
      const contractMethod = "contract.call_v2";
      const functionId = '0x1::Token::market_cap'
      const tyArgs = ['0x8c109349c6bd91411d6bc962e080c4a3::VESTAR::VESTAR'];
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
              setVestarCount(result[0] || 0)
            }
          })
      });
    }
  }, [starcoinProvider]);

  useEffect(() => {
    contractSend();
  });

  return vestarCount;
}
