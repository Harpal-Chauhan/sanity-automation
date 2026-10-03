import { sanityClient } from "@/lib/sanityClient";
import Link from "next/link";

const query = `
  *[
    _type == "article" &&
    !(_id in path("drafts.**"))
  ] | order(_createdAt desc) {
    _id,
    title,
    description,
    slug
  }
`;

const ArticlePage = async () => {
  const articles = await sanityClient.fetch(query);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-6">
          <Link href="/" className="min-w-0">
            <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
              Sanity Automation
            </h1>

            <p className="hidden text-xs text-gray-500 sm:block">
              Published Articles
            </p>
          </Link>

          <Link
            href="/"
            className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900 sm:px-4 sm:text-sm"
          >
            ← Home
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        {/* Heading */}
        <div className="flex flex-col gap-5 border-b border-gray-200 pb-8 sm:pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Blog Library</p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Published Articles
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Browse all articles published from Sanity CMS.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
          >
            + Create Article
          </Link>
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`/articles/${article.slug?.current}`}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md sm:p-6"
              >
                {/* Top */}
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Article
                  </span>

                  <span className="text-gray-400 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-5 line-clamp-2 text-lg font-semibold leading-7 text-gray-900 sm:text-xl">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                  {article.description}
                </p>

                {/* Read */}
                <div className="mt-auto pt-6">
                  <div className="border-t border-gray-100 pt-4">
                    <span className="text-sm font-medium text-gray-700 transition group-hover:text-gray-900">
                      Read article →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center sm:mt-10 sm:px-6 sm:py-16">
            <h3 className="text-lg font-semibold text-gray-900">
              No published articles yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Create a blog using AI, review it in Sanity Studio, and publish it
              to see it here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Create First Article
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default ArticlePage;
