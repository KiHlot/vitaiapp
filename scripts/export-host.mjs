import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const routeFile = path.join(root, "src", "app", "api", "lead", "route.ts");
const original = readFileSync(routeFile, "utf8");
const placeholder = `export const dynamic = "force-static";

export function GET() {
  return Response.json({ ok: true });
}
`;

writeFileSync(routeFile, placeholder);

let status = 1;

try {
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  const build = spawnSync(process.execPath, [nextBin, "build"], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      HOSTING_EXPORT: "1",
      NEXT_PUBLIC_SITE_URL: "https://bandman.ru",
    },
  });
  if (build.status !== 0) {
    status = build.status ?? 1;
  } else {
    const tsc = path.join(root, "node_modules", "typescript", "bin", "tsc");
    const compiled = spawnSync(
      process.execPath,
      [tsc, "--project", "tsconfig.lead.json"],
      { cwd: root, stdio: "inherit" },
    );
    status = compiled.status ?? 1;
  }
} finally {
  writeFileSync(routeFile, original);
}

process.exit(status);
