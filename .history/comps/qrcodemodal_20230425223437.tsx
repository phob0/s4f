import { useState } from "react";
import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

interface Props {
  onClose: () => void;
  onConnect: (provider: WalletConnectProvider) => void;
}

const QRCodeLoginModal: React.FC<Props> = ({ onClose, onConnect }) => {
  const [uri, setUri] = useState<any>("");

  const handleUriChange = (uri: string) => {
    setUri(uri);
    QRCodeModal.open(uri, () => {
      onClose();
    });
  };

  const handleConnect = async () => {
    const provider = new WalletConnectProvider({
      uri,
      pollingInterval: 15000,
    });

    await provider.enable();

    onConnect(provider);
    onClose();
  };

  return (
    <div>
      <p>Scan the QR code below to connect your wallet:</p>
      <img src={uri} alt="QR code" />
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
};

export default QRCodeLoginModal;
