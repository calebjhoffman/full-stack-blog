import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import App from './App.jsx';
import { ColorModeProvider } from './context/ColorModeContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ColorModeProvider> {/* ✅ Color mode comes first */}
      <AuthProvider> {/* ✅ AuthProvider goes inside, avoids circular crash */}
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </ColorModeProvider>
  </StrictMode>
);
