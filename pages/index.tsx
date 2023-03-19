import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Layout, { siteTitle } from '@/components/Layout';
import Post from '@/components/Post';
import prisma from '@/lib/prisma';
import utilStyles from '@/styles/utils.module.scss';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Card from '@/components/Card';
import type { IPost } from '@/types/index';
import type { Session } from 'next-auth';
import type { GetStaticProps } from 'next';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = await prisma.post.findMany({
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
  });
  // get published post total
  const publishedPosts = await prisma.post.count({
    where: { published: true },
  });
  return {
    props: { allPostsData, total: publishedPosts },
    revalidate: 10,
  };
};

interface Props {
  allPostsData: IPost[];
}

export default function Home({ allPostsData }: Props) {
  const { data, status } = useSession();
  const [userData, setUserData] = useState<Session['user']>({});
  const [postList, setPostList] = useState<IPost[]>([]);

  useEffect(() => {
    if (data?.user) {
      setUserData(data.user);
    }
  }, [data]);
  useEffect(() => {
    if (allPostsData && allPostsData.length) {
      setPostList(allPostsData);
    }
  }, [allPostsData]);

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
      <section className="flex flex-nowrap w-full gap-4 flex-col-reverse md:flex-row min-w-[256px]">
        <div className="flex-[3]">
          <Card>
            <div className="min-h-[50%]">
              <h1 className="mb-4 text-[#0f172a]">Public Feed</h1>
              <main className="flex flex-col gap-8">{renderPostList()}</main>
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
