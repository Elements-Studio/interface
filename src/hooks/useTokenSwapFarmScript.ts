import useSWR from 'swr'
import { useStarcoinProvider } from './useStarcoinProvider'

// const PREFIX = '0xbd7e8be8fae9f60f2f5136433e36a091::TokenSwapRouter::'
// const PREFIX = '0x3db7a2da7444995338a2413b151ee437::TokenSwapFarmScript::'
const PREFIX = '0x4783d08fb16990bd35d83f3e23bf93b8::TokenSwapFarmScript::'
const SYRUP_PREFIX = '0x4783d08fb16990bd35d83f3e23bf93b8::TokenSwapSyrupScript::'

/**
 * 查询当前签名者在某代币对下的流动性
 */
// export function useLiquidity(signer?: string, x?: string, y?: string) {
//   const provider = useStarcoinProvider()
//   return useSWR(
//     signer && x && y ? [provider, 'liquidity', signer, x, y] : null,
//     async () =>
//       (await provider.call({
//         function_id: `${PREFIX}liquidity`,
//         type_args: [x!, y!],
//         args: [signer!],
//       })) as [number]
//   )
// }

/**
 * 查询某Token代币对总流动性
 */
export function useTotalLiquidity(x?: string, y?: string) {
  const provider = useStarcoinProvider()
  return useSWR(
    x && y ? [provider, 'total_liquidity', x, y] : null,
    async () =>
      (await provider.call({
        function_id: `${PREFIX}total_liquidity`,
        type_args: [x!, y!],
        args: [],
      })) as [number]
  )
}

/**
 * 查询某用户的TBD收益
 */
export function useLookupTBDGain(address?: string, x?: string, y?: string) {
  const provider = useStarcoinProvider()
  return useSWR(
    x && y ? [provider, 'lookup_gain', address, x, y] : null,
    async () =>
      (await provider.callV2({
        function_id: `${PREFIX}lookup_gain`,
        type_args: [x!, y!],
        args: [address!],
      })) as [number]
  )
}

/**
 * 查询某用户已经质押的LP Token数量
 */
export function useUserStaked(address?: string, x?: string, y?: string) {
  const provider = useStarcoinProvider()
  return useSWR(
    x && y ? [provider, 'query_stake', address, x, y] : null,
    async () =>
      (await provider.callV2({
        function_id: `${PREFIX}query_stake`,
        type_args: [x!, y!],
        args: [address!],
      })) as [number]
  )
}

/**
 * 查询某用户已经质押的STAR Token数量
 */
export function useUserStarStaked(address?: string, token?: string) {
  const provider = useStarcoinProvider()
  return useSWR(
    token ? [provider, 'query_stake_list', address, token] : null,
    async () =>
      (await provider.callV2({
        function_id: `${SYRUP_PREFIX}query_stake_list`,
        type_args: [token!],
        args: [address!],
      })) as [number] 
  )
}

/**
 * 查询代币对池中的总额度
 */
// export function useGetReserves(x?: string, y?: string) {
//   const provider = useStarcoinProvider()
//   return useSWR(
//     x && y ? [provider, 'get_reserves', x, y] : null,
//     async () =>
//       (await provider.call({
//         function_id: `${PREFIX}get_reserves`,
//         type_args: [x!, y!],
//         args: [],
//       })) as [number, number]
//   )
// }

export function useBatchGetReserves(pairs: ([string, string] | undefined)[]) {
  const provider = useStarcoinProvider()
  return useSWR(
    pairs.length
      ? [provider, 'batch_get_reserves', ...pairs.map((pair) => (pair ? `${pair[0]}${pair[1]}` : ''))]
      : null,
    () =>
      Promise.all(
        pairs.map(async (pair) =>
          pair
            ? ((await provider.call({
                function_id: `${PREFIX}get_reserves`,
                type_args: pair,
                args: [],
              })) as [number, number])
            : []
        )
      )
  )
}

/**
 * 根据x计算y (无手续费)
 */
// export function useQuote(amount_x?: number | string, reverse_x?: number, reverse_y?: number) {
//   const provider = useStarcoinProvider()
//   return useSWR(
//     amount_x && reverse_x && reverse_y ? [provider, 'quote', amount_x, reverse_x, reverse_y] : null,
//     async () =>
//       (await provider.call({
//         function_id: `${PREFIX}quote`,
//         type_args: [],
//         args: [`${amount_x!.toString()}u128`, `${reverse_x!.toString()}u128`, `${reverse_y!.toString()}u128`],
//       })) as [number]
//   )
// }

/**
 * 根据换入额度计算换出额度，固定千分之三手续费
 */
// export function useGetAmountOut(amount_in?: number | string, reverse_in?: number, reverse_out?: number) {
//   const provider = useStarcoinProvider()
//   return useSWR(
//     amount_in && reverse_in && reverse_out ? [provider, 'get_amount_out', amount_in, reverse_in, reverse_out] : null,
//     async () =>
//       (await provider.call({
//         function_id: `${PREFIX}get_amount_out`,
//         type_args: [],
//         args: [`${amount_in!.toString()}u128`, `${reverse_in!.toString()}u128`, `${reverse_out!.toString()}u128`],
//       })) as [number]
//   )
// }

/**
 * 根据换出额度计算换入额度，固定千分之三手续费
 */
// export function useGetAmountIn(amount_out?: number | string, reverse_in?: number, reverse_out?: number) {
//   const provider = useStarcoinProvider()
//   return useSWR(
//     amount_out && reverse_in && reverse_out ? [provider, 'get_amount_in', amount_out, reverse_in, reverse_out] : null,
//     async () =>
//       (await provider.call({
//         function_id: `${PREFIX}get_amount_in`,
//         type_args: [],
//         args: [`${amount_out!.toString()}u128`, `${reverse_in!.toString()}u128`, `${reverse_out!.toString()}u128`],
//       })) as [number]
//   )
// }
