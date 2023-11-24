import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import Loading from './components/loading.component';
import ErrorFallback from './components/error-fallback.component';
import store, { persistor } from './store/store';
import { queryClient } from './lib/react-query';
import './assets/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallback={<ErrorFallback />}>
    <Suspense fallback={<Loading />}>
      <HelmetProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </HelmetProvider>
    </Suspense>
  </ErrorBoundary>,
);
