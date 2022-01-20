import { Currency, Token } from '@uniswap/sdk-core'
import flatMap from 'lodash.flatmap'
import { useMemo } from 'react'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from '../constants/routing'
import { useActiveWeb3React } from './web3'

const _uniqueArrayByKey = (oriArray: any[], key: string) => {
  const hash: any = {};
  const newArray = oriArray.reduce((item, next) => {
    if (!hash[next[key]]) {
      (hash[next[key]] = true && item.push(next));
    }
    return item;
  }, []);
  return newArray;
}

export function useAllCurrencyCombinations(currencyA?: Currency, currencyB?: Currency): [Token, Token][] {
  const { chainId } = useActiveWeb3React()

  const [tokenA, tokenB] = chainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined]
  const basesAll: Token[] = useMemo(() => {
    if (!chainId) return []

    const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []
    const adddressTokenA = tokenA?.address || ''
    const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[adddressTokenA] ?? [] : []
    const adddressTokenB = tokenB?.address || ''
    const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[adddressTokenB] ?? [] : []

    return [...common, ...additionalA, ...additionalB]
  }, [chainId, tokenA, tokenB])
  const basesDirect = basesAll.filter((token) => {
    return token.address === tokenA?.address || token.address === tokenB?.address
  })
  const bases = _uniqueArrayByKey(basesDirect, 'address')
  const basePairs: [Token, Token][] = useMemo(
    () => flatMap(bases, (base): [Token, Token][] => bases.map((otherBase: Token) => {
      return base.address === tokenA?.address && otherBase.address === tokenB?.address && [base, otherBase]
    })).filter(item => item),
    [bases]
  )
  return useMemo(
    () =>
      tokenA && tokenB
        ? [
          // the direct pair
          [tokenA, tokenB],
          // token A against all bases
          ...bases.map((base: Token): [Token, Token] => [tokenA, base]),
          // token B against all bases
          ...bases.map((base: Token): [Token, Token] => [tokenB, base]),
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
