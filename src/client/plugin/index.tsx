import { createRoot } from 'react-dom/client';
import Main from './components/Main';
import ApiTokenProvider from './components/apiToken/Provider';
import './styles.css';

const container = document.getElementById('index');
if (!container) {
  throw new Error('Could not find element with id "index"');
}

const root = createRoot(container);
root.render(
  <ApiTokenProvider>
    <Main />
  </ApiTokenProvider>
);
