"use client";

import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const createArticle = async () => {
    if (!topic.trim()) {
      setMessage("Please enter a blog topic.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("AI blog draft created successfully.");
        setTopic("");
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              AI-powered content workflow
            </p>
          </Link>

          <Link
            href="/articles"
            className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900 sm:px-4 sm:text-sm"
          >
            Published Articles
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="flex min-h-[calc(100vh-85px)] items-center px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-3xl">
          {/* Heading */}
          <div className="text-center">
            <span className="text-sm font-medium text-gray-500">
              AI Content Generation
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Turn a topic into a blog draft
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:mt-5 sm:text-base sm:leading-7">
              Enter a topic and let AI create a blog draft automatically. Review
              and publish it from Sanity Studio.
            </p>
          </div>

          {/* Generator Card */}
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mt-12 sm:p-7">
            <label className="text-sm font-semibold text-gray-900">
              Blog Topic
            </label>

            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createArticle();
                }
              }}
              placeholder="e.g. What is React?"
              className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900"
            />

            <button
              onClick={createArticle}
              disabled={loading}
              className="mt-3 w-full rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating Blog..." : "Generate Blog"}
            </button>

            {message && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-center text-sm ${
                  message.includes("successfully")
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
