import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

interface Props {
  children: JSX.Element;
  content?: JSX.Element | string;
  onSubmit: () => void;
}

const ConfirmDialog: React.FC<Props> = ({ children, onSubmit, content }) => {
  const [visible, setVisible] = useState(false);
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
          <Button color="primary" variant="contained" onClick={() => onSubmit()}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDialog