import type { RequestHandler } from "./$types";

const siteUrl = "https://schemazap.alexisgvrcia.dev";

export const GET: RequestHandler = async () => {
	const urls = [siteUrl];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${urls
	.map(
		(url) => `  <url>
    <loc>${url}</loc>
  </url>`,
	)
	.join("\n")}
</urlset>`;

	return new Response(body, {
		headers: {
			"cache-control": "public, max-age=3600",
			"content-type": "application/xml; charset=utf-8",
		},
	});
};
