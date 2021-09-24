import 'tailwindcss/tailwind.css'
import { AuthContext, AuthProvider } from '../contexts/AuthContext'
function MyApp({ Component, pageProps }) {
  return (
  <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
  )
}

export default MyApp
