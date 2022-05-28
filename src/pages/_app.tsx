import './_app.scss'
import Head from 'next/head';
import { AppProps } from 'next/app';
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Random Barcode Generator" />
        <title>Random Barcode Generator</title>
        <script src="https://apis.google.com/js/api.js" defer></script>
      </Head>

      <React.StrictMode>
        <ThemeProvider theme={createTheme({
          palette: {
            primary: {
              main: "#101010",
            }
          }
        })}>
          <Component {...pageProps} />
        </ThemeProvider>
      </React.StrictMode>
    </>
  );
}

export default App;