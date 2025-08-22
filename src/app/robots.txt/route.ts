export async function GET() {
  const robotsContent = `User-agent: *
Allow: /
Disallow: /private/

Sitemap: https://qaski.ci/sitemap.xml`;

  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}