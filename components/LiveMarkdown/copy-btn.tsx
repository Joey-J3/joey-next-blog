import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined"
import { useMessage } from "common/hooks/useMessage";
import { Children, SyntheticEvent } from "react"

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
      <span className="text-white absolute right-2 top-2 transition cursor-pointer hover:scale-110">
        <ContentCopyOutlined onClick={handleClick} />
      </span>
    </>
  )
}