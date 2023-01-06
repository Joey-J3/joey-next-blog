import Router, { useRouter } from "next/router";
import Draft from "@/components/Draft";
import { EditPostAPIReqBody, IPost } from "@/types/index";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  console.info('Getting Post By ID.')
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
  const [ID, setID] = useState("");
  const router = useRouter()
  
  const submitData = async (data: EditPostAPIReqBody) => {
    try {
      await fetch(`/api/post/${ID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await Router.push("/posts/[id]", `/posts/${ID}`);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const id = router.query.id
    if (id && typeof id === 'string') {
      setID(id)
    }
  }, [router.query.id]);

  return (
    <Draft isEdit={true} onSubmit={submitData} post={post} />
  );
};

export default Edit;
