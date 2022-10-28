import STCBlueLogo from 'assets/svg/stc.svg'
import APTLogo from 'assets/svg/apt.svg'

const NETWORK_INFO: any = {
    STARCOIN: {
        networkType: 'STARCOIN',
        docs: 'https://docs.uniswap.org/',
        explorer: 'https://etherscan.io/',
        infoLink: 'https://info.uniswap.org/#/',
        label: 'STARCOIN',
        logoUrl: STCBlueLogo,
        nativeCurrency: { name: 'StarCoin', symbol: 'STC', decimals: 18 },
        color: '#f00',
    },
    APTOS: {
        networkType: 'APTOS',
        docs: 'https://docs.uniswap.org/',
        explorer: 'https://rinkeby.etherscan.io/',
        infoLink: 'https://info.uniswap.org/#/',
        label: 'APTOS',
        logoUrl: APTLogo,
        nativeCurrency: { name: 'Aptos', symbol: 'APT', decimals: 18 },
        color: '#f00',
    },
}

export function getNetworkInfo(networkType: any): any {
    if (networkType) {
        return NETWORK_INFO[networkType] ?? undefined
    }

    return undefined
}