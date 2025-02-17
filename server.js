import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, 'dist');
console.log('Server startet mit dist-Verzeichnis:', DIST_DIR);

// Verzeichnisinhalt anzeigen
try {
  const files = fs.readdirSync(DIST_DIR);
  console.log('Gefundene Dateien im dist-Verzeichnis:', files);
} catch (err) {
  console.error('Fehler beim Lesen des dist-Verzeichnisses:', err);
}

const port = process.env.PORT || 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

const requestHandler = (req, res) => {
  console.log('Eingehende Anfrage:', req.url);
  
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  console.log('Suche Datei:', filePath);
  
  // Sicherstellen, dass der Pfad innerhalb des dist-Verzeichnisses bleibt
  if (!filePath.startsWith(DIST_DIR)) {
    console.log('Versuchter Zugriff außerhalb des dist-Verzeichnisses');
    res.writeHead(403);
    res.end('Zugriff verweigert');
    return;
  }
  
  // Wenn die Datei nicht existiert, versuche es als relative Pfad zur index.html
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    filePath = path.join(__dirname, 'dist', 'index.html');
    console.log('Fallback zu:', filePath);
  }

  // Debug: Prüfe ob Datei existiert
  if (!fs.existsSync(filePath)) {
    console.log('Datei existiert nicht:', filePath);
  }

  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Datei nicht gefunden');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
};

const server = http.createServer(requestHandler);

// Fehler abfangen, wenn der Port bereits belegt ist
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} wird bereits verwendet. Bitte nutzen Sie einen anderen Port oder beenden Sie den Prozess, der den Port belegt.`);
    process.exit(1);
  } else {
    throw err;
  }
});

server.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
  console.log(`Öffne http://localhost:${port} im Browser`);
});