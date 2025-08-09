import rss from "@astrojs/rss";
import { getCollection, getEntry } from "astro:content";

import { SITE_CONFIG } from "@constants";

export async function GET(context) {
  const sermons = await getCollection("sermons", ({ data }) => !data.draft);

  const items = await Promise.all(
    sermons
      .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf())
      .map(async (item) => {
        const pastor = await getEntry("pastors", item.data.pastor.id);
        return {
          title: item.data.title,
          description: item.data.description,
          author: pastor?.data.name ?? "",
          pubDate: item.data.date,
          link: `/${item.collection}/${item.id}/`,
        };
      })
  );

  return rss({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    site: context.site,
    items,
  });
}
