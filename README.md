# PhotoVedio Editor App v3

The **v3 repository is the consolidated development project** for PhotoVedio Editor. It combines the strongest editor architecture and advanced media concepts from **v1 + v2** with the current v3/Google AI Studio work.

## Repository lineage

- **v1 — original source:** https://github.com/ahsanibnewalid/PhotoVedio-Editor-App
- **v2 — architecture and advanced merge:** https://github.com/ahsanibnewalid/PhotoVedio-Editor-App-v2
- **v3 — current consolidated project:** https://github.com/ahsanibnewalid/PhotoVedio-Editor-App-v3

## What v3 contains

### Recovered from v2/v1
- Dedicated `screens/` architecture with the main EditorScreen
- Dedicated `shaders/` directory and directional motion-blur shader
- Shared editor type system for clips, transitions, audio, cutouts, LUTs, proxies and export presets
- Multi-track timeline
- Audio-track model with waveform-ready data
- Preview viewport with filters/LUT/cutout/transition support
- Export Settings Studio
- Device capability and adaptive proxy abstractions
- Timeline history hook
- Platform-neutral native media pipeline boundary
- Existing v3 Studio Simulator, Code Inspector, Architecture Diagram and AI Studio work

### Current v3 editor
- Responsive editor workbench
- Video preview
- Multi-track timeline
- Audio track/waveform-ready data
- Clip splitting at the playhead
- LUT/filter controls
- Aspect-ratio controls
- Export Studio
- AI tool entry points
- Native source/architecture inspection

## AI architecture

AI features are intentionally modular. The UI can expose tools such as:

- Background removal / subject segmentation
- Auto captions
- Smart crop/reframe
- Subject/object tracking
- Audio enhancement
- Auto color enhancement

The repository must distinguish between a UI/adapter and actual native or cloud execution. No AI provider key is hardcoded into the project.

## Native media architecture

```text
Editor UI
   ↓
Application services / adapters
   ↓
Native media pipeline
   ├── FFmpeg
   ├── Android MediaCodec
   ├── ML Kit / AI runtime
   └── GPU / Skia
```

The current web workbench does not make native Android execution magically available. Native FFmpeg, MediaCodec, ML Kit and GPU implementations still require the target Android runtime layer and device testing.

## Audio workflow

The timeline supports an audio-track model containing:

- title
- start time
- duration
- volume
- fade-in
- fade-out
- mute state
- waveform sample data

The waveform UI/renderer should be treated as an editing visualization until native media decoding/waveform extraction is connected.

## Export workflow

Export Studio supports the architecture for:

- 720p / 1080p / 4K
- 30 / 60 FPS
- H.264 / HEVC hardware-oriented codecs
- bitrate profiles
- aspect ratios
- platform presets

Actual native encoding remains an Android runtime responsibility.

## Architecture

```text
PhotoVedio-Editor-App-v3/
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── screens/
│   ├── shaders/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── README.md
├── package.json
└── ...
```

## Development

```bash
git clone https://github.com/ahsanibnewalid/PhotoVedio-Editor-App-v3.git
cd PhotoVedio-Editor-App-v3
npm install
npm run dev
```

Build:

```bash
npm run build
```

Type-check/lint script:

```bash
npm run lint
```

## Production status

**Active development.** v3 is the consolidation target, but it should not be called a production-ready native Android editor until the native runtime, real media processing, export, AI execution, performance, and device testing are completed.

## Documentation

- `CONSOLIDATION.md` — v1/v2/v3 consolidation record
- `MERGE_PLAN.md` — historical v1 → v2 merge plan, retained as provenance

## Principle

Do not delete working functionality to make the project smaller. Prefer modular adapters, reusable editor components, clear feature boundaries, and explicit status labels for implemented vs architecture-only functionality.

## License

See the repository license for current licensing information.
