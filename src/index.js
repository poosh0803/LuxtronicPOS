import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RootComponent from './RootComponent';
import App from './App';
import { AuthProvider } from './AuthContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <RootComponent />
      
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);