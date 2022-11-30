import useParsedQueryString from 'hooks/useParsedQueryString'

export default function useGetTargetChain(): string {
  const qs = useParsedQueryString()
  const hostname = window.location.hostname
  let targetChain = qs.chain as string

  // http://127.0.0.1/#/swap?chain=STARCOIN
  // http://127.0.0.1/#/swap?chain=APTOS
  if (targetChain && ['APTOS', 'STARCOIN'].includes(targetChain)) {
    return targetChain
  }

  // https://app.starswap.xyz
  // https://aptos.starswap.xyz
  // https://test.starswap.xyz
  const subDomains = hostname.split('.')
  if (subDomains.length === 3) {
    if (subDomains[0] === 'app') {
      return 'STARCOIN'
    } else if (['aptos', 'test'].includes(subDomains[0])) {
      return 'APTOS'
    }
  }
  return 'STARCOIN'
}
