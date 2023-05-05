import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './Layout';
import LiveMarkdown from './LiveMarkdown';
import type { CreatePostAPIReqBody, EditPostAPIReqBody, IPost } from '@/types/index';
import { slugify } from '@/utils/slugify';

interface Props {
  isEdit?: boolean;
  post?: IPost;
  onSubmit: (data: EditPostAPIReqBody | CreatePostAPIReqBody, e: React.SyntheticEvent) => Promise<void>;
}

const Draft: React.FC<Props> = ({ isEdit, post, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter()

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const slug = slugify(title);
      const body = { title, content, slug };
      await onSubmit(body, e);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (post) {
      setTitle(post?.title);
      setContent(post?.content);
    }
  }, [post]);

  return (
    <Layout>
      <Box
        component="form"
        noValidate={true}
        sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        onSubmit={submitData}
        autoComplete="off"
        className="w-full"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1>{title || 'New Draft'}</h1>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Button disabled={!content || !title} variant="contained" type="submit" color="primary">
              {isEdit ? 'Save' : 'Create'}
            </Button>
            <Button variant="outlined" type="reset" onClick={() => router.back()}>
              Cancel
            </Button>
          </Box>
        </Box>
        <TextField
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          type="text"
          value={title}
          className="w-full p-2 my-2 rounded"
        />
        <div style={{ flex: 1 }}>
          <LiveMarkdown markdownInput={content} onChange={setContent} />
        </div>
      </Box>
    </Layout>
  );
};

export default Draft;
