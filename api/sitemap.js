import { createClient } from "@supabase/supabase-js";

// Use env variables
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const BASE_URL = "https://gloryofsport.com"; // Replace with your actual domain

// Helper to generate XML URL entry
const generateUrl = (path, updatedAt) => `
  <url>
    <loc>${BASE_URL}/${path}</loc>
    ${updatedAt ? `<lastmod>${new Date(updatedAt).toISOString()}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

export const GET = async () => {
  try {
    let urls = "";

    // 1️⃣ Static pages
    const staticPages = ["", "about", "contact", "privacy", "terms"];
    staticPages.forEach((path) => {
      urls += generateUrl(path);
    });

    // 2️⃣ Dynamic posts
    const { data: posts } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("is_published", true); // optional filter

    posts?.forEach((post) => {
      urls += generateUrl(`post/${post.slug}`, post.updated_at);
    });

    // 3️⃣ Dynamic news_posts
    const { data: news } = await supabase
      .from("news_posts")
      .select("slug, updated_at")
      .eq("is_published", true);

    news?.forEach((n) => {
      urls += generateUrl(`news/${n.slug}`, n.updated_at);
    });

    // 4️⃣ Generate final sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
};
