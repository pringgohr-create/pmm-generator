import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-markdown'; // Ensure react-markdown is imported, assuming it's available

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
