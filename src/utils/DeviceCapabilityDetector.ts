export type PerformanceTier = 'BUDGET_LOW_RAM' | 'MID_RANGE' | 'FLAGSHIP_HIGH';
export type ChipsetVendor = 'MEDIATEK' | 'QUALCOMM' | 'SAMSUNG_EXYNOS' | 'UNISOC' | 'ARM_MALI' | 'APPLE' | 'GENERIC_EMULATOR';

export interface DeviceHardwareProfile {
  tier: PerformanceTier;
  tierName: string;
  tierDescription: string;
  ramGB: number;
  cpuCores: number;
  gpuRenderer: string;
  gpuVendor: string;
  chipsetVendor: ChipsetVendor;
  isLowRam: boolean;
  maxTextureSize: number;
  jsHeapLimitMB: number;
  supportsHardwareMediaCodec: boolean;
  benchmarkScore: number;
  detectedAt: number;
}

export interface TierOptimizationRules {
  tier: PerformanceTier;
  maxPreviewResolution: '480p' | '720p' | '1080p';
  recommendedProxyQuality: '480p_30' | '720p_30' | '720p_60';
  targetPreviewFps: 30 | 60;
  maxSimultaneousTracks: number;
  skiaCanvasDownscale: number;
  disableHeavyShaders: boolean;
  safeHeapThresholdMB: number;
  cacheEvictionThresholdMB: number;
  codecBufferQueueSize: number;
  hardwareEncoderName: string;
}

let cachedProfile: DeviceHardwareProfile | null = null;

function runMicroBenchmark(): number {
  try {
    const start = performance.now();
    let acc = 0;
    for (let i = 0; i < 200000; i++) acc += Math.sin(i * 0.01) * Math.cos(i * 0.02);
    void acc;
    const delta = performance.now() - start;
    if (delta <= 2.5) return 95;
    if (delta <= 5) return 80;
    if (delta <= 10) return 60;
    if (delta <= 18) return 38;
    return 20;
  } catch { return 50; }
}

function probeGPU() {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return { renderer: 'Software / Canvas2D Fallback', vendor: 'Unknown', maxTextureSize: 2048 };
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) || 'Generic GPU';
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR) || 'Generic Vendor';
    return { renderer: String(renderer), vendor: String(vendor), maxTextureSize: Number(gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096) };
  } catch { return { renderer: 'Generic GPU', vendor: 'Unknown', maxTextureSize: 2048 }; }
}

function identifyChipsetVendor(renderer: string, vendor: string): ChipsetVendor {
  const normalized = `${renderer} ${vendor}`.toLowerCase();
  if (normalized.includes('mtk') || normalized.includes('mediatek') || normalized.includes('dimensity') || normalized.includes('helio')) return 'MEDIATEK';
  if (normalized.includes('adreno') || normalized.includes('qualcomm')) return 'QUALCOMM';
  if (normalized.includes('xclipse') || normalized.includes('exynos')) return 'SAMSUNG_EXYNOS';
  if (normalized.includes('powervr') || normalized.includes('unisoc') || normalized.includes('spreadtrum')) return 'UNISOC';
  if (normalized.includes('mali') || normalized.includes('bifrost') || normalized.includes('valhall')) return 'ARM_MALI';
  if (normalized.includes('apple')) return 'APPLE';
  return 'GENERIC_EMULATOR';
}

export function detectDeviceCapabilities(): DeviceHardwareProfile {
  if (cachedProfile) return cachedProfile;
  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const ramGB = nav && 'deviceMemory' in nav ? Number((nav as Navigator & { deviceMemory?: number }).deviceMemory || 4) : 4;
  const cpuCores = nav?.hardwareConcurrency || 4;
  const gpu = probeGPU();
  const benchmarkScore = runMicroBenchmark();
  const chipsetVendor = identifyChipsetVendor(gpu.renderer, gpu.vendor);
  const jsHeapLimitMB = typeof performance !== 'undefined' && 'memory' in performance ? Math.round(((performance as Performance & { memory?: { jsHeapSizeLimit: number } }).memory?.jsHeapSizeLimit || 0) / 1048576) || (ramGB <= 4 ? 384 : ramGB <= 6 ? 640 : 1024) : (ramGB <= 4 ? 384 : ramGB <= 6 ? 640 : 1024);
  const flagshipGpu = /adreno 7|mali-g7|mali-g71|immortalis|apple a1[6-9]|apple m|rtx|geforce/i.test(gpu.renderer);
  const budgetGpu = /mali-g52|mali-g57 mc1|mali-400|powervr|adreno 50[56]|adreno 610/i.test(gpu.renderer);
  const tier: PerformanceTier = ramGB <= 4 || cpuCores <= 4 || budgetGpu || benchmarkScore < 45 || jsHeapLimitMB < 450 ? 'BUDGET_LOW_RAM' : (ramGB >= 12 || flagshipGpu) && benchmarkScore >= 80 ? 'FLAGSHIP_HIGH' : 'MID_RANGE';
  const metadata = {
    BUDGET_LOW_RAM: ['Budget / Low-RAM Tier', 'Optimized for low-memory devices.'],
    MID_RANGE: ['Mid-Range Balanced Tier', 'Balanced preview and multi-track editing.'],
    FLAGSHIP_HIGH: ['High-Performance Flagship Tier', 'High-memory, multi-core editing profile.'],
  } as const;
  cachedProfile = { tier, tierName: metadata[tier][0], tierDescription: metadata[tier][1], ramGB, cpuCores, gpuRenderer: gpu.renderer, gpuVendor: gpu.vendor, chipsetVendor, isLowRam: tier === 'BUDGET_LOW_RAM', maxTextureSize: gpu.maxTextureSize, jsHeapLimitMB, supportsHardwareMediaCodec: true, benchmarkScore, detectedAt: Date.now() };
  return cachedProfile;
}

export function getTierOptimizationRules(tier: PerformanceTier): TierOptimizationRules {
  if (tier === 'BUDGET_LOW_RAM') return { tier, maxPreviewResolution: '480p', recommendedProxyQuality: '480p_30', targetPreviewFps: 30, maxSimultaneousTracks: 2, skiaCanvasDownscale: 0.5, disableHeavyShaders: true, safeHeapThresholdMB: 220, cacheEvictionThresholdMB: 250, codecBufferQueueSize: 2, hardwareEncoderName: 'c2.android.avc.encoder' };
  if (tier === 'MID_RANGE') return { tier, maxPreviewResolution: '720p', recommendedProxyQuality: '720p_60', targetPreviewFps: 60, maxSimultaneousTracks: 4, skiaCanvasDownscale: 0.75, disableHeavyShaders: false, safeHeapThresholdMB: 500, cacheEvictionThresholdMB: 650, codecBufferQueueSize: 4, hardwareEncoderName: 'c2.mtk.avc.encoder' };
  return { tier, maxPreviewResolution: '1080p', recommendedProxyQuality: '720p_60', targetPreviewFps: 60, maxSimultaneousTracks: 8, skiaCanvasDownscale: 1, disableHeavyShaders: false, safeHeapThresholdMB: 1200, cacheEvictionThresholdMB: 2000, codecBufferQueueSize: 8, hardwareEncoderName: 'c2.android.avc.encoder' };
}

export function isLowRamDevice(): boolean { return detectDeviceCapabilities().isLowRam; }
export function resetDeviceCapabilityCache(): void { cachedProfile = null; }
