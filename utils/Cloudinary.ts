import { v2, UploadApiOptions } from 'cloudinary'
const cloudinary = v2

/**
 * CDN for static assets
 */

cloudinary.config({
  cloud_name: "dqckvpk9x",
  api_key: "229478717524999",
  api_secret: "JIUrLTCluqB_zJDECbTPqJ64s6A"
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
