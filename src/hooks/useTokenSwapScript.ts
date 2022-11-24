import { bcs, utils } from '@starcoin/starcoin'
import { arrayify, hexlify } from '@ethersproject/bytes'
import { Token } from '@starcoin/starswap-sdk-core'
import { useCallback } from 'react'
import { useStarcoinProvider } from './useStarcoinProvider'
import { TransactionPayloadVariantScriptFunction } from '@starcoin/starcoin/dist/src/lib/runtime/starcoin_types'
import { Types } from '@starcoin/aptos';
import { useTransactionExpirationSecs } from './useTransactionDeadline'
import BigNumber from 'bignumber.js'
import { useGetType, useGetV2FactoryAddress } from 'state/networktype/hooks'
import { useWallet } from '@starcoin/aptos-wallet-adapter'

const MODULE = 'TokenSwapScripts'

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
  const ADDRESS = useGetV2FactoryAddress()
  return useCallback(
    async (x: string, y: string) => {
      const functionId = `${ ADDRESS }::${ MODULE }::register_swap_pair`
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
  const ADDRESS = useGetV2FactoryAddress()
  const networkType = useGetType()
  const { signAndSubmitTransaction } = useWallet();
  return useCallback(
    async (x: string, y: string, midPath: Token[], amount_x_in: number | string, amount_y_out_min: number | string) => {
      let transactionHash: string
      if (networkType === 'APTOS') {
        let func
        let tyArgs
        if (midPath.length === 1) {
          // X -> R -> Y
          func = 'swap_exact_token_for_token_router2'
          tyArgs = [x, midPath[0].address, y]
        } else {
          // X -> Y
          func = 'swap_exact_token_for_token'
          tyArgs = [x, y]
        }
        const args = [new BigNumber(amount_x_in).toNumber(), new BigNumber(amount_y_out_min).toNumber()]
        const payload: Types.TransactionPayload = {
          type: 'entry_function_payload',
          function: `${ ADDRESS }::${ MODULE }::${ func }`,
          type_arguments: tyArgs,
          arguments: args
        };
        const transactionRes = await signAndSubmitTransaction(payload);
        transactionHash = transactionRes?.hash || ''
      } else {
        let func
        let tyArgs
        if (midPath.length === 1) {
          // X -> R -> Y
          func = 'swap_exact_token_for_token_router2'
          tyArgs = utils.tx.encodeStructTypeTags([x, midPath[0].address, y])
        } else {
          // X -> Y
          func = 'swap_exact_token_for_token'
          tyArgs = utils.tx.encodeStructTypeTags([x, y])
        }
        const functionId = `${ ADDRESS }::${ MODULE }::${ func }`
        const args = [arrayify(serializeU128(amount_x_in)), arrayify(serializeU128(amount_y_out_min))]
        const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args)
        const payloadHex = serializeScriptFunction(scriptFunction)
        transactionHash = await provider.getSigner(signer).sendUncheckedTransaction({
          data: payloadHex,
          expiredSecs,
        })
      }
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
  const ADDRESS = useGetV2FactoryAddress()
  const networkType = useGetType()
  const { signAndSubmitTransaction } = useWallet();

  return useCallback(
    async (x: string, y: string, midPath: Token[], amount_x_in_max: number | string, amount_y_out: number | string) => {
      let transactionHash: string
      if (networkType === 'APTOS') {
        let func
        let tyArgs
        if (midPath.length === 1) {
          // X <- R <- Y
          func = 'swap_token_for_exact_token_router2'
          tyArgs = [x, midPath[0].address, y]
        } else {
          // X <- Y
          func = 'swap_token_for_exact_token'
          tyArgs = [x, y]
        }

        const args = [new BigNumber(amount_x_in_max).toNumber(), new BigNumber(amount_y_out).toNumber()]
        const payload: Types.TransactionPayload = {
          type: 'entry_function_payload',
          function: `${ ADDRESS }::${ MODULE }::${ func }`,
          type_arguments: tyArgs,
          arguments: args
        };
        const transactionRes = await signAndSubmitTransaction(payload);
        transactionHash = transactionRes?.hash || ''
      } else {
        let functionId
        let tyArgs
        if (midPath.length === 1) {
          // X <- R <- Y
          functionId = `${ ADDRESS }::${ MODULE }::swap_token_for_exact_token_router2`
          tyArgs = utils.tx.encodeStructTypeTags([x, midPath[0].address, y])
        } else {
          // X <- Y
          functionId = `${ ADDRESS }::${ MODULE }::swap_token_for_exact_token`
          tyArgs = utils.tx.encodeStructTypeTags([x, y])
        }
        const args = [arrayify(serializeU128(amount_x_in_max)), arrayify(serializeU128(amount_y_out))]
        const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args)
        const payloadHex = serializeScriptFunction(scriptFunction)
        transactionHash = await provider.getSigner(signer).sendUncheckedTransaction({
          data: payloadHex,
          expiredSecs,
        })
      }

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
  const ADDRESS = useGetV2FactoryAddress()
  const networkType = useGetType()
  const { signAndSubmitTransaction } = useWallet();

  return useCallback(
    async (
      x: string,
      y: string,
      amount_x_desired: number | string,
      amount_y_desired: number | string,
      amount_x_min: number | string,
      amount_y_min: number | string
    ) => {
      let transactionHash: string
      if (networkType === 'APTOS') {
        const func = 'add_liquidity'
        const tyArgs = [x, y]
        const args = [
          new BigNumber(amount_x_desired).toNumber(),
          new BigNumber(amount_y_desired).toNumber(),
          new BigNumber(amount_x_min).toNumber(),
          new BigNumber(amount_y_min).toNumber(),
        ]
        const payload: Types.TransactionPayload = {
          type: 'entry_function_payload',
          function: `${ ADDRESS }::${ MODULE }::${ func }`,
          type_arguments: tyArgs,
          arguments: args
        };
        const transactionRes = await signAndSubmitTransaction(payload);
        transactionHash = transactionRes?.hash || ''
      } else {
        const functionId = `${ ADDRESS }::${ MODULE }::add_liquidity`
        const tyArgs = utils.tx.encodeStructTypeTags([x, y])
        const args = [
          arrayify(serializeU128(amount_x_desired)),
          arrayify(serializeU128(amount_y_desired)),
          arrayify(serializeU128(amount_x_min)),
          arrayify(serializeU128(amount_y_min)),
        ]
        const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args)
        const payloadHex = serializeScriptFunction(scriptFunction)
        transactionHash = await provider.getSigner(signer).sendUncheckedTransaction({
          data: payloadHex,
          expiredSecs,
        })
      }
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
  const ADDRESS = useGetV2FactoryAddress()
  const networkType = useGetType()
  const { signAndSubmitTransaction } = useWallet();

  return useCallback(
    async (
      x: string,
      y: string,
      liquidity: number | string,
      amount_x_min: number | string,
      amount_y_min: number | string
    ) => {
      let transactionHash: string
      if (networkType === 'APTOS') {
        const func = 'remove_liquidity'
        const tyArgs = [x, y]
        const args = [
          new BigNumber(liquidity).toNumber(),
          new BigNumber(amount_x_min).toNumber(),
          new BigNumber(amount_y_min).toNumber(),
        ]
        const payload: Types.TransactionPayload = {
          type: 'entry_function_payload',
          function: `${ ADDRESS }::${ MODULE }::${ func }`,
          type_arguments: tyArgs,
          arguments: args
        };
        const transactionRes = await signAndSubmitTransaction(payload);
        transactionHash = transactionRes?.hash || ''
      } else {
        const functionId = `${ ADDRESS }::${ MODULE }::remove_liquidity`
        const tyArgs = utils.tx.encodeStructTypeTags([x, y])
        const args = [
          arrayify(serializeU128(liquidity)),
          arrayify(serializeU128(amount_x_min)),
          arrayify(serializeU128(amount_y_min)),
        ]
        const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args)
        const payloadHex = serializeScriptFunction(scriptFunction)
        transactionHash = await provider.getSigner(signer).sendUncheckedTransaction({
          data: payloadHex,
          expiredSecs,
        })
      }
      return transactionHash
    },
    [provider, signer, expiredSecs]
  )
}
