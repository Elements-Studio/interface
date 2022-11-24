import { NETWORK_LABELS } from 'constants/chains'

type chainIdType = string | number | null | undefined;

export default function getChainId(chainName: string | null | undefined): number {
    let chainId: chainIdType = 1;

    Object.keys(NETWORK_LABELS).forEach((key: string) => {
      if (NETWORK_LABELS[key] === chainName?.toLocaleLowerCase()) {
        chainId = key;
      }
    });
  
    return Number(chainId);
}