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
