import React from 'react';
import Router from 'next/router';
import Date from '@/components/Date';
import { IPost } from '../types';
import Card from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Post: React.FC<{ post: IPost }> = ({ post }) => {
  const authorName = post.author ? post.author.name : 'Unknown author';
  return (
    <Card>
      <div
        onClick={() => Router.push('/posts/[id]', `/posts/${post.id}`)}
        className="cursor-pointer transition-shadow hover:shadow p-8 flex flex-col bg-inherit"
      >
        <Typography>{post.title}</Typography>
        {/* <h2 className="text-[#0f172a]">{post.title}</h2> */}
        <Date dateString={post.updatedAt} />
        <Typography>
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
