export default function getAptosNetworkName(name: string | null | undefined): string {
  let networkName = name || ''
  if (networkName.split(' ').length > 1) {
    // Pontem: Aptos testnet
    networkName = networkName.split(' ')[1]
  }
  return networkName.toLowerCase()
}