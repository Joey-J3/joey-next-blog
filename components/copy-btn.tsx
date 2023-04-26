import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined"
import { useMessage } from "common/hooks/useMessage";
import { Children, SyntheticEvent } from "react"
import IconButton from '@mui/material/IconButton'

interface Props {
  children: JSX.Element;
}

export const CopyBtn: React.FC<Props> = ({ children }) => {
  const { Message, setOpen } = useMessage('Copied Successfully!')
  const handleClick = (e: SyntheticEvent) => {
    navigator.clipboard.writeText((Children.toArray(children)[0] as JSX.Element).props.children[0])
    setOpen(true)
  }
  return (
    <>
      {Message}
      <IconButton aria-label="copy" onClick={handleClick} sx={theme => ({ color: theme.palette.common.white})} style={{ position: 'absolute', right: '0.5rem', top: '0.5rem'}}>
        <ContentCopyOutlined />
      </IconButton>
    </>
  )
}