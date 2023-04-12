import Visibility from "@mui/icons-material/Visibility";
import TextField from "@mui/material/TextField";
import styles from './live-markdown.module.scss'
import Markdown from "../Markdown";

interface Props {
  markdownInput: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const LiveMarkdown: React.FC<Props> = ({ markdownInput, onChange }) => {
  return (
    <div className={styles["live-markdown__container"]}>
      <div className={styles.wrapper}>
        <div className={styles['editor-box']}>
          <div className={styles.head}>
            <Visibility />
            MARKDOWN
          </div>
          <TextField
            id="markdown-content"
            placeholder="Markdown content"
            multiline
            autoFocus
            className={styles.markdown}
            minRows={10}
            value={markdownInput}
            onChange={onChange}
          />
        </div>
        <div className={styles['preview-box']}>
          <div className={styles.head}>
            <Visibility />
            PREIVEW
          </div>
          <Markdown markdownInput={markdownInput} />
        </div>
      </div>
    </div>
  )
}
export default LiveMarkdown