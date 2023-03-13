import React from 'react';
import { useRouter } from 'next/router';
import Date from '@/components/Date';
import { IPost } from '../types';
import Card from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Post: React.FC<{ post: IPost }> = ({ post }) => {
  const router = useRouter()
  const authorName = post.author ? post.author.name : 'Unknown author';
  return (
    <Card>
      <div
        onClick={() => router.push('/posts/[id]', `/posts/${post.id}`)}
        className="cursor-pointer transition-shadow hover:shadow p-8 flex flex-col bg-inherit"
      >
        <Typography component='span'>{post.title}</Typography>
        {/* <h2 className="text-[#0f172a]">{post.title}</h2> */}
        <Date dateString={post.updatedAt} />
        <Typography component='span'>
          <small
            className="text-inherit
        "
          >
            By {authorName}
          </small>
        </Typography>
      </div>
    </Card>
  );
};

export default Post;
