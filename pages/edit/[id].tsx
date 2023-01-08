import Router, { useRouter } from "next/router";
import Draft from "@/components/Draft";
import { EditPostAPIReqBody, IPost } from "@/types/index";
import { useEffect, useState } from "react";
import { getPost } from "api/post";

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   console.info('Getting Post By ID.')
//   let post = null
//   try {
//     post = await prisma.post.findUnique({
//       where: {
//         id: String(params?.id as string),
//       },
//       include: {
//         author: {
//           select: { name: true, email: true },
//         },
//       },
//     });
//   } catch (error) {
//     throw new Error(String(error))
//   }
//   return {
//     props: { post },
//   };
// };


const Edit: React.FC = () => {
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  
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
  useEffect(() => {
    const id = router.query.id
    if (id && typeof id === 'string') {
      setLoading(true)
      getPost(id).then(post => setPost(post)).finally(() => setLoading(false))
    }
  }, [router.query.id]);

  if (loading) {
    return <div>Loading...</div>
  }

  if (!post) {
    return <div>Not Found</div>
  }

  return (
    <Draft isEdit={true} onSubmit={submitData} post={post} />
  );
};

export default Edit;
