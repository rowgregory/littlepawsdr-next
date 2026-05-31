// next-sitemap.config.cjs
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.littlepawsdr.org",
  generateRobotsTxt: true,
  exclude: ["/admin/*", "/member/*", "/auth/*"],

  additionalPaths: async () => {
    const manifestPath = path.join(
      process.cwd(),
      ".next/server/app-paths-manifest.json",
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    return Object.keys(manifest)
      .filter(
        (route) =>
          !route.startsWith("/admin") &&
          !route.startsWith("/member") &&
          !route.startsWith("/auth") &&
          !route.startsWith("/_"),
      )
      .map((route) => ({ loc: route.replace("/page", "") || "/" }));
  },
};
