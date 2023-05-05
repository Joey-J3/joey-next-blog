import { v2, UploadApiOptions } from 'cloudinary'
const cloudinary = v2

export const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export const api_key = process.env.CLOUDINARY_API_KEY

export const api_secret = process.env.CLOUDINARY_API_SECRET

/**
 * CDN for static assets
 */

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

export async function upload(file: string, options?: UploadApiOptions) {
  return await cloudinary.uploader.upload(file, options)
}

/**
 * Generate cdn url with variable params
 * @example
 * returns https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag
 * generateUrl("olympic_flag", { width: 100, height: 150, Crop: 'fill' })
 */
export const generateUrl = cloudinary.url
