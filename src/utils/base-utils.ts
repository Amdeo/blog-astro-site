import { getBasePath } from "./base-path-utils.js";

export {
	getBasePath,
	isHomePath,
	isPostPath,
	stripBase,
} from "./base-path-utils.js";

function isExternalResourcePath(path: string) {
	return /^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:");
}

export function withBase(path: string) {
	if (!path || isExternalResourcePath(path)) {
		return path;
	}

	const basePath = getBasePath();
	const normalizedBase = basePath === "/" ? "/" : `${basePath}/`;
	const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
	const baseWithoutTrailingSlash = normalizedBase.replace(/\/$/, "");

	if (
		path === normalizedBase ||
		path === baseWithoutTrailingSlash ||
		path.startsWith(`${baseWithoutTrailingSlash}/`)
	) {
		return path;
	}

	return `${normalizedBase}${normalizedPath}`;
}
