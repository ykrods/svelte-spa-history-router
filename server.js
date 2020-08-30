/**
 * Static HTTP server with routing
 */
const fs = require('fs/promises');
const http = require('http');
const path = require('path');

const STATIC_DIR = path.join('example', 'dist');

function getFileName(url) {
  const static_files = ['bundle.css', 'bundle.css.map', 'bundle.js', 'bundle.js.map'];
  const s = static_files.find(f => '/' + f === url);
  if (s) {
    return s;
  }
  // rewrite to index.html
  return 'index.html';
}

function getContentType(filename) {
  const extMap = {
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.map': 'application/octet-stream',
    '.html': 'text/html',
  }
  return extMap[path.extname(filename)] || 'text/plain';
}

let server = http.createServer(async (request, response) => {
  console.log(`[${(new Date()).toISOString()}] ${request.method} ${request.url}`);

  const fileName = getFileName(request.url);
  const contentType = getContentType(fileName);

  // console.log(`${fileName}, ${contentType}`);

  const content = await fs.readFile(path.join(STATIC_DIR, fileName), 'utf-8');

  response.writeHead(200, {'Content-Type': contentType});
  response.end(content, 'utf-8');
});

module.exports = {
  server,
}

// Run server
if(!module.parent) {
  const port = 8080;
  server.listen(port);
  console.log(`Server running on ${port}`);
}
