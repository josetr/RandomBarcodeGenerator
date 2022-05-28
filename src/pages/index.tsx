import { useEffect, useState } from 'react';
import { AppBar, Button, TextField, Toolbar, Typography } from '@mui/material';
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
import { generateRandomCode } from '../generator';
import { Storage } from '../storage';
import { padCode, range } from '../util';
import Barcode from '../barcode';
import styles from './index.module.scss';

const CLIENT_ID = "843901847350-30igg13jkqtha7fnb3eh7seatf09n93t.apps.googleusercontent.com"
const SCOPES = "https://www.googleapis.com/auth/drive.file";

const storage = new Storage()

function App() {
  const [header, setHeader] = useState("Header")
  const [quantity, setQuantity] = useState(18)
  const [codes, setCodes] = useState<number[]>([0])
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDriveReady, setIsDriveReady] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const canPrint = isLoggedIn && isDriveReady;

  const onGoogleError = () => setMessage("Failed loading Google Client")

  useEffect(() => {
    gapi.load("client:auth2", {
      callback: async () => {
        try {
          await gapi.client.init({ clientId: CLIENT_ID, scope: SCOPES })
          setIsLoggedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
          gapi.auth2.getAuthInstance().isSignedIn.listen(setIsLoggedIn);
          await gapi.client.load('drive', 'v3');
          setIsDriveReady(true)
        }
        catch {
          onGoogleError()
        }
      },
      onerror: onGoogleError
    });
  }, [])

  function generateNewCodes() {
    setCodes(range(quantity).map(() => generateRandomCode()))
  }

  async function print() {
    if (isLoggedIn && isDriveReady) {
      try {
        setMessage("Fetching database...")
        await storage.load()
        await storage.add(codes)
        setMessage("Updating database...")
        await storage.save()
        setMessage("")
      }
      catch {
        setMessage("An error ocurred while trying to sync with the cloud. Printing codes that are not stored in the cloud is not recommended.")
      }
    }

    window.print()
  }

  return <>
    <AppBar position="sticky">
      <Toolbar className="toolbar">
        <Typography>Random Barcode Generator</Typography>
        {!isLoggedIn && <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="Log in"
          onSuccess={() => setIsLoggedIn(true)}
          scope={SCOPES}
          icon={true}
          className="google-login-button"
          cookiePolicy={'single_host_origin'}
        />}
        {isLoggedIn &&
          <GoogleLogout
            clientId={CLIENT_ID}
            className="google-login-button"
            buttonText="Logout">
          </GoogleLogout>}
      </Toolbar>
    </AppBar>
    <main>
      <div className={styles.config}>
        <TextField label="Header" type="text" value={header} onChange={e => setHeader(e.target.value)} fullWidth size="small" />
        <TextField label="Quantity" type="number" inputProps={{ maxLength: 3 }} value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} fullWidth size="small" />
        <Button variant="contained" color="primary" onClick={generateNewCodes} fullWidth>Generate Barcodes</Button>
        {codes[0] > 0 &&
          <Button variant="outlined" color="primary" onClick={print} fullWidth>{canPrint && "Save & "}Print</Button>
        }
        {isDriveReady && !isLoggedIn &&
          <Typography>You must be logged in to prevent duplicate barcodes.</Typography>
        }
        <Typography>{message}</Typography>
      </div>
      <ul className={styles.barcode_list}>
        {codes.map(code =>
          <li key={code} className={styles.barcode_list_item}>
            <Barcode key={code} name={header} value={padCode(code)} />
          </li>)}
      </ul>
    </main>
    <footer>
      <Typography>Copyright (C) 2021 Jose Torres</Typography>
    </footer>
  </>
}

export default App;
