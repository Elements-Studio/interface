import { Currency, Token, CurrencyAmount, Star, Apt } from '@starcoin/starswap-sdk-core'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { UNI } from '../../constants/tokens'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllTokens } from '../../hooks/Tokens'
// import { useMulticall2Contract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { useGetType } from 'state/networktype/hooks'
import { useUserUnclaimedAmount } from '../claim/hooks'
// import { useMultipleContractSingleData, useSingleContractMultipleData } from '../multicall/hooks'
import { useTotalUniEarned } from '../stake/hooks'
// import { Interface } from '@ethersproject/abi'
// import ERC20ABI from 'abis/erc20.json'
// import { Erc20Interface } from 'abis/types/Erc20'
import { useStarcoinProvider } from 'hooks/useStarcoinProvider'
import { useAptosProvider } from 'hooks/useAptosProvider'
import useSWR from 'swr'
import { useWallet } from '@starcoin/aptos-wallet-adapter'
import getChainId from 'utils/getChainId';
import { MaybeHexString } from '@starcoin/aptos';

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useSTCBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount<Currency> | undefined
} {
  const { network: aptosNetwork } = useWallet();
  const chainId = getChainId(aptosNetwork?.name);
  // const multicallContract = useMulticall2Contract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
          .map(isAddress)
          .filter((a): a is string => a !== false)
          .sort()
        : [],
    [uncheckedAddresses]
  )

  // const results = useSingleContractMultipleData(
  //   multicallContract,
  //   'getEthBalance',
  //   addresses.map((address) => [address])
  // )

  const networkType = useGetType()
  const provider = useStarcoinProvider()

  const { data: results } = useSWR(addresses.length ? [provider, 'getBalance', ...addresses] : null, () =>
    Promise.all(addresses.map((address) => {
      if (networkType === 'APTOS') {
        return new Promise(async (resolve, reject) => {
          try {
            const response = await provider!.send('getAccountResource', [address, '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'])
            resolve(response.data.coin.value)
          } catch (error) {
            reject(error)
          }
        })
      } else {
        return provider!.getBalance(address)
      }
    }))
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount<Currency> }>((memo, address, i) => {
        const value = results?.[i]
        if (value && chainId) {
          if (networkType === 'APTOS') {
            memo[address] = CurrencyAmount.fromRawAmount(Apt.onChain(chainId), JSBI.BigInt((value as number).toString()))
          } else {
            memo[address] = CurrencyAmount.fromRawAmount(Star.onChain(chainId), JSBI.BigInt((value as number).toString()))
          }
        }
        return memo
      }, {}),
    [addresses, chainId, results]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  // const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])
  // const ERC20Interface = new Interface(ERC20ABI) as Erc20Interface
  // const balances = useMultipleContractSingleData(
  //   validatedTokenAddresses,
  //   ERC20Interface,
  //   'balanceOf',
  //   [address],
  //   undefined,
  //   100_000
  // )
  const networkType = useGetType()
  const provider = useStarcoinProvider()
  const client = useAptosProvider()
  const { data: balances, isValidating } = useSWR(
    address && validatedTokens.length
      ? [networkType, 'getBalance', address, ...validatedTokens.map((token) => token.address)]
      : null,
    () => Promise.all(validatedTokens.map((token) => {
      if (networkType === 'APTOS') {
        return new Promise(async (resolve, reject) => {
          try {
            const response = await client.getAccountResource(address as MaybeHexString, `0x1::coin::CoinStore<${ token.address }>`);
            resolve(((response.data) as any).coin.value)
          } catch (error: any) {
            resolve('0')
          }
        })
      } else {
        return provider.getBalance(address!.toLowerCase(), token.address)
      }
    }))
  )
  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, token, i) => {
            const value = balances?.[i]
            console.log({ value })
            const amount = value ? JSBI.BigInt((value as number).toString()) : undefined
            console.log({ amount })
            if (amount) {
              memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
            }
            return memo
          }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    isValidating,
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken ?? false) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies])
  const ethBalance = useSTCBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined
        if (currency.isToken) return tokenBalances[currency.address]
        if (currency.isNative) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  const { account: aptosAccount } = useWallet();
  const account: any = aptosAccount?.address || '';
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}

// get the total owned, unclaimed, and unharvested UNI for account
export function useAggregateUniBalance(): CurrencyAmount<Token> | undefined {
  const { account: aptosAccount, network: aptosNetwork } = useWallet();
  const chainId = getChainId(aptosNetwork?.name);
  const account: any = aptosAccount?.address || '';

  const uni = chainId ? UNI[chainId] : undefined

  const uniBalance: CurrencyAmount<Token> | undefined = useTokenBalance(account ?? undefined, uni)
  const uniUnclaimed: CurrencyAmount<Token> | undefined = useUserUnclaimedAmount(account)
  const uniUnHarvested: CurrencyAmount<Token> | undefined = useTotalUniEarned()

  if (!uni) return undefined

  return CurrencyAmount.fromRawAmount(
    uni,
    JSBI.add(
      JSBI.add(uniBalance?.quotient ?? JSBI.BigInt(0), uniUnclaimed?.quotient ?? JSBI.BigInt(0)),
      uniUnHarvested?.quotient ?? JSBI.BigInt(0)
    )
  )
}
