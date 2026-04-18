import { stripBase } from "./base-path-utils.js";

const SWUP_BYPASS_PATHS = new Set(["/rtk/"]);

function normalizePath(path: string): string {
	if (!path) {
		return "/";
	}

	const normalized = path.startsWith("/") ? path : `/${path}`;
	return normalized.endsWith("/") ? normalized : `${normalized}/`;
}

export function shouldBypassSwupForPath(path: string): boolean {
	const normalizedPath = normalizePath(path);
	const normalizedStrippedPath = normalizePath(stripBase(path));

	return (
		SWUP_BYPASS_PATHS.has(normalizedStrippedPath) ||
		Array.from(SWUP_BYPASS_PATHS).some((bypassPath) =>
			normalizedPath.endsWith(bypassPath),
		)
	);
}
