import { BigNumber } from '@ethersproject/bignumber'
import { Token, CurrencyAmount, Currency } from '@uniswap/sdk-core'
import { useTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useTotalLiquidity } from './useTokenSwapRouter'
import { Pair } from '@starcoin/starswap-v2-sdk'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Currency): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token?.isToken ? token.address : undefined, false)

  const totalSupply: BigNumber = useSingleCallResult(contract, 'totalSupply')?.result?.[0]

  return token?.isToken && totalSupply ? CurrencyAmount.fromRawAmount(token, totalSupply.toString()) : undefined
}

export function useTotalSupply2(pair?: Pair): CurrencyAmount<Token> | undefined {
  const { data: totalLiquidity } = useTotalLiquidity(pair?.token0.address, pair?.token1.address)
  return pair && totalLiquidity ? CurrencyAmount.fromRawAmount(pair.liquidityToken, totalLiquidity[0]) : undefined
}
