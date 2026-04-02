function isExternalResourcePath(path: string) {
	return /^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:");
}

export function withBase(path: string) {
	if (!path || isExternalResourcePath(path)) {
		return path;
	}

	const baseUrl = import.meta.env.BASE_URL || "/";
	const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
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
