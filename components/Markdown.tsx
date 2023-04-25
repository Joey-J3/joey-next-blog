import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import CodeBlock from './LiveMarkdown/CodeBlock';
import { CopyBtn } from './copy-btn';
import styles from './markdown.module.scss'

interface Props {
  markdownInput: string;
}

const MarkDown: React.FC<Props> = ({ markdownInput }) => {
  const Pre: React.FC<{ children: any }> = ({ children }) => (
    <pre style={{ position: 'relative' }}>
      <CopyBtn>{children}</CopyBtn>
      {children}
    </pre>
  );

  return (
    <div className={styles['markdown-body']}>
      <ReactMarkdown
        components={{
          pre: Pre,
          code: CodeBlock,
        }}
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
      >
        {markdownInput}
      </ReactMarkdown>
    </div>
  );
};

export default MarkDown;
