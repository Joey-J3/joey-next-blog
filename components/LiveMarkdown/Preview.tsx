import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock"
import { CopyBtn } from "./copy-btn";

interface Props {
  markdownInput: string;
}

const MarkDown: React.FC<Props> = ({ markdownInput }) => {
  const Pre: React.FC<{ children: any }> = ({ children }) => <pre style={{ position: 'relative'}}><CopyBtn>{children}</CopyBtn>{children}</pre>

  return (
    <ReactMarkdown
      components={{
        pre: Pre,
        code: CodeBlock
      }}
      remarkPlugins={[remarkGfm]}
    >
      {markdownInput}
    </ReactMarkdown>
  )
}

export default MarkDown