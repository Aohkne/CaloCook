import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@styles/global.scss';
import '@styles/mixin.scss';
import App from './App.jsx';
import ThemeProvider from '@/contexts/ThemeProvider.jsx';
import { AuthProvider } from '@/contexts/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
