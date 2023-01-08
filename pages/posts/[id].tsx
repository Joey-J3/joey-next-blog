import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Button, Box } from "@mui/material";
import Layout from "@/components/Layout";
import Date from "@/components/Date";
import Preview from "@/components/LiveMarkdown/Preview";
import type { IPost } from "@/types/index";
import utilStyles from "@/styles/utils.module.scss";
import clsx from "clsx";
import ConfirmDialog from "@/components/ComfirmDialog";
import { useEffect, useState } from "react";
import { deletePost, getPost, publishPost } from "api/post";

/**
 * Fetch necessary data for the blog post using params.id
 * @param {Record<string, any>} params
 * @returns {{Props}}
 */
// export async function getStaticProps({ params }: { params: Record<string, any> }) {
//   // const postData = await getPostData(params.id);
//   // return {
//   //   props: {
//   //     postData,
//   //   },
//   // };
//   const post = await prisma.post.findUnique({
//     where: {
//       id: String(params?.id),
//     },
//     include: {
//       author: {
//         select: { name: true },
//       },
//     },
//   });
//   return {
//     props: post,
//   };
// }
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

/**
 * Return a list of possible value for id
 * @returns {{paths: Array; fallback: boolean}}
 */
// export async function getStaticPaths() {
//   const paths = getAllPostIds();
//   return {
//     paths,
//     fallback: false,
//   };
// }

interface Props {
  post: IPost;
}

const Post: React.FC = () => {
  const { data: session, status } = useSession();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  useEffect(() => {
    if (router.query.id) {
      setLoading(true)
      getPost(router.query.id as string).then(post => setPost(post)).finally(() => setLoading(false))
    }
  }, [router.query.id]);
  useEffect(() => {
    console.log(post);
    
  }, [post]);
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }
  if (loading) {
    return <div>Loading...</div>
  }
  if (!post) {
    return <div>Not Found!</div>
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === post?.author?.email;
  let title = post.title;
  if (!post.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout className={["bg-gray-100", "p-8"]}>
      <Head>
        <title>{post.title}</title>
      </Head>

      <article className="bg-white">
        <div className="flex justify-between items-center px-8">
          <h1 className={clsx(utilStyles.headingXl)}>{title}</h1>

          {userHasValidSession && postBelongsToUser && (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              {!post.published && (
                <Button
                  onClick={() => publishPost(post.id)}
                  variant="contained"
                >
                  Publish
                </Button>
              )}
              <Button
                onClick={() => Router.push(`/edit/${post.id}`)}
                variant="outlined"
                color="primary"
              >
                Edit
              </Button>
              <ConfirmDialog
                content={"Are you sure to delete this post?"}
                onSubmit={() => deletePost(post.id)}
              >
                <Button
                  variant="contained"
                  color="error"
                >
                  Delete
                </Button>
              </ConfirmDialog>
            </Box>
          )}
        </div>
        <div
          className={clsx(utilStyles.lightText, "mb-4", "text-right", "pr-8")}
        >
          <span className="pr-4">
            By {post?.author?.name || "Unknown author"}
          </span>
          Last Modified: <Date dateString={post.updatedAt} />
        </div>
        <Preview markdownInput={post.content} />
      </article>
    </Layout>
  );
};

export default Post;
