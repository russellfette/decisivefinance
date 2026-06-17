import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.pubDate || p.data.pubDate.getTime() <= Date.now())
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Decisive Finance: Perspectives',
    description:
      'Field notes on Decision-First Finance for operating companies, $5M to $50M. The profit paradox, the method, and a field guide for boards and advisors.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/perspectives/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
