import type { RequestHandler } from "./$types";

const siteUrl = "https://schemazap.alexisgvrcia.dev";

export const GET: RequestHandler = async () => {
	const body = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;

	return new Response(body, {
		headers: {
			"cache-control": "public, max-age=3600",
			"content-type": "text/plain; charset=utf-8",
		},
	});
};
