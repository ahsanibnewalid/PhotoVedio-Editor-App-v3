# v1 + v2 + v3 Consolidation

## Decision

`PhotoVedio-Editor-App-v3` is now the consolidation target.

The merge strategy is **feature-first**, not blind file replacement:

- v1 supplies original advanced editor concepts.
- v2 supplies the cleaner editor architecture and the v1 advanced-media merge.
- v3 supplies the current AI Studio workbench and newer components.

## Restored into v3

- `src/screens/EditorScreen.tsx`
- `src/shaders/MotionBlurShader.js`
- `src/types/editor.ts`
- `src/utils/mediaPipeline.ts`
- `src/utils/sampleMedia.ts`
- `src/utils/DeviceCapabilityDetector.ts`
- `src/utils/UniversalProxyManager.ts`
- `src/hooks/useTimelineHistory.ts`

Existing v3 `useDeviceThrottle.ts`, data, components and workbench code were retained.

## Preserved v3 work

The existing v3 components are retained rather than overwritten. This includes the Studio Simulator, Code Inspector, Architecture Diagram, Export Settings Studio, Interactive Timeline, MultiTrackTimeline, PreviewViewport and other AI Studio-generated components.

## v1 provenance

Original v1:
https://github.com/ahsanibnewalid/PhotoVedio-Editor-App

Important advanced concepts originating from v1/v2 include multi-track editing, LUT/color grading, subject cutouts, cinematic rendering, export presets and hardware-oriented media processing.

## Status of new capabilities

### Audio

The editor now has an audio-track data model with waveform-ready sample data. Native waveform extraction and native audio rendering still require a real media runtime.

### Export

The existing Export Settings Studio remains available and is wired into the restored EditorScreen. Native H.264/HEVC encoding still requires the Android runtime implementation.

### AI

The v3 editor exposes modular AI entry points and preserves subject-cutout architecture. Actual AI execution should be supplied through a local/native or explicitly authorized provider adapter.

## Non-negotiable rules

1. Do not remove a working v1/v2 feature merely to simplify v3.
2. Do not overwrite the v3 AI Studio work blindly.
3. Resolve conflicts by capability and architecture.
4. Do not claim native execution when only a simulator/adapter exists.
5. Keep secrets and provider API keys out of source control.

## Next engineering stage

The next stage is a build/test pass over the consolidated v3 tree, followed by real native Android integration for media processing, waveform extraction, AI execution and export.
