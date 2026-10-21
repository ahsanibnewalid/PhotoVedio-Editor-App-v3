import { ProxySettings, ProxyQuality } from '../types/editor';
import { detectDeviceCapabilities } from './DeviceCapabilityDetector';

export const PROXY_SPECS: Record<ProxyQuality, { width:number; height:number; fps:number }> = {
  '720p_60': { width:1280, height:720, fps:60 },
  '720p_30': { width:1280, height:720, fps:30 },
  '540p_30': { width:960, height:540, fps:30 },
  '480p_30': { width:854, height:480, fps:30 }
};

export function getAutomaticProxySettings(): ProxySettings {
  const device = detectDeviceCapabilities();
  const quality: ProxyQuality = device.tier === 'BUDGET_LOW_RAM' ? '480p_30' : device.tier === 'MID_RANGE' ? '720p_30' : '720p_60';
  return { mode:'PROXY', quality, autoGenerateOnImport:true, purgeOnExport:true, showProxyBadge:true, cacheSizeBytes:0, transcodeSpeedMultiplier:1 };
}
