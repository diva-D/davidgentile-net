import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const site = context.site?.toString().replace(/\/$/, '') ?? 'https://davidgentile.net';
  const feedUrl = `${site}/rss.xml`;

  const escape = (s = '') =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escape(p.data.title)}</title>
      <link>${site}/${p.slug}</link>
      <guid isPermaLink="true">${site}/${p.slug}</guid>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
      <description><![CDATA[${p.data.description}]]></description>
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>David Gentile</title>
    <link>${site}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Notes and artefacts on AI, structure, and the intelligence interface.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
