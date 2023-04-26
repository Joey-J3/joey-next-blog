import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Skeleton, Typography } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import ErrorBoundary from './ErrorBoundary';



const Chat = dynamic<{ theme: Theme }>(() => import('chatgptNext/chat'), { loading: () => <Skeleton variant="rounded" height='100%' style={{ flex: 1 }} /> });
const Sidebar = dynamic<{ theme: Theme }>(() => import('chatgptNext/sidebar'), { loading: () => <Skeleton variant="rounded" height='100%' sx={theme => ({ width: '300px', [theme.breakpoints.down('sm')]: { width: '100%' } })} /> });

interface Props {
  visible: boolean;
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

export default function ChatModal({ visible, onClose }: Props) {
  const theme = useTheme()
  return (
    <Dialog open={visible} onClose={onClose} fullWidth={true} maxWidth="md">
      <Box sx={theme => ({ height: theme.breakpoints.values.sm })} className="flex gap-4 p-4">
        <ErrorBoundary>
          <>
            <Sidebar theme={theme} />
            <div className='flex-1'>
              <Chat theme={theme} />
            </div>
          </>
        </ErrorBoundary>
      </Box>
    </Dialog>
  );
}
