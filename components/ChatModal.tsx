import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import MFWrapper from './MFWrapper';

const Chat = dynamic<{theme: Theme}>(() => import('chatgptNext/chat'), { suspense: false });
const Sidebar = dynamic<{ theme: Theme }>(() => import('chatgptNext/sidebar'), { suspense: false });

interface Props {
  visible: boolean;
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

export default function ChatModal({ visible, onClose }: Props) {
  const theme = useTheme()
  return (
    <Dialog open={visible} onClose={onClose} fullWidth={true} maxWidth="md">
      <DialogTitle>
        <Typography>ChatGpt Next</Typography>
      </DialogTitle>
      <DialogContent dividers={true} sx={{ height: '568px' }} className="flex m-auto">
        <MFWrapper>
          <Sidebar theme={theme} />
        </MFWrapper>
        <MFWrapper>
          <Chat theme={theme} />
        </MFWrapper>
      </DialogContent>
    </Dialog>
  );
}
