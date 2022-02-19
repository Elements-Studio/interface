/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@starcoin/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface NFTDescriptorInterface extends ethers.utils.Interface {
  functions: {
    "constructTokenURI(tuple)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "constructTokenURI",
    values: [
      {
        tokenId: BigNumberish;
        quoteTokenAddress: string;
        baseTokenAddress: string;
        quoteTokenSymbol: string;
        baseTokenSymbol: string;
        quoteTokenDecimals: BigNumberish;
        baseTokenDecimals: BigNumberish;
        flipRatio: boolean;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        tickCurrent: BigNumberish;
        tickSpacing: BigNumberish;
        fee: BigNumberish;
        poolAddress: string;
      }
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "constructTokenURI",
    data: BytesLike
  ): Result;

  events: {};
}

export class NFTDescriptor extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: NFTDescriptorInterface;

  functions: {
    constructTokenURI(
      params: {
        tokenId: BigNumberish;
        quoteTokenAddress: string;
        baseTokenAddress: string;
        quoteTokenSymbol: string;
        baseTokenSymbol: string;
        quoteTokenDecimals: BigNumberish;
        baseTokenDecimals: BigNumberish;
        flipRatio: boolean;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        tickCurrent: BigNumberish;
        tickSpacing: BigNumberish;
        fee: BigNumberish;
        poolAddress: string;
      },
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  constructTokenURI(
    params: {
      tokenId: BigNumberish;
      quoteTokenAddress: string;
      baseTokenAddress: string;
      quoteTokenSymbol: string;
      baseTokenSymbol: string;
      quoteTokenDecimals: BigNumberish;
      baseTokenDecimals: BigNumberish;
      flipRatio: boolean;
      tickLower: BigNumberish;
      tickUpper: BigNumberish;
      tickCurrent: BigNumberish;
      tickSpacing: BigNumberish;
      fee: BigNumberish;
      poolAddress: string;
    },
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    constructTokenURI(
      params: {
        tokenId: BigNumberish;
        quoteTokenAddress: string;
        baseTokenAddress: string;
        quoteTokenSymbol: string;
        baseTokenSymbol: string;
        quoteTokenDecimals: BigNumberish;
        baseTokenDecimals: BigNumberish;
        flipRatio: boolean;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        tickCurrent: BigNumberish;
        tickSpacing: BigNumberish;
        fee: BigNumberish;
        poolAddress: string;
      },
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    constructTokenURI(
      params: {
        tokenId: BigNumberish;
        quoteTokenAddress: string;
        baseTokenAddress: string;
        quoteTokenSymbol: string;
        baseTokenSymbol: string;
        quoteTokenDecimals: BigNumberish;
        baseTokenDecimals: BigNumberish;
        flipRatio: boolean;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        tickCurrent: BigNumberish;
        tickSpacing: BigNumberish;
        fee: BigNumberish;
        poolAddress: string;
      },
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    constructTokenURI(
      params: {
        tokenId: BigNumberish;
        quoteTokenAddress: string;
        baseTokenAddress: string;
        quoteTokenSymbol: string;
        baseTokenSymbol: string;
        quoteTokenDecimals: BigNumberish;
        baseTokenDecimals: BigNumberish;
        flipRatio: boolean;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        tickCurrent: BigNumberish;
        tickSpacing: BigNumberish;
        fee: BigNumberish;
        poolAddress: string;
      },
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
