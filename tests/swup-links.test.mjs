import test from "node:test";
import assert from "node:assert/strict";

import { shouldBypassSwupForPath } from "../src/utils/swup-link-utils.ts";

test("rtk html page links bypass swup transitions", () => {
	assert.equal(shouldBypassSwupForPath("/rtk/"), true);
	assert.equal(shouldBypassSwupForPath("/blog-astro-site/rtk/"), true);
	assert.equal(shouldBypassSwupForPath("/opencli/"), false);
	assert.equal(shouldBypassSwupForPath("/archive/"), false);
});
