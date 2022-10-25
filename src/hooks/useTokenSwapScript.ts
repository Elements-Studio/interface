import { bcs, utils } from '@starcoin/starcoin'
import { arrayify, hexlify } from '@ethersproject/bytes'
import { Token } from '@starcoin/starswap-sdk-core'
import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from '@starcoin/starswap-v2-sdk'
import { useCallback } from 'react'
import { useStarcoinProvider } from './useStarcoinProvider'
import { TransactionPayloadVariantScriptFunction } from '@starcoin/starcoin/dist/src/lib/runtime/starcoin_types'
import { TxnBuilderTypes, BCS } from '@starcoin/aptos';
import { useTransactionExpirationSecs } from './useTransactionDeadline'
import BigNumber from 'bignumber.js'
import getNetworkType from '../utils/getNetworkType'

const networkType = getNetworkType()

console.log({ networkType })

const ADDRESS = networkType === 'APTOS' ? '0x0c3dbe4f07390f05b19ccfc083fc6aa5bc5d75621d131fc49557c8f4bbc11716' : V2_FACTORY_ADDRESS
const MODULE = 'TokenSwapScripts'
const PREFIX = `${ ADDRESS }::${ MODULE }::`

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
      const functionId = `${ PREFIX }register_swap_pair`
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
    async (x: string, y: string, midPath: Token[], amount_x_in: number | string, amount_y_out_min: number | string) => {
      let payloadHex: string
      if (networkType === 'APTOS') {
        let func
        let tyArgs
        if (midPath.length === 1) {
          // X -> R -> Y
          func = 'swap_exact_token_for_token_router2'
          tyArgs = [
            new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString(x)),
            new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString(midPath[0].address)),
            new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString(y))
          ]
        } else {
          // X -> Y
          func = 'swap_exact_token_for_token'
          tyArgs = [
            new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString(x)),
            new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString(y))
          ]
        }

        const args = [BCS.bcsSerializeU128(new BigNumber(amount_x_in).toNumber()), BCS.bcsSerializeU128(new BigNumber(amount_y_out_min).toNumber())]
        const entryFunctionPayload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
          TxnBuilderTypes.EntryFunction.natural(
            `${ ADDRESS }::${ MODULE }`,
            func,
            tyArgs,
            args,
          ),
        );
        payloadHex = hexlify(BCS.bcsToBytes(entryFunctionPayload))
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
        payloadHex = serializeScriptFunction(scriptFunction)
      }
      const transactionHash = await provider.getSigner(signer).sendUncheckedTransaction({
        data: payloadHex,
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
  console.log('useSwapTokenForExactToken')
  const provider = useStarcoinProvider()
  const expiredSecs = useTransactionExpirationSecs()
  return useCallback(
    async (x: string, y: string, midPath: Token[], amount_x_in_max: number | string, amount_y_out: number | string) => {
      console.log('useSwapTokenForExactToken', { networkType, x, y, midPath, amount_x_in_max, amount_y_out })
      let transactionHash: string
      if (networkType === 'APTOS') {
        transactionHash = ''
      } else {
        let functionId
        let tyArgs
        if (midPath.length === 1) {
          // X <- R <- Y
          functionId = `${ PREFIX }swap_token_for_exact_token_router2`
          tyArgs = utils.tx.encodeStructTypeTags([x, midPath[0].address, y])
        } else {
          // X <- Y
          functionId = `${ PREFIX }swap_token_for_exact_token`
          tyArgs = utils.tx.encodeStructTypeTags([x, y])
        }
        const args = [arrayify(serializeU128(amount_x_in_max)), arrayify(serializeU128(amount_y_out))]
        const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args)
        transactionHash = await provider.getSigner(signer).sendUncheckedTransaction({
          data: serializeScriptFunction(scriptFunction),
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
  return useCallback(
    async (
      x: string,
      y: string,
      amount_x_desired: number | string,
      amount_y_desired: number | string,
      amount_x_min: number | string,
      amount_y_min: number | string
    ) => {
      const functionId = `${ PREFIX }add_liquidity`
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
      const functionId = `${ PREFIX }remove_liquidity`
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
