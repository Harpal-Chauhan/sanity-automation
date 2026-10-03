import Link from "next/link";

const NotFound = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-xl text-center">

          <div className="text-8xl font-bold tracking-tight text-gray-200">
            404
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Page not found
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500">
            Sorry, the page you are looking for does not exist or may have
            been moved.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              ← Back to Home
            </Link>

            <Link
              href="/articles"
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
            >
              View Articles
            </Link>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-400">
              AI Blog Automation • Next.js + Groq + Sanity
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

export default NotFound