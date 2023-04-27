import React from 'react';
import { Paper, Typography, Button } from '@mui/material';

interface Props { error: String | null | undefined; onRetry?: Function }

const ErrorFallback: React.FC<Props> = ({
  error,
  onRetry,
}) => {
  return (
    <Paper className="h-full p-4 flex flex-col items-center gap-4 rounded-lg m-auto overflow-auto">
      <Typography variant="h5">Oops! Something went wrong.</Typography>
      <Typography variant="body1">{error}</Typography>
      {onRetry && <Button variant="contained" color="primary" onClick={() => onRetry()}>
        Retry
      </Button>}
    </Paper>
  );
};

export default ErrorFallback;

// eslint-disable-next-line react/display-name
export const getErrorFallbackWithProps = (props: Props) => () => <ErrorFallback {...props} />