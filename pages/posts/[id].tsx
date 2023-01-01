import Head from "next/head";
import Date from "@/components/Date";
import Layout from "@/components/Layout";
import { getAllPostIds, getPostData } from '@/lib/post';
import prisma from '@/lib/prisma';
import utilStyles from '@/styles/utils.module.scss';
import style from './posts.module.scss'
import { IPost } from "@/types/index";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { useSession } from "next-auth/react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Button } from "@mui/material";

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
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  
  return {
    props: { post },
  };
};

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'DELETE',
  });
  Router.push('/');
}

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
  post: IPost
}

const Post: React.FC<Props> = ({ post }) => {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === post?.author?.email;
  let title = post.title;
  if (!post.published) {
    title = `${title} (Draft)`;
  }
  
  return <Layout>
  <Head>
    <title>{post.title}</title>
  </Head>
  <article>
    <h1 className={utilStyles.headingXl}>{title}</h1>
    <div className={utilStyles.lightText}>
      <Date dateString={post.updatedAt} />
    </div>
    <p>By {post?.author?.name || 'Unknown author'}</p>
    <ReactMarkdown>{post.content}</ReactMarkdown>
    {!post.published && userHasValidSession && postBelongsToUser && (
      <Button onClick={() => publishPost(post.id)} variant="contained">Publish</Button>
    )}
    {
      userHasValidSession && postBelongsToUser && (
        <Button onClick={() => deletePost(post.id)} variant="contained" color="error">Delete</Button>
      )
    }
  </article>
</Layout>
}

export default Post;
