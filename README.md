# MediaHub

A fully local, offline desktop media library manager for Windows.
Built with Electron 29, React 18, Vite 5, and SQLite — no accounts, no cloud, no server.

---

## Features

| Section | What it does |
|---------|-------------|
| 🎮 Games | Scan folders + auto-detect Steam, Epic Games, GOG. Launch directly. |
| 🎵 Music | Scan MP3/FLAC/WAV/OGG/AAC/M4A. Album art, playlists, shuffle. Built-in player. |
| 📹 Videos | Scan MP4/MKV/AVI/MOV. Built-in player with resume. |
| 🎬 Movies | Same as Videos, separate library. |
| 📺 TV Shows | Auto-groups episodes by series (S01E01 naming). |
| 📁 Other | PDFs, EPUBs, ZIPs, documents. Open with system default app. |

**Cross-section:** Global search, favorites, recently opened, grid/list views, context menus.

---

## Quick Start (Development)

### Prerequisites
- **Node.js 18+** — https://nodejs.org
- **Windows** (for full game launcher detection; app runs cross-platform otherwise)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Rebuild native modules for Electron
npm run rebuild

# 3. Run in development
npm run dev
```

> **Note:** Step 2 (`npm run rebuild`) compiles `better-sqlite3` for your Electron version.
> It requires Python and a C++ build toolchain.
> Install with: `npm install -g windows-build-tools` (run as Administrator)
> Or via Visual Studio: install "Desktop development with C++" workload.

---

## Build for Windows

```bash
# Build both NSIS installer AND portable .exe
npm run build:win
```

Output in `dist-electron/`:
- `MediaHub Setup 1.0.0.exe` — NSIS installer (adds to Start Menu, optional desktop shortcut)
- `MediaHub-Portable-1.0.0.exe` — Single-file portable executable

### App Icon

Place a 256×256 (or multi-size) `.ico` file at `build/icon.ico`.
Free tools to convert PNG → ICO: https://icoconvert.com

---

## Project Structure

```
mediahub/
├── electron/
│   ├── main.js       # Electron main process — window, IPC handlers
│   ├── preload.js    # Secure bridge — exposes electron APIs to React
│   ├── db.js         # SQLite layer — all queries, schema, CRUD
│   └── scanner.js    # File scanners — games, music, video, Steam/Epic/GOG
├── src/
│   ├── App.jsx       # Shell layout
│   ├── index.css     # Design system — tokens, components, animations
│   ├── context/
│   │   └── AppContext.jsx  # Global state — music player, toasts, navigation
│   ├── components/
│   │   ├── TitleBar.jsx    # Custom window titlebar + global search
│   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   ├── MediaCard.jsx   # Grid card + list item + context menu
│   │   ├── MusicPlayer.jsx # Bottom player bar (persistent)
│   │   └── VideoPlayer.jsx # Full-screen video overlay
│   └── pages/
│       ├── Games.jsx       # Game library + launcher detection
│       ├── Music.jsx       # Music library + album/artist views
│       ├── Videos.jsx      # Video library
│       ├── Movies.jsx      # Movie library
│       ├── TVShows.jsx     # TV episode library (grouped by series)
│       ├── OtherFiles.jsx  # Document/archive browser
│       ├── Settings.jsx    # Folder management + scan controls
│       └── VideoLibraryPage.jsx  # Shared video page component
├── build/
│   └── icon.ico      # App icon (provide your own)
├── index.html
├── vite.config.js
└── package.json
```

---

## Data Storage

All data is stored locally in `%APPDATA%\MediaHub\`:
- `mediahub.db` — SQLite database (library, settings, favorites, playlists, video progress)

The database is created automatically on first launch.

---

## Game Launcher Detection

MediaHub scans standard installation locations automatically:

| Launcher | Detection method |
|----------|-----------------|
| **Steam** | Reads `steamapps/libraryfolders.vdf`, parses all `appmanifest_*.acf` |
| **Epic Games** | Reads `C:\ProgramData\Epic\EpicGamesLauncher\Data\Manifests\*.item` |
| **GOG Galaxy** | Scans `C:\Program Files (x86)\GOG Galaxy\games\` |
| **Manual** | Add any `.exe` directly via "Add Game" button |

Steam cover art is loaded from Steam's local cache when available.

---

## Keyboard Shortcuts (Video Player)

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `←` / `→` | Seek -10s / +10s |
| `↑` / `↓` | Volume +10% / -10% |
| `F` | Toggle fullscreen |
| `M` | Mute |
| `Esc` | Close player |

---

## Troubleshooting

**`better-sqlite3` fails to install:**
```bash
npm install -g node-gyp
npm install -g windows-build-tools
npm install
npm run rebuild
```

**App shows blank screen in dev:**
Make sure Vite is running on port 5173 before Electron starts.
The `concurrently` + `wait-on` setup handles this automatically.

**Steam games not detected:**
Make sure Steam is installed in the default path, or check that `libraryfolders.vdf` exists in your Steam installation.

**Music metadata not loading:**
`music-metadata` requires proper native compilation. Run `npm run rebuild` after install.

---

## Architecture Notes

- **No IPC abuse** — all heavy work (scanning, DB queries) runs in the main process via `ipcMain.handle`. The renderer only calls lightweight wrappers via `preload.js`.
- **Security** — `contextIsolation: true`, `nodeIntegration: false`. Only `window.electron.*` is exposed.
- **Media playback** — Uses a custom `media://` protocol handler for local file access, enabling native `<audio>` and `<video>` elements without CORS issues.
- **Modular pages** — Videos, Movies, and TV Shows all share `VideoLibraryPage.jsx`; only type/title/icon differ.
