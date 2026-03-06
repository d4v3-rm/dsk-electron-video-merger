import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@renderer/App';
import { AppThemeProvider } from '@renderer/components/AppThemeProvider';
import '@renderer/i18n';
import 'antd/dist/reset.css';
import '@renderer/styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>,
);
