import JSBI from 'jsbi'
import { Currency, CurrencyAmount, Fraction, Percent, TradeType } from '@uniswap/sdk-core'
import { Trade as V2Trade } from '@starcoin/starswap-v2-sdk'
import { Trade as V3Trade } from '@uniswap/v3-sdk'
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
} from '../constants/misc'

const THIRTY_BIPS_FEE = new Percent(JSBI.BigInt(25), JSBI.BigInt(10000))
const ONE_HUNDRED_PERCENT = new Percent(JSBI.BigInt(10000), JSBI.BigInt(10000))
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(THIRTY_BIPS_FEE)

// computes realized lp fee as a percent
export function computeRealizedLPFeePercent(
  trade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType>
): Percent {
  let percent: Percent
  if (trade instanceof V2Trade) {
    // for each hop in our trade, take away the x*y=k price impact from 0.25% fees
    // e.g. for 3 tokens/2 hops: 1 - ((1 - 0.0025) * (1-0.0025))
    percent = ONE_HUNDRED_PERCENT.subtract(
      trade.route.pairs.reduce<Percent>(
        (currentFee: Percent): Percent => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
        ONE_HUNDRED_PERCENT
      )
    )
  } else {
    percent = ONE_HUNDRED_PERCENT.subtract(
      trade.route.pools.reduce<Percent>(
        (currentFee: Percent, pool): Percent =>
          currentFee.multiply(ONE_HUNDRED_PERCENT.subtract(new Fraction(pool.fee, 1_000_000))),
        ONE_HUNDRED_PERCENT
      )
    )
  }

  return new Percent(percent.numerator, percent.denominator)
}

export function computeRealizedLPFeePercentDynamic(
  trade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType>,
  liquidityPools: any
): Percent {
  let percent: Percent
  if (trade instanceof V2Trade) {
    percent = ONE_HUNDRED_PERCENT.subtract(
      trade.route.pairs.reduce<Percent>(
        (currentFee: Percent, pair): Percent => {
          // calculate feePercent dynamatically, instead of fixed 0.25%
          const liquidityPoolMatch = liquidityPools.filter((lp: any) =>
            lp.liquidityPoolId.liquidityTokenId.tokenXId === pair.token0.symbol && lp.liquidityPoolId.liquidityTokenId.tokenYId === pair.token1.symbol ||
            lp.liquidityPoolId.liquidityTokenId.tokenXId === pair.token1.symbol && lp.liquidityPoolId.liquidityTokenId.tokenYId === pair.token0.symbol
          )
          const { poundageRate: poundageRateOrigin, swapFeeOperationRateV2: swapFeeOperationRateV2Origin } = liquidityPoolMatch[0]
          const poundageRate = !poundageRateOrigin || poundageRateOrigin.denominator === 0 ? { numerator: 3, denominator: 1000 } : poundageRateOrigin
          const swapFeeOperationRateV2 = !swapFeeOperationRateV2Origin || swapFeeOperationRateV2Origin.denominator === 0 ? { numerator: 1, denominator: 6 } : swapFeeOperationRateV2Origin
          // 3/1000 * (1-1/6)= 0.0025
          const feePercent = new Percent(JSBI.BigInt(poundageRate.numerator), JSBI.BigInt(poundageRate.denominator)).multiply(ONE_HUNDRED_PERCENT.subtract(new Percent(JSBI.BigInt(swapFeeOperationRateV2.numerator), JSBI.BigInt(swapFeeOperationRateV2.denominator))))
          const inputFractionAfterFee = ONE_HUNDRED_PERCENT.subtract(feePercent)
          return currentFee.multiply(inputFractionAfterFee)
        },
        ONE_HUNDRED_PERCENT
      )
    )
  } else {
    percent = ONE_HUNDRED_PERCENT.subtract(
      trade.route.pools.reduce<Percent>(
        (currentFee: Percent, pool): Percent =>
          currentFee.multiply(ONE_HUNDRED_PERCENT.subtract(new Fraction(pool.fee, 1_000_000))),
        ONE_HUNDRED_PERCENT
      )
    )
  }

  return new Percent(percent.numerator, percent.denominator)
}

// computes price breakdown for the trade
export function computeRealizedLPFeeAmount(
  trade?: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | null
): CurrencyAmount<Currency> | undefined {
  if (trade) {
    const realizedLPFee = computeRealizedLPFeePercent(trade)

    // the amount of the input that accrues to LPs
    return CurrencyAmount.fromRawAmount(trade.inputAmount.currency, trade.inputAmount.multiply(realizedLPFee).quotient)
  }

  return undefined
}

const IMPACT_TIERS = [
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  ALLOWED_PRICE_IMPACT_LOW,
]

type WarningSeverity = 0 | 1 | 2 | 3 | 4
export function warningSeverity(priceImpact: Percent | undefined): WarningSeverity {
  if (!priceImpact) return 4
  let impact: WarningSeverity = IMPACT_TIERS.length as WarningSeverity
  for (const impactLevel of IMPACT_TIERS) {
    if (impactLevel.lessThan(priceImpact)) return impact
    impact--
  }
  return 0
}
