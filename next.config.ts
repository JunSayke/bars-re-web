import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "@junsayke/cebuano-thesaurus"],
  outputFileTracingIncludes: {
    // This tells Vercel to bundle the database files with the thesaurus API routes
    "/api/thesaurus/**/*": [
      "./node_modules/@junsayke/cebuano-thesaurus/**/*.db",
      "./node_modules/@junsayke/cebuano-thesaurus/**/*.sqlite",
      "./node_modules/@junsayke/cebuano-thesaurus/**/*.sqlite3"
    ],
  },
};

export default nextConfig;
