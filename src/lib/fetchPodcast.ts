export async function fetchPodcastMetadata(rssFeedUrl: string) {
  const corsProxy = "https://corsproxy.io/?";
  const url = corsProxy + encodeURIComponent(rssFeedUrl);

  const res = await fetch(url);
  const xml = await res.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "application/xml");

  const channel = xmlDoc.querySelector("channel");
  const podcastTitle = channel?.querySelector("title")?.textContent;

  const items = [...xmlDoc.querySelectorAll("item")].map((item) => ({
    title: item.querySelector("title")?.textContent,
    link: item.querySelector("link")?.textContent,
    pubDate: item.querySelector("pubDate")?.textContent,
    image: item.getElementsByTagName("itunes:image")[0]?.getAttribute("href"),
    audioUrl: item.querySelector("enclosure")?.getAttribute("url"),
  }));

  return { podcastTitle, items };
}
