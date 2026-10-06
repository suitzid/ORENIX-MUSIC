const http = require('http'), fs = require('fs');

// Ищет в папке файлы вида vX.Y.Z-OrenixMusic.html и берёт самый новый
function latest() {
  const files = fs.readdirSync(__dirname).filter(n => /^v\d+\.\d+\.\d+-OrenixMusic\.html$/.test(n));
  const key = n => n.slice(1).split('-')[0].split('.').map(Number);
  files.sort((a, b) => {
    const x = key(a), y = key(b);
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  });
  return files.pop();
}

http.createServer((req, res) => {
  const f = latest();
  if (!f) { res.writeHead(404); return res.end('Build not found'); }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(__dirname + '/' + f));
}).listen(process.env.PORT || 3000);
