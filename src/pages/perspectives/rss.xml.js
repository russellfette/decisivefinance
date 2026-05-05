import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.pubDate || p.data.pubDate.getTime() <= Date.now())
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Decisive Finance — Perspectives',
    description:
      'Field notes from inside stalled funded-tech engagements. The stalled-portco pattern, decision-first finance, and a field guide for investors and boards.',
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
