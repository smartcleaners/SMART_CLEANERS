import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

const routes = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/categories', changefreq: 'weekly', priority: 0.9 },
  { url: '/bulk-orders', changefreq: 'monthly', priority: 0.8 },
  { url: '/combos', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'yearly', priority: 0.6 },
  
  { url: '/products/YbDEwe3T0yDkTP2C1mCG', changefreq: 'monthly', priority: 0.7 },
  { url: '/products/daYKrL0V04rlZYXz1kb0-cleaner', changefreq: 'monthly', priority: 0.7 },
  { url: '/products/ZbbDZScXSrq7GTYxQ9oA', changefreq: 'monthly', priority: 0.7 },
  { url: '/products/awwiA11FWdcUxrnBFcqU', changefreq: 'monthly', priority: 0.7 },
  { url: '/products/bFxxzqFo8Z5uq32KkE0v', changefreq: 'monthly', priority: 0.7 },
  { url: '/products/ZIjcnvO8D4fNnrBzikzn', changefreq: 'monthly', priority: 0.7 },
];

async function generateSitemap() {
  const sitemap = new SitemapStream({ 
    hostname: 'https://smartcleaners.in' 
  });

  const writeStream = createWriteStream(resolve('./public/sitemap.xml'));
  sitemap.pipe(writeStream);

  routes.forEach(route => {
    sitemap.write({
      url: route.url,
      changefreq: route.changefreq,
      priority: route.priority,
      lastmod: new Date().toISOString().split('T')[0]
    });
  });

  sitemap.end();

  await streamToPromise(sitemap);
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
}

generateSitemap().catch(console.error);