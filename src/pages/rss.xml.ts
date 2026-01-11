import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection, getEntry } from "astro:content";

import { SITE_CONFIG } from "@constants";
import { parse } from "marked";

export async function GET(context: APIContext) {
  const sermons = await getCollection("sermons", ({ data }) => !data.draft);

  const items = await Promise.all(
    sermons
      .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf())
      .map(async (item) => {
        const pastor = await getEntry("pastors", item.data.pastor.id);
        const series = await getEntry("series", item.data.series.id);

        const htmlContent = parse(item.body!);

        const imageUrl = item.data.podcast?.image
          ? item.data.podcast?.image
          : `${context.site}/covers/default.webp`;

        return {
          title: item.data.title,
          description: item.data.description,
          author: pastor?.data.name || "",
          pubDate: item.data.date,
          link: `/${item.collection}/${item.id}/`,
          categories: series?.data ? [`${series.data.title}`] : undefined,
          content: `<![CDATA[${htmlContent}]]>`,
          customData: `
            <itunes:image href="${imageUrl}" />
          `,
          enclosure: item.data.podcast?.audio
            ? {
                url: item.data.podcast.audio,
                length: item.data.podcast.fileSize || 0,
                type: "audio/mpeg",
              }
            : undefined,
        } as RSSFeedItem;
      })
  );

  return rss({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    site: context.site!,
    xmlns: {
      content: "http://purl.org/rss/1.0/modules/content/",
      itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
    },
    customData: `
      <language>en-us</language>
      <category>Christianity</category>
      <image>
        <url>${context.site}/logo.png</url>
        <title>${SITE_CONFIG.title}</title>
        <link>${context.site}</link>
      </image>
    `,
    items,
  });
}
