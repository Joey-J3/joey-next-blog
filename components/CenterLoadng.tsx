import { CircularProgress } from "@mui/material";

export default function CenterLoading() {
  return (
    <div className="w-full flex items-center justify-center h-48">
      <CircularProgress />
    </div>
  )
}