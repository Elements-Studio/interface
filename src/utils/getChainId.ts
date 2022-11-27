import { NETWORK_LABELS } from 'constants/chains'
import getAptosNetworkName from 'utils/getAptosNetworkName'

type chainIdType = string | number | null | undefined;

export default function getChainId(chainName: string | null | undefined): number {
  let chainId: chainIdType = 1;
  const networkName = getAptosNetworkName(chainName)
  Object.keys(NETWORK_LABELS).forEach((key: string) => {
    if (NETWORK_LABELS[key] === networkName) {
      chainId = key;
    }
  });

  return Number(chainId);
}