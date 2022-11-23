import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import ErrorBoundary from 'components/ErrorBoundary';
import reducer from 'modules/rootReducer';
import { AptosWalletProvider } from 'contexts/AptosWalletProvider';
import {
  WalletProvider,
  AptosWalletAdapter,
  MartianWalletAdapter,
  PontemWalletAdapter,
  StarMaskWalletAdapter
} from '@starcoin/aptos-wallet-adapter';
import { useMemo } from 'react';
import { openErrorNotification } from 'utils/notifications';

const isDevelopmentMode = process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer,
  devTools: isDevelopmentMode,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: {
        ignoredPaths: ['connection']
      }
    }).concat(isDevelopmentMode ? [logger] : [])
});

type TProps = {
  children: any;
};

const Providers: React.FC<TProps> = (props: TProps) => {
  const wallets = useMemo(
    () => [
      new MartianWalletAdapter(),
      new AptosWalletAdapter(),
      new PontemWalletAdapter(),
      new StarMaskWalletAdapter(),
    ],
    []
  );

  return (
    <ErrorBoundary>
      <WalletProvider
        wallets={wallets}
        autoConnect={true}
        onError={(error: Error) => {
          let text = 'Unknow error';
          if (error.name === 'WalletNotReadyError') {
            text = 'Wallet not ready';
          }
          openErrorNotification({ detail: error.message || text, title: 'Wallet Error' });
        }}>
        <AptosWalletProvider>
          <ReduxProvider store={store}>
            {props.children}
          </ReduxProvider>
        </AptosWalletProvider>
      </WalletProvider>
    </ErrorBoundary>
  );
};

export default Providers;
