import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const site = 'https://caloriesin.netlify.app';
  const today = new Date().toISOString().split('T')[0];

  let foods: any[] = [];
  let categories: any[] = [];

  try {
    foods = (await import('../data/foods.json')).default ?? [];
  } catch {
    foods = [];
  }

  try {
    categories = (await import('../data/categories.json')).default ?? [];
  } catch {
    categories = [];
  }

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.3', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.3', changefreq: 'monthly' },
    { url: '/terms', priority: '0.3', changefreq: 'monthly' },
    { url: '/contact', priority: '0.3', changefreq: 'monthly' },
    { url: '/blog', priority: '0.6', changefreq: 'weekly' },
  ];

  const toolPages = [
    '/tools/calorie-calculator',
    '/tools/bmi-calculator',
    '/tools/macro-calculator',
  ];

  const urlEntries: string[] = [];

  // Static pages
  for (const page of staticPages) {
    urlEntries.push(`
  <url>
    <loc>${site}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // Food pages
  for (const food of foods) {
    const slug = food.slug ?? food.id;
    if (slug) {
      urlEntries.push(`
  <url>
    <loc>${site}/food/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    }
  }

  // Category pages
  for (const cat of categories) {
    const slug = cat.slug ?? cat.id;
    if (slug) {
      urlEntries.push(`
  <url>
    <loc>${site}/category/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }
  }

  // Comparison pages — generate pairs from top foods
  const topFoods = foods.slice(0, 20);
  for (let i = 0; i < topFoods.length; i++) {
    for (let j = i + 1; j < topFoods.length; j++) {
      const slugA = topFoods[i].slug ?? topFoods[i].id;
      const slugB = topFoods[j].slug ?? topFoods[j].id;
      if (slugA && slugB) {
        urlEntries.push(`
  <url>
    <loc>${site}/compare/${slugA}-vs-${slugB}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
      }
    }
  }

  // Tool pages
  for (const tool of toolPages) {
    urlEntries.push(`
  <url>
    <loc>${site}${tool}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries.join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
