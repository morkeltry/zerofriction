import React from "react";
import ReactDOM from "react-dom/client";
import {PrivyProvider} from '@privy-io/react-auth';


import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmah1dydu00gdjy0ni6eqz7ke"
      clientId="client-WY6LH9RLAGPMa2Ep2p64Eak3vrCdQ5YhYn5tCRQWmgnYY"
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        }
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>,
);
