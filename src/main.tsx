import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 3.2 Import Tailwind CSS entry point; 3.3 old styles.css import removed
import './index.css';
import { printDebugInstructions, resolveDebugInitialVisible } from './utils/debug';

// Print debug toggle instructions on every startup (once per page load, not on HMR)
if (!window.__tombDebugHintPrinted) {
  window.__tombDebugHintPrinted = true;
  printDebugInstructions(resolveDebugInitialVisible());
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
