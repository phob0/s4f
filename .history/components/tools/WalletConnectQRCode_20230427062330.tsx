import { useEffect, useState, FunctionComponent } from 'react';
import { Box } from '@mui/material';
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
      <Box
        sx={{
          svg: {
            borderRadius: 'xl',
          },
        }}
        dangerouslySetInnerHTML={{
          __html: qrCodeSvg,
        }}
      />
      {mobile ? (
        <Box justifyContent="center">
          <Box
            py={2}
            px={6}
            mt={6}
            sx = {{
              width: "100%",
              textAlign: "center",
              color: "#fff",
              borderColor: "gray",
              borderWidth: 2,
              fontWeight: "normal",
              transition: "background-color .3s"
            }}
            // as="a"
            // href={`${walletConnectDeepLink}?wallet-connect=${encodeURIComponent(
            //   uri
            // )}`}
            // rel="noopener noreferrer nofollow"
            // target="_blank"
          >
            xPortal Login
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
