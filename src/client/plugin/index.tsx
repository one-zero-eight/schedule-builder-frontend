import { createRoot } from 'react-dom/client';
import ApiTokenProvider from './components/apiToken/Provider';
import './styles.css';
import StateRouter from './components/router/StateRouter';
import Route from './components/router/Route';
import Layout from './components/Layout';
import MainPage from './components/MainPage';
import SettingsPage from './components/SettingsPage';
import IgnoredPage from './components/IgnoredPage';

const container = document.getElementById('index');
if (!container) {
  throw new Error('Could not find element with id "index"');
}

const root = createRoot(container);
root.render(
  <ApiTokenProvider>
    <StateRouter initialRoute="/" layout={Layout}>
      <Route path="/" element={<MainPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/ignored" element={<IgnoredPage />} />
    </StateRouter>
  </ApiTokenProvider>
);
