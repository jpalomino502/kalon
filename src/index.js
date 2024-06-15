import React from 'react';
import { createRoot } from 'react-dom/client'; // Importar createRoot desde react-dom/client
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Utilizar createRoot en lugar de ReactDOM.render
const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
