import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';

import store from './store/store';
import { queryClient } from './lib/react-query';
import './assets/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallback={<div>error</div>}>
    <Suspense fallback={<div>loading...</div>}>
      <HelmetProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </Provider>
      </HelmetProvider>
    </Suspense>
  </ErrorBoundary>
);
