import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import https from 'https';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Node.js Versionen und Download-URLs
const NODE_VERSION = 'v20.11.1';
const DOWNLOADS = {
    win: `https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-win-x64.zip`,
    mac: `https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-darwin-x64.tar.gz`
};

// Erstelle temporäres Verzeichnis
const tmpDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
}

// Download-Funktion für Node.js Binaries
async function downloadNodeBinary(platform) {
    const url = DOWNLOADS[platform];
    console.log(`Lade Node.js für ${platform} herunter...`);
    console.log('Download URL:', url);
    
    return new Promise((resolve, reject) => {
        const request = https.get(url, {
            timeout: 10000, // 10 Sekunden Timeout
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
            }
        }, response => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Folge der Umleitung
                downloadNodeBinary(platform)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Download fehlgeschlagen: ${response.statusCode}`));
                return;
            }
            
            const chunks = [];
            let size = 0;

            response.on('data', chunk => {
                chunks.push(chunk);
                size += chunk.length;
                process.stdout.write(`\rHeruntergeladen: ${(size / 1024 / 1024).toFixed(2)} MB`);
            });

            response.on('end', () => {
                process.stdout.write('\n');
                resolve(Buffer.concat(chunks));
            });

            response.on('error', reject);
        });

        request.on('error', reject);
        request.on('timeout', () => {
            request.destroy();
            reject(new Error('Zeitüberschreitung beim Download'));
        });
    });
}

// Erstellt portable Version für eine Plattform
async function createPortable(platform) {
    const output = fs.createWriteStream(`fliessgeschwindigkeit-portable-${platform}.zip`);
    const archive = archiver('zip');
    
    output.on('close', () => {
        console.log(`Portable Version für ${platform} erstellt: fliessgeschwindigkeit-portable-${platform}.zip`);
    });
    
    archive.on('error', err => {
        throw err;
    });
    
    archive.pipe(output);
    
    // Node.js Binary herunterladen und hinzufügen
    const nodeBinary = await downloadNodeBinary(platform);
    let tarPath, extractDir;
    if (platform === 'win') {
        // Erstelle temporäres Unterverzeichnis für die Extraktion
        extractDir = path.join(tmpDir, 'extract-win');
        if (fs.existsSync(extractDir)) {
            fs.rmSync(extractDir, { recursive: true });
        }
        fs.mkdirSync(extractDir);

        // Schreibe das ZIP-Archiv
        const zipPath = path.join(tmpDir, 'node.zip');
        fs.writeFileSync(zipPath, nodeBinary);

        // Entpacke das ZIP-Archiv mit unzip statt PowerShell
        await new Promise((resolve, reject) => {
            exec(`unzip -o "${zipPath}" -d "${extractDir}"`, async (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    // Liste alle Dateien im Extraktionsverzeichnis
                    const files = fs.readdirSync(extractDir);
                    console.log('Extrahierte Dateien (Windows):', files);
                    
                    // Finde das Node.js-Verzeichnis
                    const nodeDir = files.find(dir => dir.startsWith('node-'));
                    if (!nodeDir) {
                        throw new Error('Node.js-Verzeichnis nicht gefunden');
                    }

                    // Korrigierter Pfad: node.exe liegt direkt im Hauptverzeichnis
                    const nodePath = path.join(extractDir, nodeDir, 'node.exe');
                    if (!fs.existsSync(nodePath)) {
                        console.log('Suche node.exe in alternativen Verzeichnissen...');
                        // Zeige Verzeichnisstruktur für Debug-Zwecke
                        exec(`ls -R "${extractDir}"`, (err, stdout) => {
                            if (!err) console.log('Verzeichnisstruktur:', stdout);
                        });
                        throw new Error('node.exe nicht gefunden');
                    }

                    console.log('Node.exe gefunden unter:', nodePath);
                    
                    // Überprüfe Dateigröße und Zugriffsrechte
                    const stats = fs.statSync(nodePath);
                    console.log('Node.exe Größe:', stats.size, 'Bytes');
                    console.log('Node.exe Zugriffsrechte:', stats.mode.toString(8));

                    // Füge die Datei zum Archiv hinzu mit explizitem Buffer-Read
                    const nodeBuffer = fs.readFileSync(nodePath);
                    archive.append(nodeBuffer, { name: 'node.exe' });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });

        // Aufräumen
        fs.unlinkSync(zipPath);
        fs.rmSync(extractDir, { recursive: true });
    } else if (platform === 'mac') {
        // Erstelle temporäres Unterverzeichnis für die Extraktion
        extractDir = path.join(tmpDir, 'extract');
        if (fs.existsSync(extractDir)) {
            fs.rmSync(extractDir, { recursive: true });
        }
        fs.mkdirSync(extractDir);

        // Schreibe das tar.gz-Archiv in tmpDir
        tarPath = path.join(tmpDir, 'node.tar.gz');
        fs.writeFileSync(tarPath, nodeBinary);

        // Überprüfe, ob die Datei geschrieben wurde
        try {
            fs.accessSync(tarPath, fs.constants.R_OK);
            console.log('Datei erfolgreich geschrieben:', tarPath);
        } catch (accessError) {
            console.error('Kein Zugriff auf die Datei:', accessError);
            throw accessError;
        }

        // Entpacke das Archiv und verarbeite den Inhalt
        await new Promise((resolve, reject) => {
            exec(`tar -xzf "${tarPath}" -C "${extractDir}"`, async (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                try {
                    // Liste alle Dateien im Extraktionsverzeichnis
                    const files = fs.readdirSync(extractDir);
                    console.log('Extrahierte Dateien:', files);
                    
                    // Finde das Node.js-Verzeichnis
                    const nodeDir = files.find(dir => dir.startsWith('node-'));
                    if (!nodeDir) {
                        throw new Error('Node.js-Verzeichnis nicht gefunden');
                    }
                    
                    console.log('Gefundenes Node.js-Verzeichnis:', nodeDir);

                    // Suche die node-Binary
                    const possiblePaths = [
                        path.join(extractDir, nodeDir, 'bin', 'node'),
                        path.join(extractDir, nodeDir, 'node')
                    ];
                    
                    const nodePath = possiblePaths.find(p => fs.existsSync(p));
                    if (!nodePath) {
                        throw new Error(`Node.js Binary nicht gefunden in: ${possiblePaths.join(', ')}`);
                    }

                    console.log('Node.js Binary gefunden unter:', nodePath);

                    // Mache die Binary ausführbar
                    await new Promise((resolveChmod, rejectChmod) => {
                        exec(`chmod +x "${nodePath}"`, (chmodErr) => {
                            if (chmodErr) {
                                rejectChmod(chmodErr);
                                return;
                            }
                            resolveChmod();
                        });
                    });

                    // Prüfe, ob die Binary existiert und ausführbar ist
                    await new Promise((resolveTest, rejectTest) => {
                        exec(`"${nodePath}" --version`, (testErr, stdout) => {
                            if (testErr) {
                                rejectTest(testErr);
                                return;
                            }
                            console.log('Node.js Version Test:', stdout.trim());
                            resolveTest();
                        });
                    });

                    // Füge die Binary zum Archiv hinzu
                    fs.access(nodePath, fs.constants.R_OK, (accessErr) => {
                        if (accessErr) {
                            console.error('Kein Zugriff auf die Datei:', accessErr);
                            reject(accessErr);
                            return;
                        }

                        archive.file(nodePath, { name: 'node', mode: 0o755 });
                        resolve();
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });
        // Hinweis: Cleanup (Löschen von tarPath und extractDir) erfolgt später, nach finalize().
    }
    
    // Start-Skript hinzufügen
    const startScript = platform === 'win' 
        ? 'start.bat'
        : 'start.command';
        
    const scriptContent = platform === 'win'
        ? `@echo off
cd %~dp0
set PORT=8081
echo Starte Server auf Port %PORT%...
rem Starte den Server in einem neuen Fenster
start "Server" node server.js %PORT%
rem Warte 3 Sekunden, damit der Server Zeit hat hochzufahren
timeout /t 3 >nul
rem Öffne den Browser mit der URL
start "" "http://localhost:%PORT%"
pause
`
        : `#!/bin/bash
cd "$(dirname "$0")"
PORT=8081
echo "Starte Server auf Port $PORT..."
chmod +x ./node
# Starte den Server im Hintergrund
./node server.js $PORT &
# Warte 3 Sekunden
sleep 3
# Öffne den Browser (funktioniert auf macOS)
open "http://localhost:$PORT"
# Warte auf Benutzerinteraktion
read -n 1 -s -r -p "Drücke eine beliebige Taste zum Beenden..."
# Beende den Server-Prozess
kill $!
`;
    
    archive.append(scriptContent, { name: startScript, mode: 0o755 });
    
    // Füge server.js und dist-Verzeichnis hinzu
    archive.file('server.js', { name: 'server.js' });

    // Wichtig: Stelle sicher, dass das dist-Verzeichnis existiert
    if (!fs.existsSync('dist')) {
        console.error('Fehler: dist-Verzeichnis nicht gefunden!');
        console.log('Bitte führen Sie zuerst "npm run build" aus.');
        process.exit(1);
    }

    // Kopiere komplettes dist-Verzeichnis mit allen Assets
    archive.directory('dist', 'dist');

    // Überprüfe und kopiere zusätzliche Asset-Verzeichnisse
    const assetPaths = [
        'public',
        'public/assets',
        'public/assets/icons',
        'public/assets/images',
        'src/assets'
    ];

    for (const assetPath of assetPaths) {
        if (fs.existsSync(assetPath)) {
            console.log(`Füge Assets aus ${assetPath} hinzu...`);
            archive.directory(assetPath, assetPath);
        } else {
            console.log(`Warnung: Verzeichnis ${assetPath} nicht gefunden`);
        }
    }

    // Debug-Ausgabe der Verzeichnisstruktur
    console.log('\nVerzeichnisstruktur der Assets:');
    assetPaths.forEach(dir => {
        if (fs.existsSync(dir)) {
            console.log(`\n${dir}:`);
            const files = fs.readdirSync(dir);
            files.forEach(file => console.log(`  - ${file}`));
        }
    });

    await archive.finalize();

    // Aufräumen: Lösche erst nach erfolgreichem Abschluss des Archivs (macOS)
    if (platform === 'mac') {
        fs.unlinkSync(tarPath);
        fs.rmSync(extractDir, { recursive: true });
    }
}

// Alle Plattformen bauen
async function buildAll() {
    try {
        await Promise.all([
            createPortable('win'),
            createPortable('mac')
        ]);
        console.log('Build abgeschlossen!');
    } catch (error) {
        console.error('Fehler beim Erstellen der portablen Version:', error);
        process.exit(1);
    }
}

buildAll();

// Aufräumen nach dem Build
process.on('exit', () => {
    if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true });
    }
});