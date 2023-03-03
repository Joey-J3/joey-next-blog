import { UIEvent, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Layout, { siteTitle } from "@/components/Layout";
import Post from "@/components/Post";
import prisma from "@/lib/prisma";
import CircularProgress from "@mui/material/CircularProgress";
import { getPosts } from "common/api/post";
import type { IPost, IUser } from "@/types/index";
import type { GetServerSideProps } from "next";
import Card from "@/components/Card";
import UserCard from "@/components/User/UserCard";
import useLazyLoad from "@/utils/hooks/useLazyLoad";
import clsx from "clsx";

const getUserPagePostListByPage = async (
  userId: string,
  pageNum = 1,
  pageSize = 20
) => {
  const skip = (pageNum - 1) * pageSize;
  return await prisma.post.findMany({
    where: { published: true, authorId: userId },
    orderBy: [
      {
        updatedAt: "desc",
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
  const postsData = await getUserPagePostListByPage(params?.id as string);
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
    defaultState: { data: postsData, currentPage: 2 },
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
              {isLastPage && (
                <div className="flex items-center justify-center my-4">
                  到底了...
                </div>
              )}
              <div
                ref={triggerRef}
                className={clsx("trigger", { visible: loading })}
              >
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

export const LoadingCard: React.FC = () => {
  return (
    <div className="w-full rounded overflow-hidden shadow-lg m-2">
      <div className="w-full h-64 bg-gray-300 animate-pulse"></div>
      <div className="px-6 py-4 items-center">
        <div className="font-regular text-xl mb-2 w-20 h-4 bg-gray-300 animate-pulse"></div>
      </div>
    </div>
  );
};

export const LoadingCardList = () => {
  const loadPages = [1, 2, 3, 4, 5, 6];
  return (
    <div className="grid grid-cols-3 gap-4 content-start">
      {loadPages.map((num) => {
        return <LoadingCard key={num} />;
      })}
    </div>
  );
};
