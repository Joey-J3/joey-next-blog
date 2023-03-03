import type { IPost, PageInfo } from "@/types/index";

export async function getPostByID(id: string): Promise<IPost> {
  const post = await fetch(`/api/post/${id}`, {
    method: "GET",
  }).then(res => res.json())
  return post.data
}

export async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
}

export async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
}

type GetPostsProps = Partial<Omit<IPost, 'author'>& PageInfo>

export async function getPosts(params: GetPostsProps): Promise<IPost[]> {
  const validParams = Object.keys(params).reduce((res: any, key) => {
    const value = params[key as keyof typeof params]
    let newValue = typeof value === 'boolean' ? value ? 1 : 0 : value
    res[key as keyof typeof params] = newValue
    return res
  }, {})
  const searchParams = '?' + Object.keys(validParams).map(key => {
    return `${key}=${encodeURIComponent(validParams[key])}`;
  }).join('&');
  return await fetch(`/api/post/query${searchParams}`, {
    method: "GET",
  }).then(res => res.json())
}
