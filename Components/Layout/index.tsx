import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import utilStyles from "@/styles/utils.module.scss";
import { Inter } from "@next/font/google";
import clsx from "clsx";
import Header from "../Header";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/utils/theme";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: ReactNode;
  home?: boolean;
}
const name = "Joey's Blog";
export const siteTitle = "Next.js Sample Website";

function Layout({ children, home }: LayoutProps) {
  return (
    <ThemeProvider theme={theme}>
      <div className={clsx(["w-full mb-24 pl-8 pr-8", inter.className])}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Learn how to build a personal website using Next.js"
          />
          <meta
            property="og:image"
            content={`https://og-image.vercel.app/${encodeURI(
              siteTitle
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <Header />
        <header className="flex flex-col items-center">
          {home ? (
            <>
              <Image
                priority
                src="/images/avatar.jpg"
                className={utilStyles.borderCircle}
                height={144}
                width={144}
                alt=""
              />
              <h1 className={utilStyles.heading2Xl}>{name}</h1>
            </>
          ) : (
            <>
              <Link href="/">
                <Image
                  priority
                  src="/images/avatar.jpg"
                  className={utilStyles.borderCircle}
                  height={108}
                  width={108}
                  alt=""
                />
              </Link>
              <h2 className={utilStyles.headingLg}>
                <Link href="/" className={utilStyles.colorInherit}>
                  {name}
                </Link>
              </h2>
            </>
          )}
        </header>
        <main>{children}</main>
        {!home && (
          <div className="mt-12">
            <Link href="/">← Back to home</Link>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default Layout;