import { sanityClient } from "@/lib/sanityClient";
import Link from "next/link";

const query = `
  *[
    _type == "article" &&
    slug.current == $slug &&
    !(_id in path("drafts.**"))
  ][0] {
    _id,
    title,
    description,
    content,
    slug
  }
`;

const ArticleDetailPage = async ({ params }) => {
  const { slug } = await params;

  const article = await sanityClient.fetch(query, { slug });

  if (!article) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center px-4 py-10 sm:px-6 sm:py-12">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg">
              ?
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
              Article not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              The article you are looking for may have been removed or is not
              available anymore.
            </p>

            <Link
              href="/articles"
              className="mt-7 inline-flex w-full justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
            >
              ← Back to Articles
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
          <Link href="/" className="min-w-0">
            <h2 className="truncate text-base font-bold text-gray-900 sm:text-lg">
              Sanity Automation
            </h2>

            <p className="hidden text-xs text-gray-500 sm:block">
              AI-powered publishing workflow
            </p>
          </Link>

          <Link
            href="/articles"
            className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900 sm:px-4 sm:text-sm"
          >
            All Articles
          </Link>
        </div>
      </header>

      {/* Article */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 md:py-14">
        {/* Back */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <span>←</span>
          Back to Articles
        </Link>

        {/* Article Header */}
        <header className="mt-7 border-b border-gray-200 pb-8 sm:mt-8 sm:pb-10">
          <div className="mb-4 inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500">
            Published Article
          </div>

          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            {article.title}
          </h1>

          {article.description && (
            <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
              {article.description}
            </p>
          )}
        </header>

        {/* Content + Sidebar */}
        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10">
          {/* Main Content */}
          <article className="min-w-0 rounded-2xl border border-gray-200 bg-white px-5 py-7 shadow-sm sm:px-7 sm:py-8 md:px-10 md:py-10">
            <div className="space-y-6 sm:space-y-7">
              {article.content?.map((block) => {
                const text = block.children
                  ?.map((child) => child.text)
                  .join("");

                if (!text?.trim()) return null;

                return (
                  <p
                    key={block._key}
                    className="break-words text-base leading-7 text-gray-700 sm:text-lg sm:leading-8"
                  >
                    {text}
                  </p>
                );
              })}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Article
              </p>

              <p className="mt-3 break-words text-sm font-medium leading-6 text-gray-900">
                {article.title}
              </p>

              <div className="my-5 border-t border-gray-100" />

              <Link
                href="/articles"
                className="block text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                ← View all articles
              </Link>

              <Link
                href="/"
                className="mt-3 block text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                + Create new article
              </Link>
            </div>
          </aside>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/articles"
            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            ← View all articles
          </Link>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
          >
            + Create New Article
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ArticleDetailPage;
