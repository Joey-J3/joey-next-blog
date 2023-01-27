import clsx from "clsx";
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock"
import { CopyBtn } from "./copy-btn";
import styles from './preview.module.scss'

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
      className={clsx(styles['md-body'], 'p-8')}
    >
      {markdownInput}
    </ReactMarkdown>
  )
}

export default MarkDown