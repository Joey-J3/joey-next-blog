import { IUser } from "@/types/index";

export async function getUsers(params: Partial<IUser>): Promise<IUser[]> {
  return await fetch(`/api/user/query?name=${params.name}`, {
    method: "GET",
  }).then(res => res.json())
}