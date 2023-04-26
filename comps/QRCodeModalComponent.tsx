import { useState } from "react";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { useWalletConnect } from "./useWalletConnect";

const QRCodeModalComponent = () => {
  const { wc } = useWalletConnect();
  const [modalOpened, setModalOpened] = useState(false);

  const openModal = () => {
    if (wc && !wc.connected) {
      QRCodeModal.open(wc.uri, null);
      setModalOpened(true);
    }
  };

  const closeModal = () => {
    QRCodeModal.close();
    setModalOpened(false);
  };

  return (
    <div>
      <button onClick={openModal}>Connect Wallet</button>
      {modalOpened && <div onClick={closeModal}>Close Modal</div>}
    </div>
  );
};

export default QRCodeModalComponent;
