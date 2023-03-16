// pages/drafts.tsx

import React, { useRef } from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Post from '@/components/Post';
import prisma from '@/lib/prisma';
import { IPost } from '@/types/index';
import EmptyState from '@/components/EmptyState';
import { getPosts, publishPost } from 'common/api/post';
import useLazyLoad, { LoadingCardList } from '@/utils/hooks/useLazyLoad';
import clsx from 'clsx';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: session.user?.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return {
    props: {
      drafts: drafts.map((draft) => ({
        ...draft,
        createdAt: String(draft.createdAt),
        updatedAt: String(draft.updatedAt),
      })),
    },
  };
};

type Props = {
  drafts: IPost[];
};

const Drafts: React.FC<Props> = ({ drafts }) => {
  const { data: session } = useSession();
  const triggerRef = useRef(null);
  const router = useRouter()
  const onGrabData = async (pageNum: number) => {
    return await getPosts({ pageNum, published: false });
  };
  const {
    data: list,
    loading,
    isLastPage,
  } = useLazyLoad({
    defaultState: { data: drafts, pagination: { current: 2, pageSize: 20 } },
    triggerRef,
    onGrabData,
  });

  const handlePublish = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, post: IPost) => {
    e.stopPropagation();
    await publishPost(post.id);
    router.reload()
  };

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  const renderDraftList = () => {
    return list.length === 0 ? (
      <EmptyState>You have no drafts.</EmptyState>
    ) : (
      list.map((post) => (
        <div key={post.id}>
          <Post post={post} onPublish={(e) => handlePublish(e, post)} />
        </div>
      ))
    );
  };

  return (
    <Layout>
      <h1>My Drafts</h1>
      <main className="flex flex-col gap-8 bg-slate-100 p-4 shadow-2xl rounded-2xl">
        {renderDraftList()}
        {isLastPage && <div className="flex items-center justify-center my-4">no more data...</div>}
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
      </main>
    </Layout>
  );
};

export default Drafts;
