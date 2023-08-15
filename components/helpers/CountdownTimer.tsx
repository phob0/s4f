import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';

const CountdownTimer = () => {
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const timeDifference = Number(endOfMonth) - Number(now);

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    const formattedTime = `${days} D: ${hours} H: ${minutes} M`;
    setRemainingTime(formattedTime);

    const timerInterval = setInterval(() => {
      setRemainingTime(formattedTime);
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  return (
    <div>
        <Typography color="common.white" align="center">
          {remainingTime}
        </Typography>
    </div>
  );
};

export default CountdownTimer;
