import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.pubDate || p.data.pubDate.getTime() <= Date.now())
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Decisive Finance — Field notes',
    description:
      'Field notes from inside stalled funded-tech engagements. The walking dead pattern, decision-first finance, and how stalled Series A/B portcos come back.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
