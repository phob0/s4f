import { Container, Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import { MetaHead, MetaHeadProps } from './MetaHead';
import { Footer } from './Footer';

export const MainLayout: FC<PropsWithChildren<MetaHeadProps>> = ({
  children,
  metaTitle,
  metaDescription,
  metaImage,
  metaUrl,
}) => {
  return (
    <>
      <MetaHead
        metaTitle={metaTitle}
        metaDescription={metaDescription}
        metaImage={metaImage}
        metaUrl={metaUrl}
      />
      <Box minHeight="calc(100vh - 120px)" pb="10">
        <Container sx={{
          maxWidth: "container.xl"
        }}>
          <Box>{children}</Box>
        </Container>
      </Box>
      {/* <Footer /> */}
    </>
  );
};

MainLayout.displayName = 'MainLayout';
