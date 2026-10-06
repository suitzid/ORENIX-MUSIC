const http = require('http'), fs = require('fs'), path = require('path');

// Берёт самый новый vX.Y.Z-OrenixMusic.html, а если его нет, то index.html
function latest() {
  const files = fs.readdirSync(__dirname).filter(n => /^v\d+\.\d+\.\d+-OrenixMusic\.html$/.test(n));
  const key = n => n.slice(1).split('-')[0].split('.').map(Number);
  files.sort((a, b) => {
    const x = key(a), y = key(b);
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  });
  return files.pop() || (fs.existsSync(__dirname + '/index.html') ? 'index.html' : null);
}

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  // отдаём только файлы стилей (.css) из корня
  if (/^\/[\w.-]+\.css$/.test(url) && fs.existsSync(path.join(__dirname, url))) {
    res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
    return res.end(fs.readFileSync(path.join(__dirname, url)));
  }
  const f = latest();
  if (!f) { res.writeHead(404); return res.end('Build not found'); }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(__dirname + '/' + f));
}).listen(process.env.PORT || 3000);
