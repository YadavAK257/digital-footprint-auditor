import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/tokens.css';
import App from './App.jsx';
import { AccountsProvider } from './context/AccountsContext';
import { SecurityProvider } from './context/SecurityContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AccountsProvider>
        <SecurityProvider>
          <App />
        </SecurityProvider>
      </AccountsProvider>
    </AuthProvider>
  </StrictMode>
);
