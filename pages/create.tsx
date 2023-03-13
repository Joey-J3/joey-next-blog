// pages/create.tsx

import { useRouter } from "next/router";
import Head from "next/head";
import Draft from "@/components/Draft";
import nProgress from "nprogress";
import type { IPost } from "../types";


const Create: React.FC = () => {
  const router = useRouter()
  const submitData = async (data: Partial<IPost>) => {
    try {
      nProgress.start()
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      nProgress.done()
      await router.push("/drafts");
    } catch (error) {
      console.error(error);
      nProgress.done()
    }
  };

  return (
    <>
    <Head>
      <title>Create Post</title>
    </Head>
    <Draft onSubmit={submitData} />
    </>
  );
};

export default Create;
