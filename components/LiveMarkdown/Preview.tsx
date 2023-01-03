import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import CodeBlock from "./CodeBlock"

interface Props {
  markdownInput: string;
}

const MarkDown: React.FC<Props> = ({ markdownInput }) => {
  return (
    <ReactMarkdown
      components={{
        code: CodeBlock
      }}
    >
      {markdownInput}
    </ReactMarkdown>
  )
}

export default MarkDown