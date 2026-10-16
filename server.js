const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "out");
const { handleLead } = require("./lead-dist/handle-lead.js");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".txt": "text/x-component; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

function listen(server) {
  if (typeof PhusionPassenger !== "undefined") {
    PhusionPassenger.configure({ autoInstall: false });
    server.listen("passenger");
    return;
  }

  server.listen(80);
}

function send(res, status, body, type) {
  res.statusCode = status;
  res.setHeader("content-type", type);
  res.end(body);
}

function filePath(pathname) {
  let relative = decodeURIComponent(pathname.split("?")[0]);
  if (relative.includes("\0")) return null;
  relative = relative.replace(/^\/+/, "");
  const full = path.resolve(root, relative);
  if (full !== root && !full.startsWith(root + path.sep)) return null;
  return full;
}

function resolveFile(pathname) {
  const full = filePath(pathname);
  if (!full) return null;

  if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
    const index = path.join(full, "index.html");
    return fs.existsSync(index) ? index : null;
  }

  if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;

  const withHtml = full + ".html";
  if (fs.existsSync(withHtml)) return withHtml;

  return null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");

  if (req.method === "POST" && url.pathname === "/api/lead") {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 20000) {
        send(
          res,
          400,
          JSON.stringify({
            message:
              "Не получилось отправить. Проверьте интернет и нажмите ещё раз.",
          }),
          "application/json; charset=utf-8",
        );
        return;
      }
      chunks.push(chunk);
    }

    try {
      const response = await handleLead(
        new Request("http://localhost/api/lead", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: Buffer.concat(chunks),
        }),
      );
      const bytes = Buffer.from(await response.arrayBuffer());
      res.statusCode = response.status;
      res.setHeader(
        "content-type",
        response.headers.get("content-type") ||
          "application/json; charset=utf-8",
      );
      res.end(bytes);
    } catch (error) {
      console.error(error);
      send(
        res,
        502,
        JSON.stringify({
          message:
            "Не получилось отправить. Проверьте интернет и нажмите ещё раз.",
        }),
        "application/json; charset=utf-8",
      );
    }
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method Not Allowed", "text/plain; charset=utf-8");
    return;
  }

  if (!fs.existsSync(root)) {
    send(
      res,
      500,
      "Нет папки out. Залейте её в public_html.",
      "text/plain; charset=utf-8",
    );
    return;
  }

  const file = resolveFile(url.pathname);
  if (!file) {
    const missing = path.join(root, "404.html");
    if (fs.existsSync(missing)) {
      res.statusCode = 404;
      res.setHeader("content-type", "text/html; charset=utf-8");
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      fs.createReadStream(missing).pipe(res);
      return;
    }
    send(res, 404, "Нет такой страницы", "text/plain; charset=utf-8");
    return;
  }

  const ext = path.extname(file).toLowerCase();
  const type = mime[ext] || "application/octet-stream";
  const relative = path.relative(root, file).replaceAll("\\", "/");
  const cache = relative.startsWith("_next/static/")
    ? "public, max-age=31536000, immutable"
    : ext === ".html"
      ? "no-cache"
      : "public, max-age=2592000";
  res.statusCode = 200;
  res.setHeader("content-type", type);
  res.setHeader("cache-control", cache);
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  fs.createReadStream(file).pipe(res);
});

listen(server);
