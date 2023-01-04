import Head from 'next/head'
import Image from 'next/image';
import Layout, { siteTitle } from '@/components/Layout'
import utilStyles from '@/styles/utils.module.scss'
import { IPost } from '@/types/index';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import prisma from '@/lib/prisma';
import Post from '@/components/Post';
import { useSession } from 'next-auth/react';


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
  const { data, status } = useSession()
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <header className="flex flex-col items-center">
        { status === 'loading' ? (
          'Loading...'
        ) : status === 'authenticated' ? (
          <>
            <Image
              priority
              src={data?.user?.image || '/images/avatar.jpg'}
              className={utilStyles.borderCircle}
              height={144}
              width={144}
              alt={data?.user?.name || ''}
            />
            <h1 className={utilStyles.heading2Xl}>{`${data?.user?.name}'s Blog`}</h1>
          </>
        ) : ''}
      </header>
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
        <h1 className="mb-4">Public Feed</h1>
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
