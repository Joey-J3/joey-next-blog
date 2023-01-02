import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import Date from "@/components/Date";
import { IPost } from "../types";


const Post: React.FC<{ post: IPost }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/posts/[id]", `/posts/${post.id}`)} className="cursor-pointer bg-white transition-shadow hover:shadow p-8 flex flex-col">
      <h2>{post.title}</h2>
      <Date dateString={post.updatedAt} />
      <small>By {authorName}</small>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
};

export default Post;
