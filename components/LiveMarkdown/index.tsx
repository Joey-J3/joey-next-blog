import dynamic from "next/dynamic";
import { ClipboardEvent, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import TextField from "@mui/material/TextField";
import styles from './live-markdown.module.scss'
import CenterLoading, { FullScreenLoader } from "../CenterLoadng";
import { Box } from "@mui/material";

const Markdown = dynamic(() => import('@/components/Markdown'), { loading: () => <CenterLoading />})

interface Props {
  markdownInput: string;
  onChange: (data: string) => void
}

const LiveMarkdown: React.FC<Props> = ({ markdownInput, onChange }) => {
  const [loading, setLoading] = useState(false);
  const handlePaste = async (e: ClipboardEvent<HTMLDivElement>) => {
    const dT = e.clipboardData
    const items = dT.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const html = dT.getData('text/html') || "";
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const img = parsed.querySelector('img');
        if(!img) { console.warn('no image here'); return; }
        
        try {
          setLoading(true)
          const result = await fetch('/api/cloudinary/upload', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({resource: img.src}),
          }).then(res => res.json())
          onChange(markdownInput + `![{cloudinary} {${result.width}x${result.height}} {caption: ${img.alt}}](${result.public_id})`)
        } catch (error) {
          console.error(`[Upload Image Failed]: ${error}`);
        } finally {
          setLoading(false)
        }
      } else {
        items[i].getAsString((data) => {
          onChange(markdownInput + data)
        });
      }
    }
  }
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
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
          />
        </div>
        <div className={styles['preview-box']}>
          <div className={styles.head}>
            <Visibility />
            PREIVEW
          </div>
          <Box sx={{ position: 'relative' }}>
            <Markdown markdownInput={markdownInput} />
          </Box>
          <FullScreenLoader open={loading} />
        </div>
      </div>
    </div>
  )
}
export default LiveMarkdown