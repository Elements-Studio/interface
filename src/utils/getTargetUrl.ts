import { stringify, ParsedQs } from 'qs'

export default function getTargetUrl(qs: ParsedQs, targetChain = 'STARCOIN'): string {
  let targetUrl = ''
  const hostname = window.location.hostname
  const subDomains = hostname.split('.')
  if (subDomains.length === 3) {
    // https://app.starswap.xyz
    // https://aptos.starswap.xyz
    if (subDomains[0] === 'app') {
      targetUrl = `${ window.location.origin.replace('app', 'aptos') }/#/swap`
    } else if (subDomains[0] === 'aptos') {
      targetUrl = `${ window.location.origin.replace('aptos', 'app') }/#/swap`
    }
  } else {
    // http://127.0.0.1/#/swap?chain=STARCOIN
    // http://127.0.0.1/#/swap?chain=APTOS
    const search = stringify({ ...qs, chain: targetChain })
    targetUrl = `${ window.location.origin }/#/swap?${ search }`
  }
  return targetUrl
}
