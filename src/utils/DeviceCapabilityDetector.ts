export type PerformanceTier = 'BUDGET_LOW_RAM' | 'MID_RANGE' | 'FLAGSHIP';
export interface DeviceHardwareProfile { tier: PerformanceTier; tierName: string; ramGB: number; cpuCores: number; gpuRenderer: string; supportsHardwareHEVC: boolean; jsHeapLimitMB: number; isLowRam: boolean; }
export interface TierOptimizationRules { safeHeapThresholdMB: number; recommendedProxyQuality: '720p_60'|'720p_30'|'540p_30'|'480p_30'; }

export function detectDeviceCapabilities(): DeviceHardwareProfile {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  const cores = nav?.hardwareConcurrency || 4;
  const memory = (nav as Navigator & { deviceMemory?: number } | undefined)?.deviceMemory || 4;
  const tier: PerformanceTier = memory <= 4 || cores <= 4 ? 'BUDGET_LOW_RAM' : memory <= 8 || cores <= 8 ? 'MID_RANGE' : 'FLAGSHIP';
  return { tier, tierName: tier === 'BUDGET_LOW_RAM' ? 'Budget Low-RAM' : tier === 'MID_RANGE' ? 'Mid-Range' : 'Flagship', ramGB: memory, cpuCores: cores, gpuRenderer: 'Browser/WebGL', supportsHardwareHEVC: false, jsHeapLimitMB: memory <= 4 ? 384 : memory <= 8 ? 768 : 1536, isLowRam: tier === 'BUDGET_LOW_RAM' };
}

export function getTierOptimizationRules(tier: PerformanceTier): TierOptimizationRules {
  if (tier === 'BUDGET_LOW_RAM') return { safeHeapThresholdMB: 240, recommendedProxyQuality: '480p_30' };
  if (tier === 'MID_RANGE') return { safeHeapThresholdMB: 420, recommendedProxyQuality: '720p_30' };
  return { safeHeapThresholdMB: 800, recommendedProxyQuality: '720p_60' };
}
