import { useState, useEffect } from "react";
import WalletConnectClient from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { IClientMeta } from "@walletconnect/types";

const meta: IClientMeta = {
  name: "My dApp",
  description: "My dApp description",
  url: "https://mydapp.com",
  icons: ["https://mydapp.com/logo.png"],
};

export const useWalletConnect = () => {
  const [wc, setWc] = useState<WalletConnectClient | null>(null);

  const connectWalletConnect = async () => {
    if (!wc) {
      const client = new WalletConnectClient({ uri: "wss://bridge.walletconnect.org", clientMeta: meta });
      setWc(client);

      if (!client.connected) {
        await client.createSession();
        QRCodeModal.open(client.uri, null);
      }
    }
  };

  const disconnectWalletConnect = () => {
    if (wc) {
      wc.killSession();
      setWc(null);
    }
  };

  useEffect(() => {
    if (wc) {
      wc.on("session_request", (error, payload) => {
        if (error) {
          throw error;
        }

        const uri = payload.params[0];
        QRCodeModal.open(uri, null);
      });

      wc.on("connect", (error, payload) => {
        if (error) {
          throw error;
        }

        console.log("WalletConnect connected!", payload);
      });

      wc.on("killSession", (error, payload) => {
        if (error) {
          throw error;
        }

        console.log("WalletConnect disconnected!", payload);
      });
    }
  }, [wc]);

  return {
    wc,
    connectWalletConnect,
    disconnectWalletConnect,
  };
};
