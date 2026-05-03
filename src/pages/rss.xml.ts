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

        const imageUrl = item.data?.image ? item.data.image : `${context.site}logo.png`;

        const primaryPodcastFieldsExist =
          !!item.data.podcast?.duration && !!item.data.podcast?.audio;

        const itunesPodcast = primaryPodcastFieldsExist
          ? `
            <itunes:duration>${item.data.podcast!.duration}</itunes:duration>
            <itunes:episodeType>full</itunes:episodeType>
            <itunes:author>${pastor?.data.name || SITE_CONFIG.title}</itunes:author>
            <itunes:summary>${item.data.description}</itunes:summary>
          `
          : "";

        return {
          title: item.data.title,
          description: item.data.description,
          author: pastor?.data.name || SITE_CONFIG.title,
          pubDate: item.data.date,
          link: `/${item.collection}/${item.id}/`,
          categories: series?.data ? [`${series.data.title}`] : undefined,
          content: `<![CDATA[${htmlContent}]]>`,
          customData: `
            <itunes:image href="${imageUrl}" />
            ${itunesPodcast}
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
      <itunes:author>${SITE_CONFIG.title}</itunes:author>
      <itunes:type>episodic</itunes:type>
      <itunes:explicit>no</itunes:explicit>
      <itunes:category text="Religion &amp; Spirituality">
        <itunes:category text="Christianity" />
      </itunes:category>
      <image>
        <url>${context.site}logo.png</url>
        <title>${SITE_CONFIG.title}</title>
        <link>${context.site}</link>
      </image>
    `,
    items,
  });
}
