import { useRef } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Post from '@/components/Post';
import prisma from '@/lib/prisma';
import CircularProgress from '@mui/material/CircularProgress';
import { getPosts } from 'common/api/post';
import type { IPost, IUser } from '@/types/index';
import type { GetServerSideProps } from 'next';
import Card from '@/components/Card';
import UserCard from '@/components/User/UserCard';
import useLazyLoad, { LoadingCardList } from '@/utils/hooks/useLazyLoad';
import clsx from 'clsx';

const getServerPostListByPage = async (userId?: string, pageNum = 1, pageSize = 20) => {
  const skip = (pageNum - 1) * pageSize;
  return await prisma.post.findMany({
    where: { published: true, authorId: userId },
    orderBy: [
      {
        updatedAt: 'desc',
      },
    ],
    include: {
      author: {
        select: { name: true },
      },
    },
    take: pageSize,
    skip,
  });
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: params?.id as string,
    },
  });
  if (!userData) {
    return {
      props: {
        userData,
      },
    };
  }
  const postsData = await getServerPostListByPage(params?.id as string);
  // get published post total
  const total = await prisma.post.count({
    where: { published: true, authorId: params?.id as string },
  });
  return {
    props: { userData, postsData, total },
  };
};

interface Props {
  userData: IUser;
  postsData: IPost[];
  total: number;
}

export default function UserPage({ userData, postsData, total }: Props) {
  const triggerRef = useRef(null);
  const onGrabData = async (pageNum: number) => {
    return await getPosts({ authorId: userData.id, pageNum });
  };
  const {
    data: postList,
    loading,
    isLastPage,
  } = useLazyLoad({
    defaultState: { data: postsData, pagination: { current: 2, pageSize: 20 } },
    triggerRef,
    onGrabData,
  });
  return (
    <Layout home>
      <Head>
        <title>{`${userData.name} 的个人主页`}</title>
      </Head>
      <section className="flex flex-row flex-nowrap w-full gap-4">
        <div className="flex-[3]">
          <Card>
            <>
              <main className="flex flex-col gap-8">
                {postList.map((post) => (
                  <Post post={post} key={post.id} />
                ))}
              </main>
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
            </>
          </Card>
        </div>
        <div className="flex-1">
          <UserCard userData={userData} otherInfo={{ total }} />
        </div>
      </section>
    </Layout>
  );
}
