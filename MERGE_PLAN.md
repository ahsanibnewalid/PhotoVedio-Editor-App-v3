# v1 → v2 → v3 Consolidation

v3 is now the consolidation target for the PhotoVedio Editor family.

## Source repositories

- v1: https://github.com/ahsanibnewalid/PhotoVedio-Editor-App
- v2: https://github.com/ahsanibnewalid/PhotoVedio-Editor-App-v2
- v3: https://github.com/ahsanibnewalid/PhotoVedio-Editor-App-v3

## Strategy

The merge is capability-first rather than a blind overwrite:

1. Preserve v3's AI Studio work and current components.
2. Restore v2's missing editor architecture where v3 had lost it.
3. Keep v1 functionality that was already integrated into v2.
4. Resolve conflicts in favor of the newest working implementation.
5. Keep native Android operations behind explicit adapters.

## Restored v2 architecture

- `src/screens/EditorScreen.tsx`
- `src/shaders/MotionBlurShader.js`
- `src/types/editor.ts`
- `src/utils/mediaPipeline.ts`
- `src/utils/sampleMedia.ts`
- `src/utils/DeviceCapabilityDetector.ts`
- `src/utils/UniversalProxyManager.ts`
- `src/hooks/useTimelineHistory.ts`

## v1/v2 capabilities preserved in v3

- Multi-track editing
- Audio-track model
- LUT presets
- 3D LUT-ready shader pipeline
- Motion blur/cinematic rendering
- Subject cutout/segmentation model
- Transitions
- Proxy/performance architecture
- Export settings and presets
- H.264/HEVC hardware-oriented export configuration
- FFmpeg/MediaCodec adapter boundary

## v3 capabilities preserved

- AI Studio-generated workbench
- Studio Simulator
- Code Inspector
- Architecture Diagram
- Export Settings Studio
- Interactive Timeline
- MultiTrackTimeline
- PreviewViewport
- Existing data/components/hooks

## Current limitations

The web workbench is not itself a native Android runtime. Native FFmpeg, MediaCodec, ML Kit/AI execution and production GPU processing still require the Android implementation and device validation.

Audio waveform data is supported at the editor model level. Native waveform extraction from arbitrary media is still a runtime task.

## Rule

Never label an adapter, simulator or placeholder as production-native functionality until it is implemented and tested on the target Android runtime.
