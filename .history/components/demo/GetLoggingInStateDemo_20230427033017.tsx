import { Typography } from '@mui/material';
import { FlexCardWrapper } from '../ui/CardWrapper';
import { useLoggingIn } from '@useelven/core';
import { CardItemWrapper } from './CardItemWrapper';

export const GetLoggingInStateDemo = () => {
  const { pending, error, loggedIn } = useLoggingIn();

  return (
    <FlexCardWrapper alignItems="flex-start" justifyContent="flex-start">
      <Typography fontSize="xl" mb={2} fontWeight="black">
        Logging in current state:
      </Typography>
      <CardItemWrapper>
        <Typography display="inline-block" fontWeight="bold">
          isLoggingIn:
        </Typography>{' '}
        {pending ? 'true' : 'false'}
      </CardItemWrapper>
      <CardItemWrapper>
        <Typography display="inline-block" fontWeight="bold">
          error:
        </Typography>{' '}
        {error || '-'}
      </CardItemWrapper>
      <CardItemWrapper>
        <Typography display="inline-block" fontWeight="bold">
          isLoggedIn:
        </Typography>{' '}
        {loggedIn ? 'true' : 'false'}
      </CardItemWrapper>
    </FlexCardWrapper>
  );
};
