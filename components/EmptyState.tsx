import SearchSharp from "@mui/icons-material/SearchSharp"
import Typography from "@mui/material/Typography"

interface Props {
  prefix?: JSX.Element;
  children?: JSX.Element | string;
}

const EmptyState: React.FC<Props> = ({ prefix, children = 'No Result Found!' }) => {
  return (
    <div className="w-full flex items-center justify-center h-48">
      { prefix || <SearchSharp /> }
      <Typography>{ children }</Typography>
    </div>
  )
}

export default EmptyState;