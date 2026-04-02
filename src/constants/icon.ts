import type { Favicon } from "@/types/config.ts";
import { withBase } from "@/utils/base-utils";

export const defaultFavicons: Favicon[] = [
	{
		src: withBase("/favicon/favicon.ico"),
		theme: "light",
		sizes: "64x64",
	},
	{
		src: withBase("/favicon/favicon.ico"),
		theme: "dark",
		sizes: "64x64",
	},
];
