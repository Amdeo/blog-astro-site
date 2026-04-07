const SWUP_BYPASS_PATHS = new Set(["/rtk/"]);

function normalizePath(path: string): string {
	if (!path) {
		return "/";
	}

	const normalized = path.startsWith("/") ? path : `/${path}`;
	return normalized.endsWith("/") ? normalized : `${normalized}/`;
}

export function shouldBypassSwupForPath(path: string): boolean {
	return SWUP_BYPASS_PATHS.has(normalizePath(path));
}
