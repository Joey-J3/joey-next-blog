import { Visibility } from "@mui/icons-material";
import styles from './live-markdown.module.scss'
import Preview from "./Preview";

interface Props {
  markdownInput: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const LiveMarkdown: React.FC<Props> = ({ markdownInput, onChange }) => {
  return (
    <div className={styles["live-markdown__container"]}>
      {/* <div className={styles.header}>
        <Header />
      </div>
       */}
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
            onChange={onChange}
          ></textarea>
        </div>
        <div className={styles['preview-box']}>
          <div className={styles.head}>
            <Visibility />
            PREIVEW
          </div>
          <Preview markdownInput={markdownInput} />
        </div>
      </div>
    </div>
  )
}
export default LiveMarkdown