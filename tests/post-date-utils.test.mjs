import test from "node:test";
import assert from "node:assert/strict";

import {
	getPostDisplayDate,
	resolveUpdatedDate,
} from "../src/utils/post-date-utils.ts";

test("getPostDisplayDate prefers updated date when available", () => {
	const published = new Date("2024-01-01T00:00:00.000Z");
	const updated = new Date("2024-03-01T12:00:00.000Z");

	assert.equal(getPostDisplayDate(published, updated), updated);
	assert.equal(getPostDisplayDate(published), published);
});

test("resolveUpdatedDate keeps explicit updated frontmatter", () => {
	const published = new Date("2024-01-01T00:00:00.000Z");
	const updated = new Date("2024-02-01T00:00:00.000Z");
	const fileModifiedTime = new Date("2024-03-01T12:00:00.000Z");

	assert.equal(
		resolveUpdatedDate(published, updated, fileModifiedTime),
		updated,
	);
});

test("resolveUpdatedDate falls back to file modified date for older posts edited later", () => {
	const published = new Date("2024-01-01T00:00:00.000Z");
	const fileModifiedTime = new Date("2024-03-01T12:00:00.000Z");

	assert.deepEqual(
		resolveUpdatedDate(published, undefined, fileModifiedTime),
		fileModifiedTime,
	);
});

test("resolveUpdatedDate ignores same-day file modifications to avoid marking new posts as updated", () => {
	const published = new Date("2024-03-01T00:00:00.000Z");
	const fileModifiedTime = new Date("2024-03-01T12:00:00.000Z");

	assert.equal(
		resolveUpdatedDate(published, undefined, fileModifiedTime),
		undefined,
	);
});
