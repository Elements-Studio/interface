import 'inter-ui'
import '@reach/dialog/styles.css'
import { createWeb3ReactRoot, Web3ReactProvider } from '@starcoin/starswap-web3-core'
import { StrictMode } from 'react'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import Blocklist from './components/Blocklist'
import { NetworkContextName } from './constants/misc'
import { LanguageProvider } from './i18n'
import App from './pages/App'
import store from './state'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { ThemedGlobalStyle } from './theme'
import RadialGradientByChainUpdater from './theme/RadialGradientByChainUpdater'
import getLibrary from './utils/getLibrary'
import {
  WalletProvider,
  StarMaskWalletAdapter,
  HippoExtensionWalletAdapter,
  MartianWalletAdapter,
  AptosWalletAdapter,
  FewchaWalletAdapter,
  PontemWalletAdapter,
  SpikaWalletAdapter,
  // FletchWalletAdapter,
  AptosSnapAdapter,
  NightlyWalletAdapter,
  BitkeepWalletAdapter,
  TokenPocketWalletAdapter,
  BloctoWalletAdapter,
  WalletAdapterNetwork,
  Coin98WalletAdapter,
  FoxWalletAdapter
} from '@starcoin/aptos-wallet-adapter';
import { AptosWalletProvider } from 'contexts/AptosWalletProvider';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)
const wallets = [
  new StarMaskWalletAdapter(),
  new HippoExtensionWalletAdapter(),
  new MartianWalletAdapter(),
  new AptosWalletAdapter(),
  new FewchaWalletAdapter(),
  new PontemWalletAdapter(),
  new SpikaWalletAdapter(),
  // new FletchWalletAdapter(),
  new AptosSnapAdapter(),
  new NightlyWalletAdapter(),
  new BitkeepWalletAdapter(),
  new TokenPocketWalletAdapter(),
  new BloctoWalletAdapter({ network: WalletAdapterNetwork.Mainnet, bloctoAppId:'6d85f56e-5f2e-46cd-b5f2-5cf9695b4d46' }),
  new Coin98WalletAdapter(),
  new FoxWalletAdapter()
];

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
    gaOptions: {
      storage: 'none',
      storeGac: false,
    },
  })
  ReactGA.set({
    anonymizeIp: true,
    customBrowserType: !isMobile
      ? 'desktop'
      : 'web3' in window || 'starcoin' in window
      ? 'mobileWeb3'
      : 'mobileRegular',
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

function Updaters() {
  return (
    <>
      <RadialGradientByChainUpdater />
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <LanguageProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
            <WalletProvider
              wallets={wallets}
              autoConnect
              onError={(error: Error) => {
                console.log('Handle Error Message', error);
              }}>
              <AptosWalletProvider>
                <Blocklist>
                  <Updaters />
                  <ThemeProvider>
                    <ThemedGlobalStyle />
                    <App />
                  </ThemeProvider>
                </Blocklist>
              </AptosWalletProvider>
            </WalletProvider>
            </Web3ProviderNetwork>
          </Web3ReactProvider>
        </LanguageProvider>
      </HashRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)

serviceWorkerRegistration.unregister()
