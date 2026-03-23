Deno.serve(async (req) => {
  const baseUrl = 'https://kodebase.us';
  
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/Home', priority: '1.0', changefreq: 'weekly' },
    { path: '/Services', priority: '0.9', changefreq: 'monthly' },
    { path: '/Platforms', priority: '0.8', changefreq: 'monthly' },
    { path: '/Process', priority: '0.8', changefreq: 'monthly' },
    { path: '/Portfolio', priority: '0.9', changefreq: 'weekly' },
    { path: '/Pricing', priority: '0.9', changefreq: 'monthly' },
    { path: '/About', priority: '0.8', changefreq: 'monthly' },
    { path: '/Blog', priority: '0.9', changefreq: 'daily' },
    { path: '/Contact', priority: '0.8', changefreq: 'monthly' },
    { path: '/FAQ', priority: '0.7', changefreq: 'monthly' },
    { path: '/Legal', priority: '0.5', changefreq: 'yearly' },
    { path: '/Base44ER', priority: '0.8', changefreq: 'monthly' },
    { path: '/AppFoundation', priority: '0.8', changefreq: 'monthly' },
    { path: '/BuildSprint', priority: '0.8', changefreq: 'monthly' },
    { path: '/Apply', priority: '0.7', changefreq: 'monthly' },
    // Service pages
    { path: '/AppDevelopment', priority: '0.8', changefreq: 'monthly' },
    { path: '/WebsiteDevelopment', priority: '0.8', changefreq: 'monthly' },
    { path: '/MVPDevelopment', priority: '0.8', changefreq: 'monthly' },
    { path: '/SaaSDevelopment', priority: '0.8', changefreq: 'monthly' },
    { path: '/APIDevelopment', priority: '0.8', changefreq: 'monthly' },
    { path: '/UIUXDesign', priority: '0.8', changefreq: 'monthly' },
    { path: '/AISystems', priority: '0.8', changefreq: 'monthly' },
    { path: '/DevOps', priority: '0.8', changefreq: 'monthly' },
    { path: '/SEOServices', priority: '0.8', changefreq: 'monthly' },
    { path: '/PaidAds', priority: '0.8', changefreq: 'monthly' },
    { path: '/ContentMarketing', priority: '0.8', changefreq: 'monthly' },
    { path: '/EmailMarketing', priority: '0.8', changefreq: 'monthly' },
    { path: '/FullFunnelMarketing', priority: '0.8', changefreq: 'monthly' },
    { path: '/CROServices', priority: '0.8', changefreq: 'monthly' },
    { path: '/Branding', priority: '0.8', changefreq: 'monthly' },
  ];

  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const page of staticPages) {
    xml += `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    }
  });
});