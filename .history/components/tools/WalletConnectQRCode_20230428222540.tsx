import { useEffect, useState, FunctionComponent } from 'react';
import { Box, Link } from '@mui/material';
import { useConfig } from '@useelven/core';
import { isMobile } from '../../utils/isMobile';
import QRCode from 'qrcode';

interface WalletConnectQRCodeProps {
  uri: string;
}

export const WalletConnectQRCode: FunctionComponent<
  WalletConnectQRCodeProps
> = ({ uri }) => {
  const [qrCodeSvg, setQrCodeSvg] = useState('');
  const { walletConnectDeepLink } = useConfig();

  useEffect(() => {
    const generateQRCode = async () => {
      if (!uri) {
        return;
      }

      const svg = await QRCode.toString(uri, {
        type: 'svg',
      });

      setQrCodeSvg(svg);
    };
    generateQRCode();
  }, [uri]);

  const mobile = isMobile();

  return (
    <Box>
      <canvas id="canvas" />
      {mobile ? (
        <Box justifyContent="center">
          {/* <Box
            py={2}
            px={6}
            mt={6}
            // sx = {{
            //   width: "100%",
            //   textAlign: "center",
            //   borderColor: "gray",
            //   borderWidth: 2,
            //   fontWeight: "normal",
            // }}
            // as="a"
            // href={`${walletConnectDeepLink}?wallet-connect=${encodeURIComponent(
            //   uri
            // )}`}
            // rel="noopener noreferrer nofollow"
            // target="_blank"
          >
            xPortal Login
          </Box> */}

          <Link
            href={`${walletConnectDeepLink}?wallet-connect=${encodeURIComponent(uri)}`}
          >
            xPortal Login
          </Link>
        </Box>
      ) : null}
    </Box>
  );
};
