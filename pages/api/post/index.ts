// pages/api/post/index.ts

import { getNanoId } from '@/utils/slugify';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, content, slug } = req.body;
  const nanoid = getNanoId()

  const session = await getSession({ req });
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      slug: slug + nanoid,
      author: { connect: { email: session?.user?.email as string } },
    }
  });
  res.json(result);
}
