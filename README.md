# ?? VideoMerger Desktop

![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-0170FE)
![Zustand](https://img.shields.io/badge/Zustand-5.x-333333)

> Tag: #electron #desktop #vite #react #typescript #ffmpeg #zustand #antd

## ? Cosa offre questa versione

Questa codebase e ora desktop-only, senza server API separato e senza web app multiprogetto.

- ??? Merge, conversione e compressione video in un unico processo Electron.
- ?? Formato output configurabile (`mp4`, `mov`, `webm`).
- ?? Tre livelli di compressione (`light`, `balanced`, `strong`).
- ?? Un solo flusso operativo: merge locale con output unico.
- ?? Build portable generata automaticamente.

## ?? Architettura proposta

- `src/main`
  - `main.ts`: avvio Electron.
  - `preload.ts`: bridge IPC sicuro.
  - `ipc/ipc-routes.ts`: endpoint IPC (`create`, `list`, `progress`).
  - `services`: business logic.
    - `storage.service.ts` (path output e temp)
    - `file-picker.service.ts` (selezione file)
    - `ffmpeg.service.ts` (pipeline ffmpeg)
    - `job.service.ts` (coda, stato, progressione)
- `src/renderer`
  - `App.tsx` e componenti UI.
  - Stato centralizzato con Zustand.
- `src/shared`
  - Tipi condivisi IPC e job.

## ?? Setup rapido

### Requisiti

- Node.js 20+
- npm 10+

### Installazione

```bash
npm install
```

### Sviluppo

```bash
npm run dev
```

- Vite sul `5173`
- Electron collega automaticamente il renderer

### Build portable

```bash
npm run build
```

Output in `dist/packaged` con file:

- `VideoMerger-<version>-portable.exe`

## ?? Come funziona il merge

- Selezioni uno o piu file video.
- L'app concatena gli input nell'ordine scelto.
- Il risultato viene ricodificato con formato e compressione configurati.
- Ogni job produce un solo file finale nella cartella output dell'app.

## ?? Qualita codebase

- Struttura a layer chiara
- Niente file monolitici
- Pipeline job separata da rendering
- Aggiornamenti realtime via eventi IPC

## ?? Test

Nessun test automatico, come richiesto.

## ?? Lint e format

```bash
npm run lint
npm run format
```
