import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role key for full access
);

export default async function handler(req, res) {
  try {
    // Fetch posts
    const { data: posts = [] } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    // Fetch news_posts
    const { data: news = [] } = await supabase
      .from('news_posts')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    // Combine all posts
    const allPosts = [...posts, ...news];

    const urls = allPosts
      .map(
        (item) => `
  <url>
    <loc>https://www.gloryofsport.com/${item.slug.includes('/') ? item.slug : 'article/' + item.slug}</loc>
    <lastmod>${new Date(item.updated_at).toISOString()}</lastmod>
    <priority>0.7</priority>
  </url>`
      )
      .join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.gloryofsport.com/</loc>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(sitemap);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating sitemap');
  }
}
