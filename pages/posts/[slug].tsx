import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import clsx from "clsx";
import nProgress from "nprogress";
import ConfirmDialog from "@/components/ComfirmDialog";
import Layout from "@/components/Layout";
import Date from "@/components/Date";
import utilStyles from "@/styles/utils.module.scss";
import { deletePost, publishPost } from "common/api/post";
import { getPostBySlug } from "@/lib/post";
import type { IPost } from "@/types/index";
import type { GetServerSideProps } from "next";
import CenterLoading from "@/components/CenterLoadng";

const Markdown = dynamic(() => import('@/components/Markdown'), { loading: () => <CenterLoading />})

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let post = null
  try {
    post = await getPostBySlug(params?.slug as string)
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
  post: IPost;
}

const Post: React.FC<Props> = ({ post }) => {
  const { data: session, status } = useSession();
  const router = useRouter()
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === post?.author?.email;
  let title = post?.title;
  if (!post?.published) {
    title = `${title} (Draft)`;
  }

  const onClickPublish = async () => {
    const ng = nProgress.start()
    try {
      await publishPost(post.id)
      ng.done()
      await router.push("/");
    } catch (error) {
      console.error('Publish Post Fail with error:', error);
      ng.done()
    }
  }

  const onClickDelete = async () => {
    const ng = nProgress.start()
    try {
      await deletePost(post.id)
      ng.done()
      await router.push("/");
    } catch (error) {
      console.error('Delete Post Fail with error:', error);
      ng.done()
    }
  }
  return (
    <Layout className={["bg-gray-100", "p-8"]}>
      <Head>
        <title>{title}</title>
      </Head>

      <article className="px-8">
        <div className="flex justify-between items-center px-8">
          <h1 className={clsx(utilStyles.headingXl)}>{title}</h1>

          {userHasValidSession && postBelongsToUser && (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              {!post.published && (
                <Button
                  onClick={() => onClickPublish()}
                  variant="contained"
                >
                  Publish
                </Button>
              )}
              <Button
                onClick={() => router.push(`/edit/${post.id}`)}
                variant="outlined"
                color="primary"
              >
                Edit
              </Button>
              <ConfirmDialog
                content={"Are you sure to delete this post?"}
                onSubmit={() => onClickDelete()}
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
        <Markdown markdownInput={post.content} />
      </article>
    </Layout>
  );
};

export default Post;
