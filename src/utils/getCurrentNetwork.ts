export default function getCurrentNetwork(chainId: number | undefined) {

  let network;
  switch (chainId) {
    case 251:
      network = 'barnard';
      break;
    case 252:
      network = 'proxima';
      break;
    case 253:
      network = 'halley';
      break;
    default:
      network = 'main';
  }
  return network;
}
