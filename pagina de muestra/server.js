const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SETTINGS_FILE = process.env.SETTINGS_FILE || path.join(__dirname, 'settings.json');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'img');
const SESSION_MS = 24 * 60 * 60 * 1000;

const sessions = new Map();

fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8'
};

function defaultSettings() {
  return { index: null, recomendaciones: null, promos: null, productos: [] };
}

function readSettings() {
  try {
    const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    return { ...defaultSettings(), ...data };
  } catch (e) {
    return defaultSettings();
  }
}

function saveSettings(s) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(s, null, 2), 'utf8');
}

function readBody(req, limit) {
  const max = limit || 10 * 1024 * 1024;
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => {
      body += c;
      if (body.length > max) { req.destroy(); reject(new Error('too large')); }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
    });
  });
}

function sendJson(res, code, obj) {
  const payload = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  });
  res.end(payload);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === '/api/settings' && req.method === 'GET') {
    return sendJson(res, 200, readSettings());
  }

  if (pathname === '/api/login' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      if (body.password === ADMIN_PASSWORD) {
        const token = crypto.randomBytes(24).toString('hex');
        sessions.set(token, Date.now() + SESSION_MS);
        return sendJson(res, 200, { token });
      }
      return sendJson(res, 401, { error: 'Contraseña incorrecta' });
    } catch (e) {
      return sendJson(res, 400, { error: 'Solicitud inválida' });
    }
  }

  if (pathname === '/api/settings' && req.method === 'PUT') {
    const auth = req.headers.authorization || '';
    const token = auth.replace(/^Bearer\s+/i, '');
    const expires = sessions.get(token);
    if (!expires || expires < Date.now()) {
      return sendJson(res, 401, { error: 'No autorizado' });
    }
    try {
      const body = await readBody(req);
      const next = {
        index: Array.isArray(body.index) ? body.index : null,
        recomendaciones: Array.isArray(body.recomendaciones) ? body.recomendaciones : null,
        promos: Array.isArray(body.promos) ? body.promos : null,
        productos: Array.isArray(body.productos) ? body.productos : []
      };
      saveSettings(next);
      return sendJson(res, 200, readSettings());
    } catch (e) {
      return sendJson(res, 400, { error: 'Solicitud inválida' });
    }
  }

  if (pathname === '/api/upload' && req.method === 'POST') {
    const auth = req.headers.authorization || '';
    const token = auth.replace(/^Bearer\s+/i, '');
    const expires = sessions.get(token);
    if (!expires || expires < Date.now()) {
      return sendJson(res, 401, { error: 'No autorizado' });
    }
    try {
      const body = await readBody(req, 12 * 1024 * 1024);
      const m = /^data:(image\/(png|jpe?g|webp|gif));base64,(.+)$/.exec(body.dataUrl || '');
      if (!m) return sendJson(res, 400, { error: 'Imagen inválida' });
      const extMap = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif' };
      const ext = extMap[m[1]];
      const buf = Buffer.from(m[3], 'base64');
      if (buf.length > 5 * 1024 * 1024) return sendJson(res, 400, { error: 'Imagen muy grande' });
      const fname = 'producto-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7) + ext;
      fs.writeFileSync(path.join(UPLOAD_DIR, fname), buf);
      return sendJson(res, 200, { path: 'img/' + fname });
    } catch (e) {
      return sendJson(res, 400, { error: 'No se pudo subir la imagen' });
    }
  }

  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  if (pathname.startsWith('/img/')) {
    const fname = pathname.replace(/^\/img\//, '');
    const uploaded = path.join(UPLOAD_DIR, fname);
    const bundled = path.join(__dirname, 'img', fname);
    if (fs.existsSync(uploaded)) filePath = uploaded;
    else if (fs.existsSync(bundled)) filePath = bundled;
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
});

function lanIPs() {
  const ips = [];
  const ifs = os.networkInterfaces();
  for (const name of Object.keys(ifs)) {
    for (const iface of ifs[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) ips.push(iface.address);
    }
  }
  return ips;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log('Market server en funcionamiento:');
  console.log('  Local:   http://localhost:' + PORT);
  for (const ip of lanIPs()) console.log('  Red:     http://' + ip + ':' + PORT);
  console.log('  Contraseña de administrador: ' + ADMIN_PASSWORD);
});
