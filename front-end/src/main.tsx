import { createRoot } from 'react-dom/client'
import '~/index.css'
import App from '~/App'
import CssBaseline from '@mui/material/CssBaseline'
import { AlertToast } from '~/components/Alert/Alert'
import { GlobalProviders } from '~/AppProviders'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GlobalProviders>
      <CssBaseline />
      <App />
      <AlertToast />
    </GlobalProviders>
  </BrowserRouter>
)
