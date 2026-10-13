import { Toaster } from 'sonner'
import { TransferPage } from './features/transfers/TransferPage'

function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <TransferPage />
    </>
  )
}

export default App
