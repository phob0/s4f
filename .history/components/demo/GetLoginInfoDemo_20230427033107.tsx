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
        <Text as="span" display="inline-block" fontWeight="bold">
          loginMethod:
        </Text>{' '}
        {loginMethod}
      </CardItemWrapper>
      <CardItemWrapper>
        <Text as="span" display="inline-block" fontWeight="bold">
          expires:
        </Text>{' '}
        {expires}
      </CardItemWrapper>
      <CardItemWrapper>
        <Text as="span" display="inline-block" fontWeight="bold">
          loginToken:
        </Text>{' '}
        {loginToken || '-'}
      </CardItemWrapper>
      <Tooltip label={signature}>
        <CardItemWrapper>
          <Text as="span" display="inline-block" fontWeight="bold">
            signature:
          </Text>{' '}
          {signature ? shortenHash(signature, 8) : '-'}
        </CardItemWrapper>
      </Tooltip>
    </FlexCardWrapper>
  );
};
