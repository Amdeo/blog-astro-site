import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

function readFile(relativePath) {
	return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("legacy post permalink map exists and covers migrated source posts", () => {
	const legacyMapPath = path.join(repoRoot, "src/data/legacy-posts.ts");
	assert.ok(
		fs.existsSync(legacyMapPath),
		"expected src/data/legacy-posts.ts to exist",
	);

	const legacyMapSource = readFile("src/data/legacy-posts.ts");
	const entryCount = (
		legacyMapSource.match(/permalink:\s*["'`]/g) ?? []
	).length;

	assert.equal(
		entryCount,
		100,
		"expected legacy permalink map to include all 100 source posts",
	);
});

test("migration exposes tags/categories/resources pages", () => {
	for (const relativePath of [
		"src/pages/tags.astro",
		"src/pages/categories.astro",
		"src/pages/resources.astro",
	]) {
		assert.ok(
			fs.existsSync(path.join(repoRoot, relativePath)),
			`expected ${relativePath} to exist`,
		);
	}
});
