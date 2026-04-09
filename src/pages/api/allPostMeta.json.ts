import { getSortedPosts } from "@/utils/content-utils";
import { getPostDisplayDate } from "@/utils/post-date-utils";

export async function GET() {
	const posts = await getSortedPosts();

	const allPostsData = posts
		.map((post) => {
			const displayDate = getPostDisplayDate(
				post.data.published,
				post.data.updated,
			);

			return {
				id: post.id,
				title: post.data.title,
				description: post.data.description,
				published: post.data.published.getTime(),
				displayDate: displayDate.getTime(),
				category: post.data.category || "",
				password: !!post.data.password,
			};
		})
		// 按展示日期降序排列
		.sort((a, b) => b.displayDate - a.displayDate);

	return new Response(JSON.stringify(allPostsData), {
		headers: { "Content-Type": "application/json" },
	});
}
