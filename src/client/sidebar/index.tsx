import { createRoot } from 'react-dom/client';
import ApiTokenProvider from './components/apiToken/Provider';
import './styles.css';
import { IssuesProvider } from './components/IssuesProvider';
import { Layout } from './components/Layout';
import Route from './components/router/Route';
import StateRouter from './components/router/StateRouter';
import { MainPage } from './pages/home/index';
import { IgnoredConflictsPage as IgnoredPage } from './pages/ignored/index';
import { SettingsPage } from './pages/settings/index';

const container = document.getElementById('app');
if (!container) {
  throw new Error('Could not find element with id "app"');
}

const root = createRoot(container);
root.render(
  <ApiTokenProvider>
    <IssuesProvider>
      <StateRouter initialRoute="/" layout={Layout}>
        <Route path="/" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/ignored" element={<IgnoredPage />} />
      </StateRouter>
    </IssuesProvider>
  </ApiTokenProvider>
);
