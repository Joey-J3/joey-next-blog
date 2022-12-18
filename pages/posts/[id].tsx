import Head from "next/head";
import Date from "../../Components/date";
import Layout from "../../Components/Layout";
import { getAllPostIds, getPostData } from '../../lib/post';
import utilStyles from '../../styles/utils.module.scss';
import style from './posts.module.scss'
import { PostData } from "../../types";

/**
 * Fetch necessary data for the blog post using params.id
 * @param {Record<string, any>} params
 * @returns {PostData}
 */
export async function getStaticProps({ params }: { params: Record<string, any> }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

/**
 * Return a list of possible value for id
 * @returns {{paths: Array; fallback: boolean}} 
 */
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

function Post({ postData }: { postData: PostData }) {
  return <Layout>
  <Head>
    <title>{postData.title}</title>
  </Head>
  <article>
    <h1 className={utilStyles.headingXl}>{postData.title}</h1>
    <div className={utilStyles.lightText}>
      <Date dateString={postData.date} />
    </div>
    <div className={style.container}>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
  </article>
</Layout>
}

export default Post;
