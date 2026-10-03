import { createClient } from "@sanity/client";
import { randomUUID } from "crypto";
import { Groq } from "groq-sdk";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-10-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { topic } = await request.json();

    if (!topic || !topic.trim()) {
      return Response.json(
        {
          success: false,
          message: "Topic is required.",
        },
        { status: 400 },
      );
    }

    // 1. Generate blog using AI
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `
You are a professional blog writer.

Generate a clear and useful blog article based on the user's topic.

IMPORTANT TITLE RULES:
- Keep the title very close to the original topic.
- Do not add subtitles.
- Do not add phrases like "A Beginner's Guide".
- Do not add phrases like "Complete Guide".
- Do not add phrases like "Everything You Need to Know".
- Do not make the title unnecessarily longer.
- If the topic is "What is React?", the title should be "What is React?"

IMPORTANT CONTENT RULES:
IMPORTANT CONTENT RULES:
- Keep the article between 300 and 450 words.
- Do not exceed 450 words.
- Use only 3 to 4 simple sections.
- Use short paragraphs.
- Keep the explanation beginner-friendly.
- Do not include code examples.
- Do not use Markdown symbols such as ##, **, *, or.
- Do not repeat information.
- Keep the article concise and useful.

Return ONLY valid JSON in this format:

{
  "title": "Topic-based title",
  "description": "Short description",
  "content": "Full blog content"
}

Do not add markdown code fences.
Do not add any extra text outside JSON.
`,
        },
        {
          role: "user",
          content: `Write a blog about: ${topic}`,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    // 2. Get AI Response
    const aiResponse = completion.choices[0].message.content;

    const blog = JSON.parse(aiResponse);

    // 3. Convert content into Sanity blocks
    const contentBlocks = blog.content
      .split("\n\n")
      .filter((paragraph) => paragraph.trim())
      .map((paragraph) => ({
        _key: randomUUID(),
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            marks: [],
            text: paragraph.trim(),
          },
        ],
      }));

    // 4. Create sanity draft
    await sanityClient.create({
      _id: `drafts.${randomUUID()}`,
      _type: "article",

      title: blog.title,

      slug: {
        _type: "slug",
        current: blog.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      },

      description: blog.description,

      content: contentBlocks,
    });

    return Response.json(
      {
        success: true,
        message: "Draft created successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("AI BLOG ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error?.message || "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
