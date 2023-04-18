import { CircularProgress, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

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
        <Suspense fallback={<CircularProgress />}>
          <Chat />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}