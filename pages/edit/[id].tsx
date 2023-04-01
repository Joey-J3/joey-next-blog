import { useRouter } from "next/router";
import Draft from "@/components/Draft";
import { getPostByID } from "@/lib/post";
import type { EditPostAPIReqBody, IPost } from "@/types/index";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let post = null
  try {
    post = await getPostByID(params?.id as string)
  } catch (error) {
    throw new Error(String(error))
  }
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: { post },
  };
};

interface Props {
  post: IPost
}


const Edit: React.FC<Props> = ({ post }) => {
  const router = useRouter()
  const submitData = async (data: EditPostAPIReqBody) => {
    try {
      const updatedPost = await fetch(`/api/post/${post?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(res => res.json());
      
      await router.push("/posts/[slug]", `/posts/${updatedPost.slug}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Draft isEdit={true} onSubmit={submitData} post={post} />
  );
};

export default Edit;
