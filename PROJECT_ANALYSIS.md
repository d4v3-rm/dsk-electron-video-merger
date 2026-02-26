# Analisi del progetto `dsk-electron-video-merger`

## Sintesi

- Repository tracciato: 146 file Git.
- Stack principale: Electron + Vite + React + TypeScript + Ant Design + Zustand + FFmpeg/FFprobe statici.
- Struttura: una desktop app locale (`src/main` + `src/renderer` + `src/shared`) e un sito marketing separato (`website/`).
- Packaging: build Windows portable tramite Electron Builder.
- Stato di verifica locale al momento di questo aggiornamento: dipendenze presenti e validazione statica eseguibile; `npm.cmd run lint` e `npm.cmd run typecheck` risultano verdi.

## Lettura architetturale

1. Il renderer React gestisce selezione file, impostazioni di encoding, overview, preview e cronologia lavori.
2. Il preload espone un bridge `electronAPI` minimale e tipizzato.
3. L'IPC del main process inoltra le richieste a servizi dedicati.
4. `JobService` costruisce i job, li mette in coda ed esegue un solo job per volta.
5. `FfmpegService` decide backend CPU/NVIDIA, prepara gli argomenti FFmpeg, legge il progresso da `-progress pipe:2` e produce telemetria/log.
6. `StorageService` crea cartelle output sotto `app.getPath('userData')` oppure usa una cartella scelta dall'utente.
7. Il sito `website/` e indipendente dall'app: stesso repository, toolchain separata, finalita solo promozionale.

## Osservazioni trasversali

- Il repository e coerente: i tipi condivisi sono pochi ma ben centrali.
- La cronologia job e solo in memoria. Il README parla di "local job history", ma il codice corrente non persiste job su disco.
- Il lockfile contiene entry `extraneous` per `apps/api` e `apps/web`, che non esistono nel tree attuale: e un residuo storico.
- Non esiste una suite di test automatizzati nel repository.
- L'app e desktop-first reale: niente backend remoto, niente database, niente upload cloud.

## Analisi file per file

### Workflow, dotfiles e root

- `.github/workflows/ci.yml`: pipeline CI su Ubuntu per `push` su `main/develop` e PR; esegue `npm ci`, lint, typecheck e build di main, renderer e website. Verifica la consistenza del monorepo senza fare packaging Windows.
- `.github/workflows/deploy-pages.yml`: workflow di deploy del solo sito su branch `gh-pages`; ripete lint/typecheck/build website e pubblica `dist/website`. Mantiene separata la distribuzione marketing dalla desktop app.
- `.github/workflows/desktop-release.yml`: workflow release su Windows per build portable `.exe`, poi su Ubuntu crea release GitHub con note categorizzate da commit convenzionali e allega anche `source.zip`. E il flusso piu completo e "prodotto".
- `.gitignore`: ignora artefatti standard (`node_modules`, `dist`, `.vite`, IDE, log, env`) ma forza il tracking delle icone in `build/`. Quindi `build/` e considerata cartella mista: generati + asset distribuiti.
- `.prettierignore`: esclude `build`, `dist`, `packaged`, `out` e log dalla formattazione. Coerente con l'idea che build e output non vadano toccati da Prettier.
- `LICENSE`: MIT standard. Permissiva, adatta a un tool desktop open source.
- `README.md`: documentazione principale del prodotto, con overview, feature map, struttura runtime, script e release flow. E orientato piu al "product explanation" che al "developer handbook"; menziona correttamente app/website/script, ma sovrastima la persistenza della history rispetto al codice attuale.
- `electron-builder.config.mjs`: traduce `electron.app.config.json` nella sintassi di Electron Builder. Riduce la duplicazione centralizzando naming e path in JSON.
- `electron.app.config.json`: configurazione applicativa del runtime Electron e del packaging. Definisce dimensioni finestra, scorciatoie DevTools, icone, file inclusi e nome dell'artefatto portable.
- `eslint.config.mjs`: flat config ESLint con parser TypeScript, plugin React e React Hooks, e ambiente separato per main/renderer/scripts. Molto pratica; disabilita `no-explicit-any` e ignora output/build.
- `package-lock.json`: lockfile npm v3. Blocca versioni precise delle dipendenze; all'inizio mostra anche `apps/api` e `apps/web` come pacchetti `extraneous`, segnale di un lockfile non completamente ripulito.
- `package.json`: manifesto principale del workspace. Descrive il progetto come desktop studio + presentation website, definisce script di sviluppo/build/versioning e raccoglie dipendenze app, sito e tooling.
- `prettier.config.mjs`: configurazione Prettier minimale e uniforme (`singleQuote`, `trailingComma`, `printWidth 110`). Favorisce uno stile lineare.
- `tsconfig.base.json`: base comune con strict mode, path alias `@main`, `@renderer`, `@shared`, `@website` e impostazioni stabili cross-runtime.
- `tsconfig.json`: file aggregatore che referenzia i quattro tsconfig operativi. Utile per editor e build composite.
- `tsconfig.main.json`: config TypeScript per main process + shared; output in `dist`, modulo CommonJS, niente declaration. E il bridge verso il runtime Electron Node.
- `tsconfig.renderer.app.json`: config di compilazione per il renderer React dentro `src/renderer`; modulo ESNext, JSX React, moduleResolution `bundler`.
- `tsconfig.renderer.json`: wrapper che estende `tsconfig.renderer.app.json`. Serve soprattutto come entry di typecheck dedicata.
- `tsconfig.shared.json`: typecheck isolato dei soli contratti condivisi. Buona separazione per evitare regressioni di tipi cross-layer.
- `tsconfig.website.json`: config TypeScript per il sito standalone `website/`; simile al renderer ma limitata a quel workspace.
- `vite.config.ts`: configurazione Vite del renderer desktop. Imposta root su `src/renderer`, base relativa, alias, porta dev configurabile e manual chunks per AntD e markdown.
- `vite.website.config.ts`: configurazione Vite del sito marketing. Root `website`, porta dedicata, preview separata e chunking per AntD/GSAP.

### Script e asset di build

- `scripts/dev-main.mjs`: aspetta che il dev server Vite sia attivo, compila il main process e lancia Electron in development. Evita race condition tra renderer e bootstrap Electron.
- `scripts/generate-app-icon.mjs`: legge `build/icon-source.svg`, genera PNG 512, copia l'icona nel renderer e nel website public, poi costruisce l'ICO multi-size. E lo script che rende coerente tutta la brand identity.
- `scripts/run-electron.mjs`: wrapper che invoca il CLI di Electron via Node, ripulisce `ELECTRON_RUN_AS_NODE` e propaga i segnali di terminazione. Serve sia a dev che a start locale.
- `scripts/set-version.mjs`: calcola una versione semver a partire dai commit convenzionali dalla root history, aggiorna `package.json`, `package-lock.json` e badge nel README, poi crea un commit `build(release): vX.Y.Z`. E molto opinionato: ha side effect Git, non solo file system.
- `build/icon-attribution.md`: dichiara che l'icona e originale e non richiede attribution esterna. Documentazione di compliance.
- `build/icon-source.svg`: sorgente vettoriale "master" dell'icona, con rettangoli connessi da tracciati; visivamente richiama merge/branch di nodi video. File da cui derivano PNG e ICO.
- `build/icon.svg`: copia del sorgente SVG resa disponibile come output build-friendly. Al momento e identico a `icon-source.svg`.
- `build/icon.png`: icona PNG generata, circa 14 KB, usata anche in renderer e website. Artefatto binario derivato, non sorgente.
- `build/icon.ico`: icona Windows multi-resolution generata, circa 372 KB. Serve al packaging portable via Electron Builder.
- `assets/screen-1.png`: screenshot binario del prodotto, circa 101 KB, usato nella landing page come schermata hero primaria.
- `assets/screen-2.png`: screenshot binario del prodotto, circa 99 KB, usato per mostrare setup/export planning nel sito.
- `assets/screen-3.png`: screenshot binario del prodotto, circa 92 KB, usato per mostrare history/compression mode nel sito.

### Shared contracts

- `src/shared/types.ts`: barrel minimale che riesporta i tre nuclei di tipi (`video`, `hardware`, `job`). Semplifica gli import nei layer superiori.
- `src/shared/video.types.ts`: tipi di dominio per file di input e impostazioni di conversione. Qui nasce il lessico funzionale dell'app: formato output, preset compressione e backend encoder.
- `src/shared/hardware.types.ts`: modella il profilo di accelerazione hardware, oggi focalizzato su NVIDIA. E pensato per futuri backend aggiuntivi.
- `src/shared/job.types.ts`: contratto dei job, status, log, telemetria e payload IPC per creazione/progresso. E il file piu importante del dominio condiviso.
- `src/shared/ipc.ts`: definisce i nomi dei canali IPC. Mette in chiaro le sei operazioni pubbliche tra renderer e main.
- `src/shared/ipc.types.ts`: descrive l'interfaccia `ElectronApi` esposta dal preload. Chiude il cerchio tipico main-preload-renderer.

### Main process bootstrap, config e IPC

- `src/main/main.ts`: entrypoint Electron. Crea la finestra, gestisce dev/prod, scorciatoie DevTools, preload sicuro, menu nascosto in produzione e wiring di servizi/IPC.
- `src/main/preload.ts`: espone in `window.electronAPI` le cinque operazioni asincrone e la sottoscrizione al progresso job. Il bridge e stretto e corretto per `contextIsolation`.
- `src/main/ipc/ipc-routes.ts`: registra e resetta gli handler IPC. E volutamente sottile: non contiene business logic, solo routing verso servizi.
- `src/main/config/electron-app-config.types.ts`: typing del JSON di configurazione Electron. Copre runtime, finestra e comportamento DevTools.
- `src/main/config/electron-app-config.ts`: legge `electron.app.config.json` dal filesystem e lo cast a `ElectronAppConfig`. Semplice adapter runtime.
- `src/main/types/ffprobe-static.d.ts`: declaration file per `ffprobe-static`, necessaria per import tipizzato in TypeScript.

### Main services generali

- `src/main/services/main-process-services.ts`: factory memoizzata che istanzia `StorageService`, `FfmpegService`, `FilePickerService` e `JobService`. E il mini-container di dependency injection del main process.
- `src/main/services/binary-path.utils.ts`: corregge i path dei binari dentro `app.asar` verso `app.asar.unpacked` e verifica l'esistenza del file. Risolve un problema classico di packaging Electron.
- `src/main/services/ffmpeg.types.ts`: tipi di supporto per FFmpeg, inclusi update di progresso, argomenti encoder e opzioni merge/compression. Tiene pulito `ffmpeg.service.ts`.
- `src/main/services/ffmpeg.service.ts`: cuore della pipeline video. Decide i parametri CPU/NVENC/VP9, sonda capacita hardware, delega la costruzione dei comandi a utility funzionali e trasforma il progresso FFmpeg in update UI leggibili. Il merge usa `filter_complex`, non piu concat demuxer basato su file temporaneo.
- `src/main/services/file-picker.service.ts`: apre dialog nativi per scegliere video o cartella di output e restituisce DTO con nome/path/size. E il punto di ingresso fisico dei file locali.
- `src/main/services/storage.types.ts`: tipi per path globali e cartelle job-specifiche. Serve quasi solo a documentare `StorageService`.
- `src/main/services/storage.service.ts`: gestisce root/output sotto `userData/video-merger` e crea cartelle per job. Non persiste metadata dei job, solo filesystem operativo.
- `src/main/services/media-probe.service.ts`: usa `ffprobe-static` per ottenere durata e metadati di stream video/audio (codec, frame rate, dimensioni, sample rate, canali). In caso di errore restituisce `null`, favorendo un fallback UI e non un crash.
- `src/main/services/job.types.ts`: arricchisce `Job` con campi interni (`sourcePaths`) e definisce il payload interno di pubblicazione eventi. Separa contratto pubblico da stato di orchestrazione.
- `src/main/services/job.service.ts`: orchestra coda, stato, pubblicazione eventi e transizione `queued -> running -> completed/error`. E seriale, non persistente, senza cancel/retry; ottimo per semplicità, limitato per un carico professionale piu alto.

### Main services dei job

- `src/main/services/job/job-runner.types.ts`: tipi di contesto condivisi tra i runner merge/compression. Evita firme lunghe e duplicate.
- `src/main/services/job/job-progress.utils.ts`: normalizza il progresso di un item dentro un batch compression in un progresso globale 1-99. Piccolo ma importante per una UX coerente.
- `src/main/services/job/job-output-path.service.ts`: genera il nome del merged output e risolve nomi univoci per i file compressi evitando collisioni su disco. E il layer di naming centralizzato.
- `src/main/services/job/job-message.utils.ts`: produce i testi standard per coda, avvio, completamento e fallback CPU/NVENC. Tiene la semantica testuale fuori dal service principale.
- `src/main/services/job/job-log.utils.ts`: crea entry di log con UUID/timestamp e limita il buffer log con deduplica per ID. Utile per non far crescere senza controllo l'array dei log.
- `src/main/services/job/merge-job-runner.service.ts`: runner dedicato al merge. Risolve il path output, lo logga, poi invoca `processSingleMerge` e inoltra progresso/log al `JobService`.
- `src/main/services/job/compression-job-runner.service.ts`: runner per batch compression. Itera i file, calcola il progresso aggregato per item, genera output unici e pubblica messaggi con scope del file corrente.

### Renderer bootstrap, bridge e utilita fondamentali

- `src/renderer/index.html`: HTML root del renderer Electron con CSP meta tag centrata sul dev server locale `127.0.0.1:5173`. In produzione continua ad essere permissiva verso quell'origine ma il carico reale arriva da file locali.
- `src/renderer/main.tsx`: bootstrap React con `StrictMode`, inizializzazione i18n, reset AntD e CSS globale. Entrypoint standard e pulito.
- `src/renderer/App.tsx`: shell principale della UI. Esegue bootstrap di jobs/hardware profile, attiva il listener progresso e decide quale pannello mostrare (`setup`, `output`, `history`).
- `src/renderer/services/ipc.types.ts`: typing locale della window bridge. Piccolo adattatore per non dipendere direttamente da `window` globale non tipizzata.
- `src/renderer/services/ipc.ts`: wrapper sicuro sopra `window.electronAPI`. Fornisce metodi asincroni e no-op subscription quando il renderer non gira dentro Electron, utile per sviluppo isolato o rendering statico.
- `src/renderer/types/electron.d.ts`: estende `Window` con `electronAPI`. Necessario per TypeScript lato browser.
- `src/renderer/hooks/use-job-progress.ts`: effect che sottoscrive gli eventi di progresso una sola volta e inoltra il payload allo store Zustand. E il ponte runtime reattivo tra IPC e UI.
- `src/renderer/theme/app-theme.types.ts`: definisce l'intera shape della palette applicativa custom. Fa capire che il tema non e un override casuale, ma un sistema.
- `src/renderer/theme/app-theme.ts`: genera il tema Ant Design per light/dark mode e scrive anche CSS variables nel DOM. Molto esteso, ma ben organizzato e centrale per l'identita visiva.
- `src/renderer/styles/global.css`: CSS globale della desktop app. Contiene layout dashboard, card styles, switcher, overview, history spotlight e responsive behavior.

### Renderer store Zustand

- `src/renderer/store/app-store.types.ts`: definisce slices, stato globale e tipi di supporto del renderer store. E il contratto completo del client state.
- `src/renderer/store/app-store.constants.ts`: default per conversion settings e profilo hardware placeholder/unavailable. Evita magic values negli slice.
- `src/renderer/store/app-store.utils.ts`: helper per appendere file senza duplicati, riordinare la queue e fare upsert del progresso job. Qui si vede bene la logica immutabile del client state.
- `src/renderer/store/app-store.selectors.ts`: selector compatti per bootstrap, composer, overview e preview. Riduce rerender e centralizza le shape lette dai componenti.
- `src/renderer/store/use-app-store.ts`: assembla le slice workspace/settings/hardware/jobs in un singolo store Zustand. Punto unico di stato applicativo.
- `src/renderer/store/ui-store.types.ts`: contratto dello store UI dedicato a tema e pannello workspace. Separa stato "presentazionale" da stato "operativo".
- `src/renderer/store/ui-store.selectors.ts`: selector per provider tema, switcher e workspace panel. Equivalente UI del file selector app.
- `src/renderer/store/use-ui-store.ts`: store Zustand per `themeMode` e `activeWorkspacePanel`, con persistenza del tema in `localStorage` e applicazione immediata al DOM. E una soluzione semplice e pratica.
- `src/renderer/store/slices/workspace.slice.ts`: gestisce selezione video, output directory, job mode e riordino file. Cattura gli errori del bridge Electron senza esporli alla UI.
- `src/renderer/store/slices/settings.slice.ts`: gestisce formato, preset e backend encoder. Contiene una regola importante: se si passa a `webm`, un eventuale backend `nvidia` viene riportato ad `auto`.
- `src/renderer/store/slices/hardware.slice.ts`: carica il profilo hardware dal main process o imposta un placeholder di sessione non disponibile. Tiene separato il loading di capability dal resto del bootstrap.
- `src/renderer/store/slices/jobs.slice.ts`: legge i job iniziali, crea nuovi job e integra gli update di progresso. Resetta i file selezionati al successo della creazione, ma non persiste nulla oltre la sessione.

### Renderer utilita di presentazione

- `src/renderer/utils/file-utils.ts`: helper per byte formatting, estrazione nome file, rimozione estensione e naming preview di output merge/compression. Serve soprattutto alla preview UI.
- `src/renderer/utils/encoder-presentation.ts`: mappa backend e preset in label leggibili, compresi i dettagli tecnici CRF/CQ e le descrizioni contestuali per l'utente. Tiene la UI consistente con la pipeline reale.
- `src/renderer/utils/runtime-presentation.ts`: formatta durata e velocita runtime. Utility piccola ma riusata in preview e drawer dettagli.
- `src/renderer/utils/job-presentation.tsx`: mappa status/mode/stage in label, colori, icone e stato compatibile con il componente `Progress` di AntD. E il lessico visivo dei job.

### Renderer i18n e contenuti testuali

- `src/renderer/i18n/index.ts`: inizializza i18next con risorse inglesi e integrazione React. Nessun language switching dinamico per ora.
- `src/renderer/i18n/en.ts`: aggrega tutti i namespace di traduzione in un unico oggetto `en`. E il registry locale.
- `src/renderer/i18n/resources/app.en.ts`: copy del footer e del loading workspace. Pochi testi globali.
- `src/renderer/i18n/resources/codec-guide.en.ts`: namespace minimale per il titolo della modal codec guide. Il vero contenuto e in Markdown.
- `src/renderer/i18n/resources/common.en.ts`: etichette base condivise (`auto`, `cpu`, `dark`, `light`, `N/A`, ecc.). Fondamentale per non duplicare stringhe.
- `src/renderer/i18n/resources/composer.en.ts`: il namespace piu ricco della UI setup. Definisce card title, bottoni, hint, toast, ruoli dei clip e copy hardware/backend.
- `src/renderer/i18n/resources/compression.en.ts`: traduzioni dei tre preset `light/balanced/strong`. Namespace volutamente piccolo.
- `src/renderer/i18n/resources/details.en.ts`: copy del drawer dettagli job, inclusi label summary, runtime e log.
- `src/renderer/i18n/resources/history.en.ts`: copy della board cronologia, colonne tabella, metriche e stringhe empty/pending.
- `src/renderer/i18n/resources/logs.en.ts`: etichette dei cinque stage di log (`queue`, `prepare`, `encode`, `finalize`, `system`).
- `src/renderer/i18n/resources/modes.en.ts`: etichette umane di `merge` e `compress`.
- `src/renderer/i18n/resources/overview.en.ts`: copy ricco dell'hero/overview, con metriche, step, tag, chip e hint di espansione. E il testo "editoriale" piu forte della desktop UI.
- `src/renderer/i18n/resources/preview.en.ts`: copy del pannello output plan/runtime/latest artifact. Tiene coesa la narrativa della preview.
- `src/renderer/i18n/resources/status.en.ts`: traduzioni degli status dei job. Minimalista e corretto.
- `src/renderer/i18n/resources/theme.en.ts`: tooltip per il cambio tema. Namespace microscopico ma sensato.
- `src/renderer/content/codec-guide.en.md`: guida tecnica leggibile dall'utente su container, codec, backend e preset di compressione. Trasforma decisioni tecniche della pipeline in documentazione in-app.

### Renderer componenti principali

- `src/renderer/components/AppThemeProvider.tsx`: incapsula `ConfigProvider` AntD, locale `enUS`, theme config custom e bootstrap del tema da storage. Fornisce un perimetro UI consistente.
- `src/renderer/components/CodecGuideModal.tsx`: bottone + modal che renderizza il Markdown della guida codec tramite `react-markdown` e `remark-gfm`. E un punto UX utile per spiegare scelte encoding senza uscire dall'app.
- `src/renderer/components/JobBoard.tsx`: tabella cronologia job con statistiche in alto e apertura drawer dettagli al click riga. E il pannello "operational review" dell'app.
- `src/renderer/components/JobComposer.tsx`: il componente piu denso del setup. Coordina store, copy, hardware state, form di export, queue list e toast di lancio job.
- `src/renderer/components/JobDetailsDrawer.tsx`: drawer laterale con summary, telemetria, timeline log, input e output paths. Molto utile per diagnosticare o ripercorrere l'esecuzione.
- `src/renderer/components/MergeOverview.tsx`: hero dashboard con metriche, switch mode, animazioni GSAP e sezione dettagli espandibile. Funziona come testata informativa e selettore di contesto.
- `src/renderer/components/MergePreviewCard.tsx`: pannello output plan che mostra output previsto, stato runtime attivo e ultimo artefatto generato. E il collegamento tra configurazione e risultato.
- `src/renderer/components/ThemeSwitcher.tsx`: switch segmentato dark/light con tooltip. Piccolo ma integrato bene nel sistema tema.
- `src/renderer/components/WorkspaceSwitcher.tsx`: switch segmentato tra `setup`, `output`, `history`; cambia label del tab setup in base al mode corrente. Migliora la leggibilita del flusso.
- `src/renderer/components/job-details-drawer.types.ts`: props type del drawer. File piccolo ma corretto per separare view da type contract.
- `src/renderer/components/theme-switcher.types.ts`: props type del theme switcher. Isola le opzioni `size` e `block`.

### Renderer componenti `job-composer`

- `src/renderer/components/job-composer/job-composer.types.ts`: contiene tutti i contratti props dei sottocomponenti composer. Riduce il rumore tipografico nei file view.
- `src/renderer/components/job-composer/JobComposerHeader.tsx`: header ausiliario con tag queue/hardware e pulsante della codec guide. Sottile ma ben coeso.
- `src/renderer/components/job-composer/JobComposerStats.tsx`: tre statistiche rapide su file selezionati, peso staging e modello di delivery. Densita informativa alta, implementazione semplice.
- `src/renderer/components/job-composer/JobComposerSettingsForm.tsx`: form di export profile con formato, preset, backend e cartella destinazione. Qui si vede chiaramente il coupling controllato fra UI e store setters.
- `src/renderer/components/job-composer/JobComposerAlerts.tsx`: due alert riusabili per ordine timeline e stato hardware/backend. Mantiene chiaro il contesto operativo.
- `src/renderer/components/job-composer/JobComposerActionBar.tsx`: barra azioni `add`, `clear`, `start` con stati disabled/loading. Esegue il minimo indispensabile senza logica complessa.
- `src/renderer/components/job-composer/JobComposerEmptyState.tsx`: empty state warning semplice per quando non ci sono file selezionati. Evita spazi vuoti nel pannello.
- `src/renderer/components/job-composer/MergeSelectionList.tsx`: lista ordinabile per merge con pulsanti up/down/remove, tag `Start/End` e ruolo del clip. Traduce bene il concetto di timeline esplicita.
- `src/renderer/components/job-composer/CompressionSelectionList.tsx`: lista semplificata per batch compression dove l'ordine non ha valore funzionale. Buona differenziazione UX rispetto al merge.
- `src/renderer/components/job-composer/index.ts`: barrel dei sottocomponenti composer. Serve a mantenere puliti gli import del file `JobComposer.tsx`.

### Renderer componenti `overview`

- `src/renderer/components/overview/overview.types.ts`: tipi per copy overview, metriche, header e dettagli. Formalizza l'API interna del modulo.
- `src/renderer/components/overview/get-overview-mode-copy.tsx`: fabbrica del contenuto overview per `merge` e `compress`, inclusi step e chip. Separa bene testo/semantica da rendering.
- `src/renderer/components/overview/OverviewHeader.tsx`: header dell'hero con brand, status badge, theme switcher, expand/collapse e switch di mode. E il punto di controllo piu visibile della UI.
- `src/renderer/components/overview/OverviewMetrics.tsx`: griglia KPI molto semplice. Riceve metriche gia pronte e le renderizza.
- `src/renderer/components/overview/OverviewDetails.tsx`: body espandibile con testo editoriale, chip e step verticali. E la parte "spiegazione" dell'overview.
- `src/renderer/components/overview/index.ts`: barrel del modulo overview. Solo ergonomia import.

### Renderer asset pubblici

- `src/renderer/public/icon.png`: copia PNG dell'icona app, circa 14 KB, usata da `src/renderer/index.html` e come icona finestra in dev. Deriva dallo script di generazione icone.

### Website root, tema e contenuti

- `website/index.html`: HTML root del sito marketing con meta description e favicon locale. Nessun CSP custom, piu semplice del renderer desktop.
- `website/public/icon.png`: copia pubblica dell'icona del progetto per il sito, circa 14 KB. Condivide l'identita con l'app.
- `website/src/vite-env.d.ts`: reference standard ai tipi Vite. Boilerplate corretto.
- `website/src/main.tsx`: bootstrap React del sito con `ConfigProvider` AntD e tema dedicato. Nessuna i18n o store, perche il sito e statico/editoriale.
- `website/src/App.tsx`: compone hero, showcase, highlights e footer; registra `ScrollTrigger` e anima entrata/reveal degli elementi. E il controller della narrazione visuale.
- `website/src/styles.css`: CSS completo del sito, con font Google, layout dark, screenshot panels, section spacing e responsive rules. Costruisce un look editoriale coerente con la desktop UI ma piu scenografico.
- `website/src/theme/site-theme.ts`: tema AntD dedicato al sito, focalizzato su palette dark, bordi morbidi e pulsanti pill. Distinto ma compatibile con il brand della app.
- `website/src/content/site-content.ts`: testi/array strutturati della hero e highlights, piu URL GitHub. Tiene separato contenuto editoriale e layout.
- `website/src/content/site-media.ts`: importa i tre screenshot da `assets/` e li descrive con alt/eyebrow/title/description. E il piccolo catalogo media del sito.

### Website componenti

- `website/src/components/LandingHero.tsx`: hero page con topbar, tag, headline, fact rows, CTA e tre screenshot sovrapposti. E la sezione piu "campaign-like" del sito.
- `website/src/components/ProductShowcase.tsx`: sezione schermate con una figura principale, testo esplicativo e due immagini secondarie. Punta a far parlare le screenshot piu del copy.
- `website/src/components/EditorialHighlights.tsx`: blocco "Why it works" in tre punti numerati. Serve a vendere chiarezza operativa, non feature inflation.
- `website/src/components/SiteFooter.tsx`: footer CTA con tag stack tecnologico, claim finale e link interni. Chiude il racconto del prodotto in modo coerente.

## Conclusione tecnica

- La codebase e ben separata per responsabilita e abbastanza matura per uno strumento desktop locale.
- Il cuore vero del progetto e nella combinazione `JobService` + `FfmpegService` + store renderer: li passa tutto il valore operativo.
- I limiti principali oggi non sono strutturali ma di feature: niente persistenza reale della history, niente cancel/retry, niente test suite, lockfile da ripulire.
