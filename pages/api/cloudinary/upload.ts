import { NextApiRequest, NextApiResponse } from 'next';
import { generateUrl, upload } from '@/utils/Cloudinary';

// POST /api/cloudinary/upload
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { resource } = req.body;
  
  const result = await upload(resource, {
    responsive_breakpoints:
    {
      create_derived: true,
      bytes_step: 20000,
      min_width: 200,
      max_width: 1000
    }
  })
  
  const transformUrl = generateUrl(result.public_id)

  res.json({
    ...result,
    transformUrl
  })
}
