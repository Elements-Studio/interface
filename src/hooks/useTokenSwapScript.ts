import { bcs, utils } from '@starcoin/starcoin'
import { arrayify, hexlify } from '@ethersproject/bytes'
import { useCallback } from 'react'
import { useStarcoinProvider } from './useStarcoinProvider'
import { TransactionPayloadVariantScriptFunction } from '@starcoin/starcoin/dist/src/lib/runtime/starcoin_types'
import { useTransactionExpirationSecs } from './useTransactionDeadline'

// const PREFIX = '0xbd7e8be8fae9f60f2f5136433e36a091::TokenSwapScripts::'
// const PREFIX = '0x3db7a2da7444995338a2413b151ee437::TokenSwapScripts::'
const PREFIX = '0x4783d08fb16990bd35d83f3e23bf93b8::TokenSwapScripts::'

function serializeU128(value: string | number): string {
  const se = new bcs.BcsSerializer()
  se.serializeU128(BigInt(value))
  return hexlify(se.getBytes())
}

function serializeScriptFunction(scriptFunction: TransactionPayloadVariantScriptFunction) {
  const se = new bcs.BcsSerializer()
  scriptFunction.serialize(se)
  return hexlify(se.getBytes())
}

export function useRegisterSwapPair(signer?: string) {
  const provider = useStarcoinProvider()
  return useCallback(
    async (x: string, y: string) => {
      const functionId = `${PREFIX}register_swap_pair`
      const tyArgs = utils.tx.encodeStructTypeTags([x, y])
      const args: Uint8Array[] = []
      const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args)
      const transactionHash = await provider.getSigner(signer).sendUncheckedTransaction({
        data: serializeScriptFunction(scriptFunction),
      })
      return transactionHash
    },
    [provider, signer]
  )
}

/**
 * 通过指定换入的代币额度来置换代币
 */
export function useSwapExactTokenForToken(signer?: string) {
  const provider = useStarcoinProvider()
  const expiredSecs = useTransactionExpirationSecs()
  return useCallback(
    async (x: string, y: string, amount_x_in: number | string, amount_y_out_min: number | string) => {
      const functionId = `${PREFIX}swap_exact_token_for_token`
      const tyArgs = utils.tx.encodeStructTypeTags([x, y])
      const args = [arrayify(serializeU128(amount_x_in)), arrayify(serializeU128(amount_y_out_min))]
      const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args)
      const transactionHash = await provider.getSigner(signer).sendUncheckedTransaction({
        data: serializeScriptFunction(scriptFunction),
        expiredSecs,
      })
      return transactionHash
    },
    [provider, signer, expiredSecs]
  )
}

/**
 * 通过指定换出的代币额度来置换代币
 */
export function useSwapTokenForExactToken(signer?: string) {
  const provider = useStarcoinProvider()
  const expiredSecs = useTransactionExpirationSecs()
  return useCallback(
    async (x: string, y: string, amount_x_in_max: number | string, amount_y_out: number | string) => {
      const functionId = `${PREFIX}swap_token_for_exact_token`
      const tyArgs = utils.tx.encodeStructTypeTags([x, y])
      const args = [arrayify(serializeU128(amount_x_in_max)), arrayify(serializeU128(amount_y_out))]
      const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args)
      const transactionHash = await provider.getSigner(signer).sendUncheckedTransaction({
        data: serializeScriptFunction(scriptFunction),
        expiredSecs,
      })
      return transactionHash
    },
    [provider, signer, expiredSecs]
  )
}

/**
 * 添加流动性，需要在调用 register_swap_pair 之后才可调用
 */
export function useAddLiquidity(signer?: string) {
  const provider = useStarcoinProvider()
  const expiredSecs = useTransactionExpirationSecs()
  return useCallback(
    async (
      x: string,
      y: string,
      amount_x_desired: number | string,
      amount_y_desired: number | string,
      amount_x_min: number | string,
      amount_y_min: number | string
    ) => {
      const functionId = `${PREFIX}add_liquidity`
      const tyArgs = utils.tx.encodeStructTypeTags([x, y])
      const args = [
        arrayify(serializeU128(amount_x_desired)),
        arrayify(serializeU128(amount_y_desired)),
        arrayify(serializeU128(amount_x_min)),
        arrayify(serializeU128(amount_y_min)),
      ]
      const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args)
      const transactionHash = await provider.getSigner(signer).sendUncheckedTransaction({
        data: serializeScriptFunction(scriptFunction),
        expiredSecs,
      })
      return transactionHash
    },
    [provider, signer, expiredSecs]
  )
}

/**
 * 移除流动性，需要在调用 register_swap_pair 之后才可调用
 */
export function useRemoveLiquidity(signer?: string) {
  const provider = useStarcoinProvider()
  const expiredSecs = useTransactionExpirationSecs()
  return useCallback(
    async (
      x: string,
      y: string,
      liquidity: number | string,
      amount_x_min: number | string,
      amount_y_min: number | string
    ) => {
      const functionId = `${PREFIX}remove_liquidity`
      const tyArgs = utils.tx.encodeStructTypeTags([x, y])
      const args = [
        arrayify(serializeU128(liquidity)),
        arrayify(serializeU128(amount_x_min)),
        arrayify(serializeU128(amount_y_min)),
      ]
      const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args)
      const transactionHash = await provider.getSigner(signer).sendUncheckedTransaction({
        data: serializeScriptFunction(scriptFunction),
        expiredSecs,
      })
      return transactionHash
    },
    [provider, signer, expiredSecs]
  )
}
