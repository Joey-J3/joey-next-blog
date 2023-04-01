import { convertToPinyin } from 'tiny-pinyin'
import { nanoid } from 'nanoid'

export const slugify = (text: string) =>
  convertToPinyin(text)
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text

export const getNanoId = () => nanoid(10)
