import { MouseEvent, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Visibility } from "@mui/icons-material";
import styles from './live-markdown.module.scss'
import CodeBlock from "./CodeBlock";
import Header from "../Header";

interface LiveMarkdownProps {
  onSave: (value: string, e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => any;
}

export default function LiveMarkdown({ onSave }: LiveMarkdownProps) {
  const [markdownInput, setMarkdownInput] = useState<string>('');
  return (
    <div className={styles["live-markdown__container"]}>
      <div className={styles.header}>
        <Header />
      </div>
      
      <div className={styles.wrapper}>
        <div className={styles['editor-box']}>
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
        <div className={styles['preview-box']}>
          <div className={styles.head}>
            <Visibility />
            PREIVEW
          </div>
          <ReactMarkdown
            components={{
              code: CodeBlock
            }}
          >
            {markdownInput}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
