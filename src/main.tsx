import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 3.2 Import Tailwind CSS entry point; 3.3 old styles.css import removed
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
