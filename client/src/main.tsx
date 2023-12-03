import { Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import ErrorFallback from './components/error-fallback.component'
import Loading from './components/loading.component'
import { queryClient } from './lib/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App'
import store, { persistor } from './store/store'

import './assets/index.css'

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
)
