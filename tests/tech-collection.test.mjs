import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";

// Run after building the site; these checks exercise the actual generated pages.
const dist = path.join(process.cwd(), "dist");
const category = "技术收纳";
const firstArticle = "/posts/easy-stock-guide/";
const columnRoute = "/tech-collection/";

function readPage(route) {
	return parse(fs.readFileSync(path.join(dist, route, "index.html"), "utf8"));
}

function routeOf(href) {
	return new URL(href, "https://amdeo.github.io/").pathname.replace(
		/^\/blog-astro-site(?=\/)/,
		"",
	);
}

function linkedRoutes(page) {
	return page.querySelectorAll("a[href]").map((link) =>
		routeOf(link.getAttribute("href")),
	);
}

function homePages() {
	const pagination = fs.readdirSync(dist, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
		.map((entry) => entry.name);
	return ["", ...pagination].map((route) => ({ route, page: readPage(route) }));
}

function postMetadata() {
	return JSON.parse(fs.readFileSync(path.join(dist, "api/allPostMeta.json"), "utf8"));
}

function columnEntries() {
	const column = readPage("tech-collection");
	const list = column.querySelector("#tech-collection-posts");
	assert.ok(list, "the dedicated column must contain an article list");
	return { column, links: list.querySelectorAll("a[href]") };
}

test("the parsed Easy Stock article belongs to 技术收纳", () => {
	const article = postMetadata().find((post) => post.id === "easy-stock-guide");
	assert.ok(article, "the published article must remain in the public post collection");
	assert.equal(article.category, category);
});

test("技术收纳 lists every published collection article and no unrelated article", () => {
	const expected = postMetadata().filter((post) => post.category === category);
	assert.ok(expected.length > 0, "the completed article must have been classified");
	const { column, links } = columnEntries();
	assert.ok(column.querySelectorAll("h1").some((heading) => heading.text.trim() === category));
	assert.deepEqual(
		links.map((link) => link.querySelector(".flex-1 .font-bold").text.trim()).sort(),
		expected.map((post) => post.title).sort(),
	);
	assert.ok(links.some((link) => routeOf(link.getAttribute("href")) === firstArticle));
});

test("collection articles are absent from the homepage and all pagination pages", () => {
	const hiddenRoutes = new Set([firstArticle]);
	if (fs.existsSync(path.join(dist, "tech-collection/index.html"))) {
		for (const link of columnEntries().links) {
			hiddenRoutes.add(routeOf(link.getAttribute("href")));
		}
	}
	const pages = homePages();
	assert.ok(pages.length > 1, "verify pagination, not just the first page");
	for (const { route, page } of pages) {
		assert.ok(page.querySelector("#post-list-container"), `missing home feed at /${route}`);
		for (const link of linkedRoutes(page)) {
			assert.ok(!hiddenRoutes.has(link), `collection article leaked into /${route}: ${link}`);
		}
	}
});

test("the column remains discoverable from homepage navigation", () => {
	const links = readPage("").querySelectorAll("a[href]");
	assert.ok(links.some((link) =>
		routeOf(link.getAttribute("href")) === columnRoute && link.text.includes(category),
	));
});

test("existing article URLs and the system design column continue to work", () => {
	const article = readPage("posts/easy-stock-guide");
	assert.match(article.querySelector("title").text, /Easy Stock/);
	assert.ok(article.text.includes("盘后复盘"));
	assert.ok(readPage("system-design").querySelectorAll("h1").some((heading) =>
		heading.text.trim() === "系统设计专题",
	));
	const allHomeLinks = new Set(homePages().flatMap(({ page }) => linkedRoutes(page)));
	assert.ok(allHomeLinks.has("/rtk/"), "ordinary blog posts must remain listed");
	assert.ok(![...allHomeLinks].some((route) => route.startsWith("/system-design/") && route !== "/system-design/"),
		"preserve the existing system-design homepage exclusion");
});
