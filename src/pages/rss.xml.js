import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const site = context.site?.toString().replace(/\/$/, '') ?? 'https://davidgentile.net';

  const items = posts.map((p) => `
    <item>
      <title><![CDATA[${p.data.title}]]></title>
      <link>${site}/${p.slug}</link>
      <guid>${site}/${p.slug}</guid>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
      <description><![CDATA[${p.data.description}]]></description>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>David Gentile</title>
    <link>${site}</link>
    <description>Notes and artefacts on AI, structure, and the intelligence interface.</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
