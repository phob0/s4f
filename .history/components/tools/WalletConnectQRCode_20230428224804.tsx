import { useEffect, useState, FunctionComponent } from 'react';
import { Box, Link, SvgIcon } from '@mui/material';
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
          height: '300px';
          width: 300;
        }}
        dangerouslySetInnerHTML={{__html: qrCodeSvg}}
      />
      {mobile ? (
        <Box justifyContent="center">
          <Link
            href={`${walletConnectDeepLink}?wallet-connect=${encodeURIComponent(uri)}`}
            target="_blank"  
          >
            xPortal Login
          </Link>
        </Box>
      ) : null}
    </Box>
  );
};
