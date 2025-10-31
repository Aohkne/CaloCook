import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@styles/global.scss';
import '@styles/mixin.scss';
import App from './App.jsx';
import ThemeProvider from '@/contexts/ThemeProvider.jsx';
import { AuthProvider } from '@/contexts/AuthProvider.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const client = import.meta.env.VITE_GOOGLE_CLIENT_ID;
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={client}>
    <StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
