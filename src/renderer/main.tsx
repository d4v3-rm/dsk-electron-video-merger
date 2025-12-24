import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppThemeProvider } from './components/AppThemeProvider';
import 'antd/dist/reset.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>,
);
