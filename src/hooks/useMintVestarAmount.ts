import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useStarcoinProvider } from './useStarcoinProvider';
import { useActiveWeb3React } from './web3'
import { useGetType, useGetCurrentNetwork } from 'state/networktype/hooks'
import { useWallet } from '@starcoin/aptos-wallet-adapter'
import getChainId from 'utils/getChainId';

export default function useMintVestarAmount(token: string, address: string, id: number): number {
  const [ret, setRet] = useState<number>(0)
  const starcoinProvider = useStarcoinProvider()
  const {network: aptosNetwork} = useWallet();
  const chainId = getChainId(aptosNetwork?.name);
  const network = useGetCurrentNetwork(chainId)
  const networkType = useGetType()

  const contractSend = useCallback(async () => {
    if (networkType === 'APTOS') {
      const url = `https://swap-api.starcoin.org/${ network }/v1/contract-api/getVestarAmountByTokenTypeAndStakeId?token=${ token }&stakeId=${ id }&accountAddress=${ address }`
      axios.get(url).then(res => {
        setRet(res?.data || 0)
      })
    } else {
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
    }
  }, [token, address, id, starcoinProvider]);

  useEffect(() => {
    contractSend()
  });

  return ret
}
