const http = require('http'), fs = require('fs'), path = require('path');
const MIME = {'.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.ico':'image/x-icon'};

// Самый новый файл vX.Y.Z-OrenixMusic.html, а если его нет, то index.html
function latest() {
  const files = fs.readdirSync(__dirname).filter(n => /^v\d+\.\d+\.\d+-OrenixMusic\.html$/.test(n));
  const key = n => n.slice(1).split('-')[0].split('.').map(Number);
  files.sort((a, b) => { const x = key(a), y = key(b); return x[0]-y[0] || x[1]-y[1] || x[2]-y[2]; });
  return files.pop() || (fs.existsSync(__dirname + '/index.html') ? 'index.html' : null);
}

http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  const type = MIME[path.extname(u).toLowerCase()];
  if (type && /^\/[\w.-]+$/.test(u)) {           // статика: css, png, svg...
    const f = path.join(__dirname, u);
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'public, max-age=3600' });
    return res.end(fs.readFileSync(f));
  }
  const f = latest();
  if (!f) { res.writeHead(404); return res.end('Build not found'); }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
  res.end(fs.readFileSync(__dirname + '/' + f));
}).listen(process.env.PORT || 3000);
