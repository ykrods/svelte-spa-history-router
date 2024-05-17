/**
 * Static HTTP server with routing
 */
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';

import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// const __dirname = new URL('.', import.meta.url).pathname;

function log(code, request) {
  console.log(`[${(new Date()).toISOString()}] (${code}) ${request.method} ${request.url}`);
}

function getPathname(reqUrl) {
  // XXX: host and port are not referended. so use fixed values.
  const url = new URL(`http://localhost:8888${reqUrl}`);
  return decodeURI(url.pathname);
}

/**
 *  @param {Object} options
 *  @param {string} options.dir - directory to serve
 *  @param {Object.<string, string>} options.extMap - mapping file extensions to MIME types
 *  @param {(path: string) => string} [options.rewrite] - (optional) rewrite path function
 */
function createServer(options) {
  const getContentType = (contentPath) => {
    return options.extMap[path.extname(contentPath)] || null;
  };
  const root = path.resolve(options.dir);

  const handler = async (request, response) => {
    if (request.method.toUpperCase() !== "GET") {
      response.writeHead(405, {'Content-Type': 'text/plain'});
      response.end("Method Not Allowed", 'utf-8');
      log(405, request);
      return;
    }

    let p = getPathname(request.url);
    if (options.rewrite instanceof Function) {
      p = options.rewrite(p);
    }

    const contentPath = path.join(root, p);
    if (!contentPath.startsWith(root)) {
      throw new Error("invalid request");
    }

    try {
      const content = await fs.readFile(contentPath);
      const contentType = getContentType(contentPath);
      if (contentType === null) {
        throw new Error("Unknown file type");
      }

      response.writeHead(200, {'Content-Type': contentType });
      response.end(content);
      log(200, request);
    } catch (err) {
      if (err.code == "ENOENT") {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end("Not Found", 'utf-8');
        log(404, request);
      } else {
        throw err;
      }
    }
  }

  return http.createServer(async (request, response) => {
    try {
      await handler(request, response);
    } catch(error) {
      response.writeHead(500, {'Content-Type': 'text/plain'});
      response.end("Internal Server Error", 'utf-8');
      console.error(error);
      log(500, request);
    }
  });
}

export const server = createServer({
  dir: path.join(__dirname, "dist"),
  extMap: {
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "text/json",
    ".map": "application/octet-stream",
    ".html": "text/html",
  },
  rewrite(pathname) {
    // rewrite to index.html
    const rewriteConds = [
      path.extname(pathname) === "",
    ];
    if (rewriteConds.some(v => v)) {
      return "/index.html";
    }
    return pathname;
  }
});

// Run server
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const host = "localhost";
  const port = 8080;
  server.listen(port, host);
  console.log(`Server running on ${host}:${port}`);
}
