import { Backdrop, CircularProgress } from "@mui/material";

export default function CenterLoading() {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center min-h-[192px]">
      <CircularProgress />
    </div>
  )
}

export const FullScreenLoader: React.FC<{ open: boolean }> = ({ open }) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
