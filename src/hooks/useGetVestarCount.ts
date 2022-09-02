import { useEffect, useState, useCallback } from 'react';
import { useStarcoinProvider } from './useStarcoinProvider';

export default function useGetVestarCount(): number {
  const [vestarCount, setVestarCount] = useState(0);
  const starcoinProvider = useStarcoinProvider()

  const contractSend = useCallback(async () => {
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
  }, [starcoinProvider]);

  useEffect(() => {
    contractSend();
  });

  return vestarCount;
}
