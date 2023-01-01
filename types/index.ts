
// export interface PostData {
//   id: string;
//   date: string;
//   title: string;
//   contentHtml: string;
// }

export type IPost = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}