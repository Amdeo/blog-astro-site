function formatDateKey(date: Date): string {
	return date.toISOString().substring(0, 10);
}

export function getPostDisplayDate(published: Date, updated?: Date): Date {
	return updated ?? published;
}

export function resolveUpdatedDate(
	published: Date,
	updated?: Date,
	fileModifiedTime?: Date,
): Date | undefined {
	if (updated) {
		return updated;
	}

	if (!fileModifiedTime) {
		return undefined;
	}

	return formatDateKey(fileModifiedTime) > formatDateKey(published)
		? fileModifiedTime
		: undefined;
}

export function hasDifferentDisplayDate(
	published: Date,
	updated?: Date,
): boolean {
	return !!updated && formatDateKey(updated) !== formatDateKey(published);
}
