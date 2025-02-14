# Fliessgeschwindigkeit

Dieses Projekt ist eine Anwendung zur Berechnung der Fliessgeschwindigkeit von Wasser in verschiedenen Querschnitten. Die Anwendung ist in Svelte geschrieben und nutzt TypeScript für die Logik.

## Installation

1. Klonen Sie das Repository:
   ```bash
   git clone <repository-url>
   cd fliessgeschwindigkeit
   ```

2. Installieren Sie die Abhängigkeiten:
   ```bash
   npm install
   ```

## Verwendung

Um die Anwendung zu starten, verwenden Sie den folgenden Befehl:
```bash
npm run dev
```

Die Anwendung wird standardmäßig auf `http://localhost:3000` ausgeführt.

## Struktur

- `src/App.svelte`: Hauptkomponente der Anwendung.
- `src/app.css`: Stile für die Anwendung.
- `src/main.ts`: Einstiegspunkt für die TypeScript-Anwendung.
- `src/classes/FlowCalculator.class.ts`: Enthält die Berechnungsmethoden für verschiedene Querschnittsformen.
- `static/manifest.json`: Metadaten zur Anwendung.
- `tests/FlowCalculator.test.ts`: Unit-Tests für die `FlowCalculator`-Klasse.

## Tests

Um die Tests auszuführen, verwenden Sie:
```bash
npm run test
```

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Weitere Informationen finden Sie in der LICENSE-Datei.