import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const { data: posts = [], error: postsError } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    if (postsError) throw postsError;

    const { data: news = [], error: newsError } = await supabase
      .from('news_posts')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    if (newsError) throw newsError;

    const allPosts = [...posts, ...news];

    const urls = allPosts
      .map((item) => {
        const lastmod = item.updated_at
          ? new Date(item.updated_at).toISOString()
          : new Date().toISOString();
        return `
  <url>
    <loc>https://www.gloryofsport.com/${item.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.7</priority>
  </url>`;
      })
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
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
}
