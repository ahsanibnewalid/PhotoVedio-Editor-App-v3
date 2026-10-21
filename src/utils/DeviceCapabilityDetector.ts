export type PerformanceTier = 'BUDGET_LOW_RAM' | 'MID_RANGE' | 'FLAGSHIP';
export interface DeviceHardwareProfile { tier: PerformanceTier; tierName: string; ramGB: number; cpuCores: number; gpuRenderer: string; supportsHardwareHEVC: boolean; }

export function detectDeviceCapabilities(): DeviceHardwareProfile {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  const cores = nav?.hardwareConcurrency || 4;
  const memory = (nav as Navigator & { deviceMemory?: number } | undefined)?.deviceMemory || 4;
  const tier: PerformanceTier = memory <= 4 || cores <= 4 ? 'BUDGET_LOW_RAM' : memory <= 8 || cores <= 8 ? 'MID_RANGE' : 'FLAGSHIP';
  return { tier, tierName: tier === 'BUDGET_LOW_RAM' ? 'Budget Low-RAM' : tier === 'MID_RANGE' ? 'Mid-Range' : 'Flagship', ramGB: memory, cpuCores: cores, gpuRenderer: 'Browser/WebGL', supportsHardwareHEVC: false };
}
