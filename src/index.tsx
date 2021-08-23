import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { createTheme, ThemeProvider } from '@material-ui/core';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={createTheme({
      palette: {
        primary: {
          main: "#101010",
        }
      }
    })}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
