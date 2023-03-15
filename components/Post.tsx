import React from 'react';
import { useRouter } from 'next/router';
import Date from '@/components/Date';
import { IPost } from '../types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { publishPost } from 'common/api/post';

interface Props {
  post: IPost;
  onPublish?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>
}

const Post: React.FC<Props> = ({ post, onPublish }) => {
  const router = useRouter();
  const authorName = post.author ? post.author.name : 'Unknown author';
  return (
    <Box
      onClick={() => router.push('/posts/[id]', `/posts/${post.id}`)}
      className="cursor-pointer transition-shadow hover:shadow p-8 bg-inherit"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box className="flex flex-col ">
          <Typography component="span">{post.title}</Typography>
          {/* <h2 className="text-[#0f172a]">{post.title}</h2> */}
          <Date dateString={post.updatedAt} />
          <Typography component="span">
            <small
              className="text-inherit
        "
            >
              By {authorName}
            </small>
          </Typography>
        </Box>
        {!post.published && (
          <Box>
            <Button variant="contained" color="primary" onClick={onPublish}>
              Publish
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Post;
