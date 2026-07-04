import type { RequestHandler } from "./$types";

const siteUrl = "https://schemazap.alexisgvrcia.dev";

export const GET: RequestHandler = async () => {
	const body = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: AdsBot-Google
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;

	return new Response(body, {
		headers: {
			"cache-control": "public, max-age=3600",
			"content-type": "text/plain; charset=utf-8",
		},
	});
};
