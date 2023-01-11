import type { IPost } from "@/types/index";

export async function getPost(id: string): Promise<IPost> {
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