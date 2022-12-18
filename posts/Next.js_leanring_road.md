---
title: '基于 Next.js 构建自己的 Blog 网站的学习之路'
date: '2022-12-18'
---

# 前言
在开始之前，先来说说为什么我要做这样一件事情。其实一开始是在 b 站看到了一个大佬基于 Next.js+Tailwind Css 构建了自己的博客网站，而我想学习 next.js 很久了，再加上一直以来都没有过自己的博客，所以想借此机会构建自己的网站，并且学习 next.js。另外，之前自己在捣鼓 react18 的 SSR 流式渲染一直在碰壁，所以想借 next.js 看看能不能找到答案。
# Next.js 学习之路
## TODO List
## 一些技术点的记录
### Head 组件
If you want to customize the `<html>` tag, for example to add the `lang` attribute, you can do so by creating a `pages/_document.js` file. Learn more in the [custom `Document` documentation](https://nextjs.org/docs/advanced-features/custom-document).

### Script 组件
As we all know, including scripts by the HTML `<script>` element does not give a clear idea of when it would load with respect to the other JavaScript code fetched on the same page. If a particular script is render-blocking and can delay page content from loading, this can significantly impact performance.

Script component is an extension of the HTML `<script>` element and optimizes when additional scripts are fetched and executed.

### _app.js
The default export of `_app.js` is a top-level React component that wraps all the pages in your application. You can use this component to keep state when navigating between pages, or to add global styles as we're doing here. [Learn more about `_app.js` file](https://nextjs.org/docs/advanced-features/custom-app).

### utils.module.css
You can reuse these utility classes throughout your application, and you may even use utility classes in your `global.css` file. Utility classes refer to an approach of writing CSS selectors rather than a method (e.g. global styles, CSS modules, Sass, etc). Learn more about [utility-first CSS](https://tailwindcss.com/docs/utility-first).

## Markdown file 
You might have noticed that each markdown file has a metadata section at the top containing `title` and `date`. This is called YAML Front Matter, which can be parsed using a library called [gray-matter](https://github.com/jonschlinkert/gray-matter).


## Pre-rendering
Pre-rendering can result in better performance and [SEO](https://en.wikipedia.org/wiki/Search_engine_optimization).

When a page is loaded by the browser, its JavaScript code runs and makes the page fully interactive. (This process is called **hydration**.)
- [**Static Generation**](https://nextjs.org/docs/basic-features/pages#static-generation-recommended) is the pre-rendering method that generates the HTML at **build time**. The pre-rendered HTML is then *reused* on each request.
- [**Server-side Rendering**](https://nextjs.org/docs/basic-features/pages#server-side-rendering) is the pre-rendering method that generates the HTML on **each request**.

### When to use Static Generation VS. Server-side Rendering.
You should ask yourself: "Can I pre-render this page **ahead** of a user's request?" If the answer is yes, then you should choose [Static Generation](https://nextjs.org/docs/basic-features/pages#static-generation-recommended).

On the other hand, [Static Generation](https://nextjs.org/docs/basic-features/pages#static-generation-recommended) is **not** a good idea if you cannot pre-render a page ahead of a user's request. Maybe your page shows frequently updated data, and the page content changes on every request.

In that case, you can use [**Server-side Rendering**](https://nextjs.org/docs/basic-features/pages#server-side-rendering). It will be slower, but the pre-rendered page will always be up-to-date. Or you can skip pre-rendering and use client-side JavaScript to populate frequently updated data.


### getStaticProps
How does it work? Well, in Next.js, when you export a page component, you can also export an `async` function called [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation). If you do this, then:

-   [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) runs at build time in production, and…
-   Inside the function, you can fetch external data and send it as props to the page.

[`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) allows you to tell Next.js:  *“Hey, this page has some data dependencies — so when you pre-render this page at build time, make sure to resolve them first!”*

You can fetch external api or query database.

#### Only Allowed in a Page

[`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) can only be exported from a [**page**](https://nextjs.org/docs/basic-features/pages). You can’t export it from non-page files.

One of the reasons for this restriction is that React needs to have all the required data before the page is rendered.

#### getStaticPaths
[`getStaticPaths`](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation) However, this behavior can be enhanced using the [`fallback` key](https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-false) returned by [`getStaticPaths`](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation)

The returned list is *not* just an array of strings — (`paths`) it **must** be an array of objects that look like the comment above. Each object must have the `params` key and contain an object with the `id` key (because we’re using `[id]` in the file name). Otherwise, [`getStaticPaths`](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation) will fail. Learn more in the [`paths` key documentation](https://nextjs.org/docs/basic-features/data-fetching#the-paths-key-required)

##### Development vs. Production

-   In **development** (`npm run dev` or `yarn dev`), [`getStaticPaths`](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation) runs on *every request*.
-   In **production**, [`getStaticPaths`](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation) runs at *build time*.

##### Fallback
[`Fallback`](https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-false)
##### Router

If you want to access the Next.js router, you can do so by importing the [`useRouter`](https://nextjs.org/docs/api-reference/next/router#userouter) hook from [`next/router`](https://nextjs.org/docs/api-reference/next/router)


### `getServerSideProps`
Time to first byte ([TTFB](https://web.dev/time-to-first-byte/)) will be slower than [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) because the server must compute the result on every request, and the result cannot be cached by a [CDN](https://vercel.com/docs/edge-network/overview) without extra configuration.

## Data-fetching

## Dynamic Routes

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c61f8958d2a143f5a0d07d7e8bad98aa~tplv-k3u1fbpfcp-watermark.image?)
