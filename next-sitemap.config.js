const config = {
  siteUrl: "https://www.littlepawsdr.org",
  generateRobotsTxt: true, // Generate robots.txt
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  additionalPaths: async () => {
    return [
      { loc: "/", lastmod: new Date().toISOString() },
      { loc: "/dachshunds", lastmod: new Date().toISOString() },
      { loc: "/dachshunds/hold", lastmod: new Date().toISOString() },
      { loc: "/adopt", lastmod: new Date().toISOString() },
      {
        loc: "/volunteer/foster-application",
        lastmod: new Date().toISOString(),
      },
      { loc: "/store", lastmod: new Date().toISOString() },
    ];
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search?q="],
      },
    ],
    additionalSitemaps: ["https://www.littlepawsdr.org/sitemap.xml"],
  },
};

export default config;
