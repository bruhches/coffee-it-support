/**
 * Função serverless (Vercel) que protege o token do Instagram.
 * Configure INSTAGRAM_ACCESS_TOKEN nas Environment Variables do projeto.
 * 
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Instagram token is not configured on the server.' });
  }

  const params = new URLSearchParams({
    fields: 'id,media_url,permalink,like_count,comments_count',
    limit: '6',
    access_token: token
  });

  try {
    const response = await fetch(`https://graph.instagram.com/me/media?${params.toString()}`);
    const body = await response.json();

    if (!response.ok) {
      console.error('Instagram API error:', body?.error?.message || response.statusText);
      return res.status(response.status).json({ error: 'Unable to load Instagram feed.' });
    }

    // Só devolve ao navegador os campos necessários. O token nunca é retornado.
    const data = Array.isArray(body.data) ? body.data.map(({ id, media_url, permalink, like_count, comments_count }) => ({
      id, media_url, permalink, like_count, comments_count
    })) : [];

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Instagram proxy error:', error);
    return res.status(500).json({ error: 'Unable to load Instagram feed.' });
  }
}
