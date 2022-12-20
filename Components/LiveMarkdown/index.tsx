import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { Visibility } from "@mui/icons-material";
import {dark} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import styles from './live-markdown.module.scss'

export default function LiveMarkdown() {
  const [markdownInput, setMarkdownInput] = useState<string>('');
  return (
    <div className={styles["live-markdown__container"]}>
      <div className={styles.wrapper}>
        <div className={styles.head}>
          <Visibility />
          MARKDOWN
        </div>
        <textarea
          autoFocus
          className={styles.textarea}
          value={markdownInput}
          onChange={(e) => setMarkdownInput(e.target.value)}
        ></textarea>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.head}>
          <Visibility />
          PREIVEW
        </div>
        <ReactMarkdown
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={dark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {markdownInput}
        </ReactMarkdown>
      </div>
    </div>
  )
}
