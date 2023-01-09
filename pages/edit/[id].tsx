import Router from "next/router";
import Draft from "@/components/Draft";
import { EditPostAPIReqBody, IPost } from "@/types/index";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let post = null
  try {
    post = await prisma.post.findUnique({
      where: {
        id: String(params?.id as string),
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
  } catch (error) {
    throw new Error(String(error))
  }
  return {
    props: { post },
  };
};


const Edit: React.FC<{ post: IPost }> = ({ post }) => {
  const submitData = async (data: EditPostAPIReqBody) => {
    try {
      await fetch(`/api/post/${post?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await Router.push("/posts/[id]", `/posts/${post?.id}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Draft isEdit={true} onSubmit={submitData} post={post} />
  );
};

export default Edit;
