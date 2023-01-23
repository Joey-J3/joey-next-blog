// pages/drafts.tsx

import React from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Post from "@/components/Post";
import prisma from "@/lib/prisma";
import { IPost } from "@/types/index";

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
    props: { drafts: drafts.map(draft => ({ ...draft, createdAt: String(draft.createdAt), updatedAt: String(draft.updatedAt)})) },
  };
};

type Props = {
  drafts: IPost[];
};

const Drafts: React.FC<Props> = (props) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>My Drafts</h1>
      <main className="flex flex-col gap-8 bg-slate-100 p-4 shadow-2xl rounded-2xl">
        {props.drafts.map((post) => (
          <div
            key={post.id}
          >
            <Post post={post} />
          </div>
        ))}
      </main>
    </Layout>
  );
};

export default Drafts;
