// Builds the site's RSS 2.0 feed from the CMS posts list (docs/cms/posts.md → PublicPost). Each
// item is a teaser: the post's header and subHeader, and a link to its own page. A newsletter
// vendor that watches the feed emails its subscribers when an item with a new guid appears.

const XML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

// Text from the CMS as XML text, so a header with & or < never breaks the feed.
function escapeXml(text) {
  return text.replace(/[&<>"']/g, (character) => XML_ESCAPES[character]);
}

// An RFC 822 date, as RSS requires. postDate is a date only (YYYY-MM-DD), read as UTC midnight so
// no time zone shifts the day; a post without one uses its createdAt.
function pubDate(post) {
  const date = post.postDate
    ? new Date(`${post.postDate}T00:00:00Z`)
    : new Date(post.createdAt);
  return date.toUTCString();
}

function buildItem(post, postUrl) {
  // The guid is the post's id, never its URL or header: a retitled, republished or restored post
  // keeps its guid, so the vendor never emails it twice.
  const lines = [
    post.header && `<title>${escapeXml(post.header)}</title>`,
    `<link>${escapeXml(postUrl)}</link>`,
    post.subHeader && `<description>${escapeXml(post.subHeader)}</description>`,
    `<guid isPermaLink="false">${escapeXml(post.id)}</guid>`,
    `<pubDate>${pubDate(post)}</pubDate>`,
  ].filter(Boolean);
  return `<item>${lines.join("")}</item>`;
}

// posts in the order the CMS returns them (newest first). siteUrl has no trailing slash and
// postPath starts with one, e.g. "/blog".
export function buildFeed({
  posts,
  siteName,
  siteUrl,
  siteDescription,
  postPath,
}) {
  const items = posts.map((post) =>
    buildItem(post, `${siteUrl}${postPath}/${post.slug}`),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(siteName)}</title>`,
    `<link>${escapeXml(siteUrl)}</link>`,
    `<description>${escapeXml(siteDescription)}</description>`,
    "<language>en</language>",
    `<atom:link href="${escapeXml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml"/>`,
    ...items,
    "</channel>",
    "</rss>",
  ].join("\n");
}
