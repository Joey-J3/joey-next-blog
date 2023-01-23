// pages/api/post/query.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// POST /api/post/query
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, published } = req.query;

  const result = await prisma.post.findMany({
    where: {
      title: { contains: title as string, mode: 'insensitive' },
      published: (published === '0' || published === '1') ? published === '1' : undefined,
    },
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      author: {
        select: {
          id: true,
          name: true
        },
      },
    },
  });
  res.json(result);
}
