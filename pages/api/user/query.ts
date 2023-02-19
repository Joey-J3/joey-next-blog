// pages/api/post/query.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// GET /api/user/query
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  const result = await prisma.user.findMany({
    where: {
      name: { contains: name as string, mode: 'insensitive' },
    },
    orderBy: {
      name: 'asc'
    },
  });
  res.json(result);
}
