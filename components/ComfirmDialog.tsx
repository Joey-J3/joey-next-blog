import Close from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { useState } from "react";

interface Props {
  children: JSX.Element;
  content?: JSX.Element | string;
  onSubmit: () => Promise<void>;
}

const ConfirmDialog: React.FC<Props> = ({ children, onSubmit, content }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const onConfirm = async () => {
    try {
      setLoading(true)
      await onSubmit()
    } catch (error) {
      throw new Error(`[ConfirmDialog]: Submit callback error: ${error}`)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <span onClick={() => setVisible(true)}>{children}</span>
      <Dialog open={visible} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm the action</DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={() => setVisible(false)}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography>{content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="outlined" onClick={() => setVisible(false)}>
            Cancel
          </Button>
          <Button color="primary" variant="contained" onClick={() => onConfirm()}>
            {loading ? <CircularProgress color="inherit" size={20} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDialog