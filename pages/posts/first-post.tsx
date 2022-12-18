import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import Layout from "../../Components/Layout";

export default function FirstPost() {
  return <Layout>
    <Head>
      <title>First post</title>
    </Head>
    <Script
      src="https://connect.facebook.net/en_US/sdk.js"
      strategy="lazyOnload"
      onLoad={() =>
        console.log(`script loaded correctly, window.FB has been populated`)
      }
    />
    <h1>First post</h1>
    <Link href="/">Back to Home</Link>
    <Image src="/images/profile.jpeg" alt="Your Name" width={144} height={144} />
  </Layout>;
}