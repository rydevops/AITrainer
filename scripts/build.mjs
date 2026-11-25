import { build, context } from "esbuild";
import { cp, mkdir, rm } from "node:fs/promises";

const watch = process.argv.includes("--watch");
const outDir = "dist";

const shared = {
  bundle: true,
  format: "iife",
  target: "es2022",
  sourcemap: true,
  logLevel: "info",
};

const entryPoints = [
  { in: "src/app/main.ts", out: "app" },
  { in: "src/sw.ts", out: "sw" },
];

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await cp("public", outDir, { recursive: true });

if (watch) {
  const ctx = await context({ ...shared, entryPoints, outdir: outDir });
  await ctx.watch();
  console.warn("Watching for changes in src/ (static files in public/ are copied once; restart to refresh them).");
} else {
  await build({ ...shared, entryPoints, outdir: outDir });
}
