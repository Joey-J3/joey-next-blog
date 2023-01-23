
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
    name: string | null;
    email: string | null;
  } | null;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreatePostAPIReqBody = { title: IPost['title']; content: IPost['content'] }
export type EditPostAPIReqBody = CreatePostAPIReqBody