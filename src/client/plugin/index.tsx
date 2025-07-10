import { createRoot } from 'react-dom/client';
import ApiTokenProvider from './components/apiToken/Provider';
import './styles.css';
import StateRouter from './components/router/StateRouter';
import Route from './components/router/Route';

import Layout from './components/Layout';
import MainPage from './pages/home/index';
import IgnoredPage from './pages/ignored/index';
import SettingsPage from './pages/settings/index';
import ConflictsProvider from './components/ConflictsProvider';
import ThemeProvider from './components/ThemeProvider';

const container = document.getElementById('index');
if (!container) {
  throw new Error('Could not find element with id "index"');
}

const root = createRoot(container);
root.render(
  <ApiTokenProvider>
    <ThemeProvider>
      <ConflictsProvider>
        <StateRouter initialRoute="/" layout={Layout}>
          <Route path="/" element={<MainPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/ignored" element={<IgnoredPage />} />
        </StateRouter>
      </ConflictsProvider>
    </ThemeProvider>
  </ApiTokenProvider>
);
