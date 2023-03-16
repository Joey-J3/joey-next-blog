import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import CircularProgress from '@mui/material/CircularProgress';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Layout, { siteTitle } from '@/components/Layout';
import Post from '@/components/Post';
import EmptyState from '@/components/EmptyState';
import Card from '@/components/Card';
import prisma from '@/lib/prisma';
import utilStyles from '@/styles/utils.module.scss';
import useLazyLoad, { LoadingCardList } from '@/utils/hooks/useLazyLoad';
import type { IPost } from '@/types/index';
import type { Session } from 'next-auth';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { getPosts } from 'common/api/post';

export const getStaticProps: GetStaticProps = async () => {
  const postsData = await prisma.post.findMany({
    where: { published: true },
    orderBy: [
      {
        updatedAt: 'desc',
      },
      {
        author: {
          name: 'asc',
        },
      },
    ],
    include: {
      author: {
        select: { name: true },
      },
    },
    take: 10,
    skip: 0,
  });
  // get published post total
  const publishedPosts = await prisma.post.count({
    where: { published: true },
  });
  return {
    props: { postsData, total: publishedPosts },
    revalidate: 10,
  };
};

interface Props {
  postsData: IPost[];
}

export default function Home({ postsData }: Props) {
  const { data, status } = useSession();
  const [userData, setUserData] = useState<Session['user']>({});
  const triggerRef = useRef(null)

  const onGrabData = async (pageNum: number) => {
    return await getPosts({ published: true, pageNum, pageSize: 10 })
  }
  

  const {
    data: postList,
    loading,
    isLastPage,
  } = useLazyLoad({
    defaultState: { data: postsData, pagination: { pageSize: 10, current: 2 } },
    triggerRef,
    onGrabData,
  });

  useEffect(() => {
    if (data?.user) {
      setUserData(data.user);
    }
  }, [data]);

  const renderPostList = () => {
    return postList.length === 0 ? (
      <EmptyState>No Content Found!</EmptyState>
    ) : (
      postList.map((post) => (
        <div key={post.id}>
          <Post post={post} />
        </div>
      ))
    );
  };

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className="flex flex-row flex-nowrap w-full gap-4">
        <div className="flex-[3]">
          <Card>
            <div className="min-h-[50%]">
              <h1 className="mb-4 text-[#0f172a]">Public Feed</h1>
              <main className="flex flex-col gap-8">{renderPostList()}</main>
              {isLastPage && <div className="flex items-center justify-center my-4">到底了...</div>}
              <div ref={triggerRef} className={clsx('trigger', { visible: loading })}>
                {loading && (
                  <>
                    <LoadingCardList />
                    <div className="w-full flex items-center justify-center h-48">
                      <CircularProgress />
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
        <div className="flex-1">
          <Card>
            <div className="flex flex-col items-center gap-2 min-h-[4em]">
              {status === 'loading' ? (
                <div>Loading...</div>
              ) : status === 'authenticated' ? (
                <>
                  <p className="text-lg">个人信息</p>
                  <Image
                    priority
                    src={userData?.image || '/images/avatar.jpg'}
                    className={utilStyles.borderCircle}
                    height={144}
                    width={144}
                    alt={userData?.name || ''}
                  />
                  <h1 className="text-xl">{`${userData?.name}'s Blog`}</h1>
                </>
              ) : (
                <EmptyState prefix={<AccountCircleIcon />}>
                  <Link href="/api/auth/signin">
                    <h4>Click here to login in.</h4>
                  </Link>
                </EmptyState>
              )}
            </div>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
