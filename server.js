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
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Debug-Logging für Asset-Anfragen
const requestHandler = (req, res) => {
  console.log('Eingehende Anfrage:', req.url);
  
  // Entferne "/fliessgeschwindigkeit_svelte" aus der URL falls vorhanden
  let cleanUrl = req.url.replace('/fliessgeschwindigkeit_svelte', '');
  
  // Konstruiere den korrekten Dateipfad
  let filePath = path.join(DIST_DIR, cleanUrl === '/' ? 'index.html' : cleanUrl);
  
  console.log('Suche Datei:', filePath);

  // Prüfe ob die Datei existiert
  if (!fs.existsSync(filePath)) {
    console.log('Datei nicht gefunden, versuche alternatives Verzeichnis...');
    // Versuche die Datei direkt im dist-Verzeichnis zu finden
    filePath = path.join(DIST_DIR, path.basename(cleanUrl));
    console.log('Alternativer Pfad:', filePath);
  }
  
  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error('Fehler beim Lesen der Datei:', err);
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end(`Datei nicht gefunden: ${cleanUrl}`);
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