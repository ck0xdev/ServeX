// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/neumorphism.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#e8edf2',
          color: '#2d3748',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        },
      }}
    />
  </React.StrictMode>
);