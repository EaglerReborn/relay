const http = require('http');
const hh = require('http-https');
const Url = require('url');

const port = 8083;

const allowedUrls = [
  'https://sessionserver.mojang.com/session/minecraft/join',
  'https://api.minecraftservices.com/authentication/login_with_xbox',
  'https://api.minecraftservices.com/minecraft/profile',
  'https://api.minecraftservices.com/entitlements/mcstore',
  'https://ipv4.icanhazip.com'
];

http.createServer((request, response) => {
  let url = request.url.substr(1);
  if (url.toLowerCase().startsWith("https:/") && !url.toLowerCase().startsWith("https://")) {
    url = url.slice(0, 7) + url.slice(6);
  }
  if (url.toLowerCase().startsWith("http:/") && !url.toLowerCase().startsWith("http://")) {
    url = url.slice(0, 6) + url.slice(5);
  }
  let proceed = false;
  for (let allowedUrl of allowedUrls) {
    if (url.toLowerCase() == allowedUrl.toLowerCase()) {
      proceed = true;
      break;
    }
  }
  if (!proceed) {
    response.writeHead(403, {'Content-Type': 'text/plain'});
    response.end('That URL is not whitelisted!');
    return;
  }
  let options = Url.parse(url);

  options.headers = request.headers;
  // remove host as it is taken from url
  delete options.headers.host;

  options.method = request.method;

  let proxyReq = hh.request(options, proxyRes => {
    Object.keys(proxyRes.headers).map(key => {
      response.setHeader(key, proxyRes.headers[key]);
    });
    forceCors(response);

    proxyRes.on('data', chunk => response.write(chunk, 'binary'));
    proxyRes.on('end', () => response.end());
  });
  proxyReq.on('error', err => {
    console.log(err);
    response.end();
  });
  request.on('data', chunk => proxyReq.write(chunk, 'binary'));
  request.on('end', () => proxyReq.end());

}).listen(port, "127.0.0.1", () => {
  console.log('App now running on port', port);
});

function forceCors(resp) {
  resp.setHeader('Access-Control-Allow-Origin', '*');
  resp.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
}