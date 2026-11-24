// Tests for buildFeed: the RSS it builds for zero, one and several posts, the guid, escaping, and
// optional fields. The XML is parsed with jsdom, which throws on XML that isn't well formed.
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

import { buildFeed } from "./buildFeed";

const SITE = {
  siteName: "Test Site",
  siteUrl: "https://www.example.com",
  siteDescription: "A test site",
  postPath: "/blog",
};

// A PublicPost as docs/cms/posts.md shapes it.
function makePost(overrides = {}) {
  return {
    id: "post-1",
    slug: "first-post",
    header: "First post",
    subHeader: "A short teaser",
    postDate: "2026-11-20",
    createdAt: "2026-11-19T15:30:00.000Z",
    updatedAt: "2026-11-19T15:30:00.000Z",
    body: [{ type: "paragraph", text: "Hello" }],
    ...overrides,
  };
}

function parseFeed(posts) {
  const xml = buildFeed({ ...SITE, posts });
  return new JSDOM(xml, { contentType: "text/xml" }).window.document;
}

function itemField(item, name) {
  return item.getElementsByTagName(name)[0]?.textContent;
}

describe("buildFeed", () => {
  it("builds a valid channel with no items when there are no posts", () => {
    const feed = parseFeed([]);

    expect(feed.documentElement.getAttribute("version")).toBe("2.0");
    expect(itemField(feed, "title")).toBe("Test Site");
    expect(itemField(feed, "link")).toBe("https://www.example.com");
    expect(itemField(feed, "description")).toBe("A test site");
    expect(feed.getElementsByTagName("item")).toHaveLength(0);
  });

  it("builds one item from a post's fields", () => {
    const feed = parseFeed([makePost()]);

    const [item] = feed.getElementsByTagName("item");
    expect(itemField(item, "title")).toBe("First post");
    expect(itemField(item, "description")).toBe("A short teaser");
    expect(itemField(item, "link")).toBe(
      "https://www.example.com/blog/first-post",
    );
    expect(itemField(item, "pubDate")).toBe("Fri, 20 Nov 2026 00:00:00 GMT");
  });

  it("keeps several posts in the order given", () => {
    const posts = [
      makePost({ id: "post-3", slug: "third" }),
      makePost({ id: "post-2", slug: "second" }),
      makePost({ id: "post-1", slug: "first" }),
    ];

    const feed = parseFeed(posts);

    const guids = [...feed.getElementsByTagName("guid")].map(
      (guid) => guid.textContent,
    );
    expect(guids).toEqual(["post-3", "post-2", "post-1"]);
  });

  it("uses the post's id as a guid that isn't a permalink", () => {
    const feed = parseFeed([makePost({ id: "abc123" })]);

    const [guid] = feed.getElementsByTagName("guid");
    expect(guid.textContent).toBe("abc123");
    expect(guid.getAttribute("isPermaLink")).toBe("false");
  });

  it("escapes &, <, > and quotes in a header", () => {
    const header = `Fish & <Chips> "today" isn't it`;

    const xml = buildFeed({ ...SITE, posts: [makePost({ header })] });
    const feed = new JSDOM(xml, { contentType: "text/xml" }).window.document;

    expect(xml).toContain(
      "Fish &amp; &lt;Chips&gt; &quot;today&quot; isn&apos;t it",
    );
    expect(itemField(feed.getElementsByTagName("item")[0], "title")).toBe(
      header,
    );
  });

  it("leaves out a null header and subHeader", () => {
    const feed = parseFeed([makePost({ header: null, subHeader: null })]);

    const [item] = feed.getElementsByTagName("item");
    expect(item.getElementsByTagName("title")).toHaveLength(0);
    expect(item.getElementsByTagName("description")).toHaveLength(0);
  });

  it("dates a post without a postDate by its createdAt", () => {
    const feed = parseFeed([makePost({ postDate: null })]);

    const [item] = feed.getElementsByTagName("item");
    expect(itemField(item, "pubDate")).toBe("Thu, 19 Nov 2026 15:30:00 GMT");
  });
});
