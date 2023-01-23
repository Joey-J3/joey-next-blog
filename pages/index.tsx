import { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Layout, { siteTitle } from '@/components/Layout'
import Post from '@/components/Post';
import prisma from '@/lib/prisma';
import utilStyles from '@/styles/utils.module.scss'
import CircularProgress from '@mui/material/CircularProgress';
import SearchGroup from '@/components/SearchGroup';
import { getPosts } from 'common/api/post';
import type { IPost } from '@/types/index';
import type { Session } from 'next-auth';
import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = await prisma.post.findMany({
    where: { published: true },
    orderBy: [
      {
        updatedAt: 'desc',
      },
      {
        author: {
          name: 'asc'
        }
      }
    ],
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
  const [userData, setUserData] = useState<Session['user']>({});
  const [searchText, setSearchText] = useState('');
  const [postList, setPostList] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const onSearch = async () => {
    setLoading(true)
    const data = await getPosts({ title: searchText })
    setLoading(false)
    setPostList(data)
  }
  useEffect(() => {
    if(data?.user) {
      setUserData(data.user)
    }
  }, [data]);
  useEffect(() => {
    if (allPostsData && allPostsData.length) {
      setPostList(allPostsData)
    }
  }, [allPostsData]);
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
              src={userData?.image || '/images/avatar.jpg'}
              className={utilStyles.borderCircle}
              height={144}
              width={144}
              alt={userData?.name || ''}
            />
            <h1 className={utilStyles.heading2Xl}>{`${userData?.name}'s Blog`}</h1>
          </>
        ) : ''}
      </header>
      <section className='my-2'>
        <SearchGroup value={searchText} onChange={(value) => setSearchText(value)} onClick={() => onSearch()} />
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
      <section className='bg-slate-100 p-4 shadow-2xl rounded-2xl'>
        <h1 className="mb-4 text-[#0f172a]">Public Feed</h1>
        <main className='flex flex-col gap-8'>
          {loading ? (
            <div className='w-full flex items-center justify-center h-48'>
              <CircularProgress />
            </div>
          ) :  postList.map((post) => (
            <div key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </main>
      </section>
    </Layout>
  )
}
