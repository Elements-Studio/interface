import { Currency, Token } from '@uniswap/sdk-core'
import flatMap from 'lodash.flatmap'
import { useMemo } from 'react'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from '../constants/routing'
import { useActiveWeb3React } from './web3'
import { STC, STAR, XUSDT, FAI, WEN, SHARE } from '../constants/tokens'
import { WrappedTokenInfo } from '../state/lists/wrappedTokenInfo'

export function useAllCurrencyCombinations(currencyA?: Currency, currencyB?: Currency): [Token, Token][] {
  const { chainId } = useActiveWeb3React()

  const [tokenA, tokenB] = chainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined]

  const bases: Token[] = useMemo(() => {
    if (!chainId) return []

    const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []
    const adddressTokenA = tokenA ? (tokenA instanceof WrappedTokenInfo ? tokenA?.tokenInfo.address : tokenA.address) : ''
    const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[adddressTokenA] ?? [] : []
    const adddressTokenB = tokenB ? (tokenB instanceof WrappedTokenInfo ? tokenB?.tokenInfo.address : tokenB.address) : ''
    const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[adddressTokenB] ?? [] : []
    if (tokenB?.address === STAR[chainId].address) {
      return [STC[chainId], STAR[chainId]]
    }
    if (tokenB?.address === FAI[chainId].address) {
      return [STC[chainId], FAI[chainId]]
    }
    if (tokenB?.address === XUSDT[chainId].address) {
      return [STC[chainId], XUSDT[chainId]]
    }
    if (tokenB?.address === WEN[chainId].address) {
      return [STC[chainId], WEN[chainId]]
    }
    if (tokenB?.address === SHARE[chainId].address) {
      return [STC[chainId], SHARE[chainId]]
    }
    if (tokenB?.address === STC[chainId].address) {
      return [STC[chainId]]
    }
    return [...common, ...additionalA, ...additionalB]
  }, [chainId, tokenA, tokenB])

  const basePairs: [Token, Token][] = useMemo(
    () => flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase])),
    [bases]
  )
  return useMemo(
    () =>
      tokenA && tokenB
        ? [
          // the direct pair
          [tokenA, tokenB],
          // token A against all bases
          ...bases.map((base): [Token, Token] => [tokenA, base]),
          // token B against all bases
          ...bases.map((base): [Token, Token] => [tokenB, base]),
          // each base against all bases
          ...basePairs,
        ]
          .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
          .filter(([t0, t1]) => t0.address !== t1.address)
          .filter(([tokenA, tokenB]) => {
            if (!chainId) return true
            const customBases = CUSTOM_BASES[chainId]

            const customBasesA: Token[] | undefined = customBases?.[tokenA.address]
            const customBasesB: Token[] | undefined = customBases?.[tokenB.address]

            if (!customBasesA && !customBasesB) return true

            if (customBasesA && !customBasesA.find((base) => tokenB.equals(base))) return false
            if (customBasesB && !customBasesB.find((base) => tokenA.equals(base))) return false

            return true
          })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId]
  )
}
