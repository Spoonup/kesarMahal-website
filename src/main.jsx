import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './store';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode><BrowserRouter><StoreProvider><ErrorBoundary><App /></ErrorBoundary></StoreProvider></BrowserRouter></StrictMode>
);
