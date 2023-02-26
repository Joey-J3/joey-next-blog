import Link from "next/link";

export default function Custom404() {
  return <div className="h-full w-full m-auto">
    <div>
      <h1>404 - Page Not Found</h1>
      <Link href="/">Redirect to home page...</Link>
    </div>
  </div>
}