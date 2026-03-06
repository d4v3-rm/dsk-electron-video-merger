import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from '@website/App';
import { siteTheme } from '@website/theme/site-theme';
import '@website/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={siteTheme}>
    <App />
  </ConfigProvider>,
);
