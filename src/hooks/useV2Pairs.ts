import { computePairAddress, Pair } from '@starcoin/starswap-v2-sdk'
import { useMemo } from 'react'
// import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { V2_FACTORY_ADDRESSES } from '../constants/addresses'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { useGetType } from 'state/networktype/hooks'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useBatchGetReserves } from './useTokenSwapRouter'

// const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

function _unique(matrix: any) {
  let res: any[] = [];
  matrix.map((item: any) => {
    item && res.push(item.sort((a: any, b: any) => a.localeCompare(b)).toString());
  })
  return [...new Set(res)].map(item => item.split(','));
}

export function useV2Pairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const tokens = useMemo(
    () => currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
    [currencies]
  )

  const pairAddresses = useMemo<([string, string] | undefined)[]>(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          V2_FACTORY_ADDRESSES[tokenA.chainId]
          ? // ? computePairAddress({ factoryAddress: V2_FACTORY_ADDRESSES[tokenA.chainId], tokenA, tokenB })
          [tokenA.address, tokenB.address]
          : undefined
      }),
    [tokens]
  )

  const pairAddressesUnique = _unique(pairAddresses)
  // const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const { data: results, isValidating } = useBatchGetReserves(pairAddresses)
  const networkType = useGetType()
  return useMemo(() => {
    return (
      results?.map((result: any, i: number) => {
        // const { result: reserves, loading } = result
        const reserves = result
        const tokenA = tokens[i][0]
        const tokenB = tokens[i][1]

        // if (loading) return [PairState.LOADING, null]
        if (isValidating) return [PairState.LOADING, null]
        if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
        if (!reserves) return [PairState.NOT_EXISTS, null]
        // const { reserve0, reserve1 } = reserves
        const [reserve0, reserve1] = reserves
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
        return [
          PairState.EXISTS,
          new Pair(
            CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
            CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
            networkType
          ),
        ]
      }) || [[PairState.NOT_EXISTS, null]]
    )
    // }, [results, tokens])
  }, [results, tokens, isValidating, networkType])
}

export function useV2Pair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return useV2Pairs(inputs)[0]
}
