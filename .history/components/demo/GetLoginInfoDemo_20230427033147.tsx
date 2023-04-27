import { Typography, Tooltip } from '@mui/material';
import { FlexCardWrapper } from '../ui/CardWrapper';
import { useLoginInfo } from '@useelven/core';
import { shortenHash } from '../../utils/shortenHash';
import { CardItemWrapper } from './CardItemWrapper';

export const GetLoginInfoDemo = () => {
  const { loginMethod, expires, loginToken, signature } = useLoginInfo();

  return (
    <FlexCardWrapper alignItems="flex-start" justifyContent="flex-start">
      <Typography fontSize="xl" mb={2} fontWeight="black">
        Login info state:
      </Typography>
      <CardItemWrapper>
        <Typography display="inline-block" fontWeight="bold">
          loginMethod:
        </Typography>{' '}
        {loginMethod}
      </CardItemWrapper>
      <CardItemWrapper>
        <Typography display="inline-block" fontWeight="bold">
          expires:
        </Typography>{' '}
        {expires}
      </CardItemWrapper>
      <CardItemWrapper>
        <Typography display="inline-block" fontWeight="bold">
          loginToken:
        </Typography>{' '}
        {loginToken || '-'}
      </CardItemWrapper>
      <Tooltip label={signature}>
        <CardItemWrapper>
          <Typography display="inline-block" fontWeight="bold">
            signature:
          </Typography>{' '}
          {signature ? shortenHash(signature, 8) : '-'}
        </CardItemWrapper>
      </Tooltip>
    </FlexCardWrapper>
  );
};
