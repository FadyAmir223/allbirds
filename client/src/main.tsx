import { Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'
import './assets/index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ErrorFallback from './components/error-fallback.component'
import Loading from './components/loading.component'
import App from './App'
import store, { persistor } from './store/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallback={<ErrorFallback />}>
    <Suspense fallback={<Loading />}>
      <HelmetProvider>
        <PersistGate loading={null} persistor={persistor}>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </Provider>
        </PersistGate>
      </HelmetProvider>
    </Suspense>
  </ErrorBoundary>,
)
