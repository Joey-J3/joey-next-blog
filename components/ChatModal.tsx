import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import MFWrapper from './MFWrapper';

const Chat = dynamic(() => import('chatgptNext/chat'), { suspense: false })

interface Props {
  visible: boolean;
  onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
}

export default function ChatModal({ visible, onClose }: Props) {
  return (
    <Dialog open={visible} onClose={onClose} fullWidth={true}>
      <DialogTitle>
        <Typography>ChatGpt Next</Typography>
      </DialogTitle>
      <DialogContent>
        <MFWrapper>
          <Chat />
        </MFWrapper>
      </DialogContent>
    </Dialog>
  )
}