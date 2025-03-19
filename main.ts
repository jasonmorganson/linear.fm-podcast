import puppeteer, { Page } from "npm:puppeteer";

type VideoData = {
  title: string;
  description: string;
  videoUrl: string;
  pubDate: Date;
};

const { log, error } = console;

const escapeXml = (str: string): string =>
  str.replace(
    /[<>&'"/]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c] || c,
  );

const launchBrowser = async () => {
  return await puppeteer.launch();
};

const extractVideos = async (page: Page): Promise<VideoData[]> => {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll("ol > li")).map(
      (element) => {
        const title = element.querySelector("h2")?.textContent;
        const description = element.querySelector("p:nth-of-type(2)")
          ?.textContent;
        const videoUrl = element
          .querySelector("video")
          ?.getAttribute("src");

        return { title, description, videoUrl };
      },
    );
  });
};

const processVideos = (rawVideos: VideoData[]): VideoData[] => {
  return rawVideos
    .filter((video) => video.videoUrl)
    .map((video, index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      return { ...video, pubDate: date };
    })
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
};

const scrapeVideos = async (
  url = "https://linear.app/fm",
): Promise<VideoData[]> => {
  log(`Scraping videos from ${url}...`);

  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.goto(url);

    const videos = await extractVideos(page);

    log(`Found ${videos.length} videos.`);

    return processVideos(videos);
  } catch {
    error(`Scraping videos failed!`);
    Deno.exit(1);
  } finally {
    await browser.close();
  }
};

const generatePodcastFeed = async (): Promise<string> => {
  const videos = await scrapeVideos();

  log("Generating podcast RSS feed...");

  const header = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Linear FM Podcast</title>
    <link>https://linear.app/fm</link>
    <language>en-us</language>
    <itunes:author>Linear App</itunes:author>
    <description>Audio versions of Linear FM videos</description>
    <itunes:image href="https://linear.app/favicon.ico"/>
    <itunes:category text="Technology"/>
    <itunes:explicit>false</itunes:explicit>`;

  const items = videos
    .map(
      ({ title, description, videoUrl, pubDate }) => `
    <item>
      <title>${escapeXml(title)}</title>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <enclosure url="${videoUrl}" length="0" type="video/mp4"/>
      <guid>${btoa(videoUrl)}</guid>
      <itunes:image href="https://linear.app/favicon.ico"/>
    </item>`,
    )
    .join("");

  const footer = `</channel></rss>`;

  return `${header}${items}${footer}`;
};

const main = async () => {
  const podcastFeed = await generatePodcastFeed();
  const headers = { "Content-Type": "application/xml" };

  log("Podcast feed ready.");

  Deno.serve(() => new Response(podcastFeed, { headers }));
};

main();
