import { RouterProvider } from 'react-router-dom'
import './globals.css'
import { router } from './routes'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Toaster } from './components/ui/sonner'
import { ThemeProvider } from './components/theme/theme-provider'

export function App() {
  return (
      <HelmetProvider>
        <ThemeProvider storageKey="boxsurprise-theme" defaultTheme="dark">
          <Helmet titleTemplate='%s | Box Suprise' />
          <RouterProvider router={router} />
          <Toaster richColors />
        </ThemeProvider>
      </HelmetProvider>
  )
}
