import React from "react";
import Router from "next/router";
import Date from "@/components/Date";
import { IPost } from "../types";


const Post: React.FC<{ post: IPost }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/posts/[id]", `/posts/${post.id}`)} className="cursor-pointer bg-white transition-shadow hover:shadow p-8 flex flex-col">
      <h2 className="text-[#0f172a]">{post.title}</h2>
      <Date dateString={post.updatedAt} />
      <small>By {authorName}</small>
    </div>
  );
};

export default Post;
