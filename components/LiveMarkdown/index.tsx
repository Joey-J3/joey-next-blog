import dynamic from 'next/dynamic';
import { ClipboardEvent, useRef, useState } from 'react';
import TurndownService from 'turndown';
import Visibility from '@mui/icons-material/Visibility';
import { Box, TextField } from '@mui/material';
import styles from './live-markdown.module.scss';
import CenterLoading, { FullScreenLoader } from '../CenterLoading';

const Markdown = dynamic(() => import('@/components/Markdown'), { loading: () => <CenterLoading /> });

interface Props {
  markdownInput: string;
  onChange: (data: string) => void;
}

const asyncReplacement = async function (str: string) {
  const regex = /!\[(.*?)\]\((.*?)\)/g;
  const promises: Promise<any>[] = [];
  const map = new Map();
  str.replace(regex, (match, alt, src) => {
    if (!src) {
      console.warn('no src here');
      map.set(match, '');
      return '';
    }
    const p = fetch('/api/cloudinary/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: src }),
    })
      .then((res) => res.json())
      .then((result) => {
        map.set(
          match,
          `![{cloudinary} {${result.width}x${result.height}} {caption: ${alt || ''}}](${result.public_id})`,
        );
      })
      .catch((e) => {
        console.error(`[Upload Image Failed]: ${e}`);
        return '';
      });
    promises.push(p);
    return '';
  });
  await Promise.all(promises);
  return str.replace(regex, (match) => map.get(match));
};

const LiveMarkdown: React.FC<Props> = ({ markdownInput, onChange }) => {
  const [loading, setLoading] = useState(false);
  const textFieldRef = useRef<HTMLTextAreaElement | null>(null);
  const handlePaste = async (e: ClipboardEvent<HTMLDivElement>) => {
    const turndownService = new TurndownService();
    const dT = e.clipboardData;
    const html = dT.getData('text/html') || '';
    const md = turndownService.turndown(html);
    setLoading(true);
    try {
      const result = await asyncReplacement(md);
      console.log('🚀',dT, html, md, result);
      
      insertText(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const insertText = (text: string) => {
    const ele = textFieldRef.current as HTMLTextAreaElement;
    // Get the current cursor position
    const selectionStart = ele.selectionStart;
    const selectionEnd = ele.selectionEnd;

    // Insert the new text at the current cursor position
    const newText = ele.value.substring(0, selectionStart) + text + ele.value.substring(selectionEnd);
    onChange(newText);

    // Set the new cursor position after the newly inserted text
    ele.setSelectionRange(selectionStart + text.length, selectionStart + text.length);
  };
  return (
    <div className={styles['live-markdown__container']}>
      <div className={styles.wrapper}>
        <div className={styles['editor-box']}>
          <div className={styles.head}>
            <Visibility />
            MARKDOWN
          </div>
          <TextField
            id="markdown-content"
            placeholder="Markdown content"
            inputRef={textFieldRef}
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
  );
};
export default LiveMarkdown;
