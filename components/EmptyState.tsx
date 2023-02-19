import { SearchSharp } from "@mui/icons-material"
import Typography from "@mui/material/Typography"

const EmptyState: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center h-48">
      <SearchSharp />
      <Typography>No Result Found!</Typography>
    </div>
  )
}

export default EmptyState;