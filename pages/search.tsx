import {  useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import BasicTabs, { TabPanel } from "@/components/BasicTabs";
import Card from "@/components/Card";
import Layout, { siteTitle } from "@/components/Layout";
import Post from "@/components/Post";
import SearchGroup from "@/components/SearchGroup";
import CircularProgress from "@mui/material/CircularProgress";
import { getPosts } from "common/api/post";
import { getUsers } from "common/api/user";
import utilStyles from '@/styles/utils.module.scss'
import prisma from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const postList = await prisma.post.findMany({
    where: {
      title: { contains: (query.searchText || "") as string, mode: 'insensitive' },
      published: true,
    },
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      author: {
        select: {
          id: true,
          name: true
        },
      },
    },
    take: 20,
  });
  return {
    props: {
      data: postList,
      query
    }
  }
}

interface Props {
  query: { [key: string]: any };
  data: Array<any>;
}

const tabs = ["Feed", "User"].map((label, index) => ({ label, value: index }));
const searchStrategy = new Map<number, { key: string; executor: Function }>([
  [
    0,
    {
      key: "title",
      executor: getPosts,
    },
  ],
  [1, { key: "name", executor: getUsers }],
]);
const Search: NextPage<Props> = function ({ query, data }) {
  const [searchText, setSearchText] = useState(query.searchText as string);
  const [tabValue, setTabValue] = useState(0);
  const [list, setList] = useState(data || []);
  const [loading, setLoading] = useState(false);
  const onSearch = async () => {
    setLoading(true);
    const { key, executor } = searchStrategy.get(tabValue) as {
      key: string;
      executor: Function;
    };
    const data = await executor({ [key]: searchText });
    setLoading(false);
    setList(data);
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    onSearch();
  }, [tabValue]);
  return (
    <Layout>
      <Head>{siteTitle}</Head>
      <section className="my-2">
        <SearchGroup
          value={searchText}
          onChange={(value) => setSearchText(value)}
          onClick={() => onSearch()}
        />
      </section>
      <section className="flex flex-row flex-nowrap w-full gap-4">
        <Card>
          <BasicTabs value={tabValue} tabs={tabs} onChange={handleTabChange}>
            <TabPanel index={0} value={tabValue}>
              <main className="flex flex-col gap-8">
                {loading ? (
                  <div className="w-full flex items-center justify-center h-48">
                    <CircularProgress />
                  </div>
                ) : (
                  list.map((post) => <Post post={post} key={post.id} />)
                )}
              </main>
            </TabPanel>
            <TabPanel index={1} value={tabValue}>
              <main className="flex flex-col gap-8">
                {loading ? (
                  <div className="w-full flex items-center justify-center h-48">
                    <CircularProgress />
                  </div>
                ) : (
                  list.length ? list.map((user) => (
                    <div key={user.id}>
                      <Link
                        href={`/user/${user.id}`}
                        className="cursor-pointer bg-white transition-shadow hover:shadow p-8 flex"
                      >
                        <Image
                          priority
                          src={user?.image || "/images/avatar.jpg"}
                          className={utilStyles.borderCircle}
                          height={144}
                          width={144}
                          alt={user?.name || ""}
                        />
                        <div>
                          <h2 className="text-[#0f172a]">{user.name}</h2>
                          <small>{user.email}</small>
                        </div>
                      </Link>
                    </div>
                  )) : <EmptyState />
                )}
              </main>
            </TabPanel>
          </BasicTabs>
        </Card>
      </section>
    </Layout>
  );
};

export default Search;
