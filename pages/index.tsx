import Head from 'next/head'
import Layout, { siteTitle } from '../components/Layout'
import utilStyles from '../styles/utils.module.scss'
import { IPost } from '../types';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import prisma from '../lib/prisma';
import Post from '@/components/Post';


// export function getStaticProps() {
//   const allPostsData = getSortedPostsData();
//   return {
//     props: {
//       allPostsData,
//     },
//   };
// }

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { allPostsData },
    revalidate: 10,
  };
};

interface Props {
  allPostsData: IPost[]
}

export default function Home({ allPostsData }: Props) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          <Link href={`/draft`}>GO to Live Markdown Editor</Link>
        </p>
      </section>
      {/* <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {(allPostsData || []).map(({ id, updatedAt, title }) => (
            <li className={utilStyles.listItem} key={id}>
            <Link href={`/posts/${id}`}>{title}</Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={updatedAt} />
            </small>
          </li>
          ))}
        </ul>
      </section> */}
      <section>
        <h1>Public Feed</h1>
        <main className='flex flex-col gap-8'>
          {allPostsData.map((post) => (
            <div key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </main>
      </section>
    </Layout>
  )
}
