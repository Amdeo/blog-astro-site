export function getBasePath() {
	const base = import.meta.env?.BASE_URL || "/";
	if (!base || base === "/") {
		return "/";
	}
	return base.endsWith("/") ? base.slice(0, -1) : base;
}

export function stripBase(path) {
	if (!path) {
		return "/";
	}

	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	const basePath = getBasePath();

	if (
		basePath !== "/" &&
		(normalizedPath === basePath ||
			normalizedPath.startsWith(`${basePath}/`))
	) {
		const strippedPath = normalizedPath.slice(basePath.length);
		return strippedPath || "/";
	}

	return normalizedPath;
}

export function isHomePath(path) {
	const normalizedPath = stripBase(path).replace(/\/$/, "");
	return normalizedPath === "";
}

export function isPostPath(path) {
	return stripBase(path).startsWith("/posts/");
}
