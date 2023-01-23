import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { ChangeEvent, MouseEventHandler } from "react";

interface Props {
  value: string;
  onChange: (value: any, e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  onClick: MouseEventHandler<HTMLButtonElement>
}

const SearchGroup: React.FC<Props> = ({ value, onChange, onClick }) => {
  return (
    <div className="flex items-center justify-center">
      <TextField value={value} onChange={(e) => onChange(e.target.value, e)} type="text" placeholder="Please type the title." inputProps={{ style: { paddingTop: 8, paddingBottom: 8 }}} />
      <Button onClick={onClick} color="primary" variant="contained" className="ml-2">Search</Button>
    </div>
  )
}

export default SearchGroup