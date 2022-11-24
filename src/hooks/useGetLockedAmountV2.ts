import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useStarcoinProvider } from './useStarcoinProvider';
import { useActiveWeb3React } from './web3'
import { useGetType, useGetCurrentNetwork } from 'state/networktype/hooks'
import { useWallet } from '@starcoin/aptos-wallet-adapter'
import getChainId from 'utils/getChainId';

export default function useGetLockedAmountV2(tokenX: string, tokenY: string, accountAddress: string): number {
  let _tokenX = tokenX;
  let _tokenY = tokenY;
  const [ret, setRet] = useState<number>(0)
  const starcoinProvider = useStarcoinProvider()
  const {network: aptosNetwork} = useWallet();
  const chainId = getChainId(aptosNetwork?.name);
  const network = useGetCurrentNetwork(chainId)
  const networkType = useGetType()

  const contractSend = useCallback(async () => {
    if (networkType === 'APTOS') {
      const url = `https://swap-api.starcoin.org/${ network }/v1/contract-api/getBoostLockedVestarAmount?tokenX=${ tokenX }&tokenY=${ tokenY }&accountAddress=${ accountAddress }`
      axios.get(url).then(res => {
        setRet(res?.data || 0)
      })
    } else {
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
    }
  }, [tokenX, tokenY, accountAddress, starcoinProvider]);

  useEffect(() => {
    contractSend()
  });

  return ret
}
