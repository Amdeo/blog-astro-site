import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const repoRoot = process.cwd();
const distRoot = path.join(repoRoot, "dist");
const floatingControlsPath = path.join(
	repoRoot,
	"src/components/control/FloatingControls.astro",
);

function readText(relativePath) {
	return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function walkTextFiles(rootDir) {
	const files = [];
	const entries = fs.readdirSync(rootDir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(rootDir, entry.name);
		if (entry.isDirectory()) {
			files.push(...walkTextFiles(fullPath));
			continue;
		}
		if (/\.(html|js|json|xml|txt|css)$/.test(entry.name)) {
			files.push(fullPath);
		}
	}
	return files;
}

function extractInlineScript(source) {
	const match = source.match(/<script is:inline>([\s\S]*?)<\/script>/);
	assert.ok(match, "expected FloatingControls.astro to include inline script");
	return match[1];
}

test("built site does not emit root-relative asset paths that break GitHub Pages project deployment", () => {
	assert.ok(fs.existsSync(distRoot), "expected dist/ to exist; run a build first");

	const offenders = [];
	const htmlForbiddenPatterns = [
		/\/blog-astro-site\/src\/assets\/blog-placeholder[^"' )]*/g,
		/\/blog-astro-site\/blog-astro-site\/(?:assets|images|favicon)\//g,
		/src="\/(?:assets|images|favicon)\//g,
		/href="\/(?:assets|images|favicon)\//g,
		/url\(["']?\/(?:assets|images|favicon)\//g,
	];

	for (const filePath of walkTextFiles(distRoot)) {
		const content = fs.readFileSync(filePath, "utf8");
		const patterns = filePath.endsWith(".html") ? htmlForbiddenPatterns : [];
		for (const pattern of patterns) {
			const matches = content.match(pattern);
			if (!matches) {
				continue;
			}
			offenders.push({
				file: path.relative(repoRoot, filePath),
				match: matches[0],
			});
		}
	}

	const calendarBundle = walkTextFiles(path.join(distRoot, "_astro")).find(
		(filePath) => path.basename(filePath).startsWith("Calendar."),
	);
	assert.ok(calendarBundle, "expected built calendar bundle to exist");

	const calendarContent = fs.readFileSync(calendarBundle, "utf8");
	assert.doesNotMatch(
		calendarContent,
		/fetch\(["']\/api\/calendar-data\.json\/?["']\)/,
		"calendar bundle should not fetch root-relative API URLs",
	);

	assert.deepEqual(
		offenders,
		[],
		`unexpected root-relative asset references in build output:\n${JSON.stringify(offenders.slice(0, 20), null, 2)}`,
	);
});

test("built site no longer ships legacy body font assets after LXGW WenKai migration", () => {
	assert.ok(fs.existsSync(distRoot), "expected dist/ to exist; run a build first");

	const astroRoot = path.join(distRoot, "_astro");
	assert.ok(fs.existsSync(astroRoot), "expected dist/_astro to exist");

	const cssFiles = walkTextFiles(astroRoot).filter((filePath) =>
		filePath.endsWith(".css"),
	);
	assert.ok(cssFiles.length > 0, "expected built CSS files to exist");

	const offenders = [];
	for (const filePath of cssFiles) {
		const content = fs.readFileSync(filePath, "utf8");
		for (const pattern of [
			/ZenMaruGothic-Medium\.ttf/g,
			/loli\.ttf/g,
			/font-family:\s*"?ZenMaruGothic-Medium"?/g,
			/font-family:\s*"?萝莉体 第二版"?/g,
		]) {
			const matches = content.match(pattern);
			if (!matches) {
				continue;
			}
			offenders.push({
				file: path.relative(repoRoot, filePath),
				match: matches[0],
			});
		}
	}

	assert.deepEqual(
		offenders,
		[],
		`unexpected legacy font references in built CSS:\n${JSON.stringify(offenders, null, 2)}`,
	);
});

test("rtk permalink page links back into the blog using the project base path", () => {
	const rtkHtmlPath = path.join(distRoot, "rtk", "index.html");
	assert.ok(
		fs.existsSync(rtkHtmlPath),
		"expected dist/rtk/index.html to exist; run a build first",
	);

	const html = fs.readFileSync(rtkHtmlPath, "utf8");
	assert.match(
		html,
		/href="\/blog-astro-site\/about\/"/,
		"expected rtk page to link to the blog about page with the GitHub Pages base path",
	);
	assert.doesNotMatch(
		html,
		/href="\/about\/"/,
		"rtk page should not use a root-relative about URL",
	);
});

test("floating controls inline script can be executed twice without redeclaration errors", () => {
	const source = fs.readFileSync(floatingControlsPath, "utf8");
	const script = extractInlineScript(source);

	const documentElement = {
		classList: { add() {}, remove() {} },
		style: { setProperty() {}, removeProperty() {} },
	};

	const documentStub = {
		documentElement,
		addEventListener() {},
		removeEventListener() {},
		querySelectorAll() {
			return [];
		},
		getElementById() {
			return null;
		},
	};

	class MutationObserverStub {
		constructor(callback) {
			this.callback = callback;
		}
		observe() {}
		disconnect() {}
	}

	const context = vm.createContext({
		Map,
		MutationObserver: MutationObserverStub,
		clearTimeout,
		setTimeout,
		requestAnimationFrame(callback) {
			callback();
			return 1;
		},
		getComputedStyle() {
			return {
				getPropertyValue() {
					return "4";
				},
			};
		},
		document: documentStub,
		window: {
			__floatingControlObservers: new Map(),
			addEventListener() {},
			removeEventListener() {},
		},
	});

	assert.doesNotThrow(() => {
		vm.runInContext(script, context);
		vm.runInContext(script, context);
	});
});

test("source files do not hardcode browser-visible root-relative paths that bypass Astro base handling", () => {
	const offenders = [
		{
			file: "src/components/control/BackToHome.astro",
			pattern: 'define:vars={{ homeUrl: "/" }}',
		},
		{
			file: "src/layouts/Layout.astro",
			pattern: 'href="/pio/static/pio.css"',
		},
		{
			file: "src/pages/404.astro",
			pattern: 'href="/"',
		},
		{
			file: "src/pages/projects.astro",
			pattern: 'src="/js/filter-tabs-handler.js"',
		},
		{
			file: "src/pages/devices.astro",
			pattern: 'src="/js/devices-page-handler.js"',
		},
		{
			file: "src/pages/albums/[id]/index.astro",
			pattern: 'href="/albums/"',
		},
		{
			file: "src/components/widgets/calendar/components/PostList.svelte",
			pattern: 'href="/posts/{post.id}/"',
		},
		{
			file: "src/components/features/pio/Pio.svelte",
			pattern: 'loadScript("/pio/static/l2d.js"',
		},
	];

	const matches = offenders.filter(({ file, pattern }) =>
		readText(file).includes(pattern),
	);

	assert.deepEqual(
		matches,
		[],
		`unexpected hardcoded root-relative browser paths remain in source:\n${JSON.stringify(matches, null, 2)}`,
	);
});

test("astro config and pages workflow use explicit public base env vars with root fallback", () => {
	const astroConfig = readText("astro.config.mjs");
	const deployWorkflow = readText(".github/workflows/deploy.yml");

	assert.match(
		astroConfig,
		/process\.env\.PUBLIC_BASE_PATH/,
		"expected astro.config.mjs to read PUBLIC_BASE_PATH",
	);
	assert.doesNotMatch(
		astroConfig,
		/DEPLOY_TARGET\s*===\s*["']github-pages["']/,
		"astro.config.mjs should not hardcode a github-pages deployment target switch",
	);
	assert.match(
		deployWorkflow,
		/PUBLIC_BASE_PATH:/,
		"expected GitHub Pages workflow to set PUBLIC_BASE_PATH",
	);
	assert.match(
		deployWorkflow,
		/PUBLIC_SITE_URL:\s+https:\/\/amdeo\.github\.io\/blog-astro-site\//,
		"expected GitHub Pages workflow to set PUBLIC_SITE_URL to the current Pages URL",
	);
	assert.doesNotMatch(
		deployWorkflow,
		/DEPLOY_TARGET:/,
		"workflow should not depend on DEPLOY_TARGET after env-first base handling",
	);
});
