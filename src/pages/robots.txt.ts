import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const body = `User-agent: *
Allow: /

Sitemap: https://caloriesin.netlify.app/sitemap.xml

# AI/LLM Information
# See https://caloriesin.netlify.app/llms.txt for AI-readable site information
# See https://caloriesin.netlify.app/llms-full.txt for detailed documentation
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
