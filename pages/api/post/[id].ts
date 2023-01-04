// pages/api/post/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// DELETE /api/post/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const postId = req.query.id;
  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({
      where: { id: postId as string },
    });
    res.json(post);
  } else if (req.method === 'POST') {
    const post = await prisma.post.update({
      where: { id: postId as string },
      data: req.body
    })
    res.json(post)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}
