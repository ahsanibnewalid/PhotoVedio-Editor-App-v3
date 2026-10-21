import { ProxySettings, ProxyQuality, ExportSettings } from '../types/editor';
import { DeviceHardwareProfile, detectDeviceCapabilities, getTierOptimizationRules, PerformanceTier } from './DeviceCapabilityDetector';

export interface ProxyResolutionSpec {
  quality: ProxyQuality;
  width: number;
  height: number;
  fps: 30 | 60;
  bitrateKbps: number;
  targetTier: PerformanceTier;
  label: string;
  badgeText: string;
  recommendedFor: string;
}

export const PROXY_SPECS: Record<ProxyQuality, ProxyResolutionSpec> = {
  '480p_30': { quality:'480p_30', width:854, height:480, fps:30, bitrateKbps:1800, targetTier:'BUDGET_LOW_RAM', label:'480p @ 30 FPS', badgeText:'PROXY 480P', recommendedFor:'Budget devices' },
  '540p_30': { quality:'540p_30', width:960, height:540, fps:30, bitrateKbps:2400, targetTier:'BUDGET_LOW_RAM', label:'540p @ 30 FPS', badgeText:'PROXY 540P', recommendedFor:'Battery saver' },
  '720p_30': { quality:'720p_30', width:1280, height:720, fps:30, bitrateKbps:3200, targetTier:'MID_RANGE', label:'720p @ 30 FPS', badgeText:'PROXY 720P', recommendedFor:'Standard editing' },
  '720p_60': { quality:'720p_60', width:1280, height:720, fps:60, bitrateKbps:5000, targetTier:'MID_RANGE', label:'720p @ 60 FPS', badgeText:'PROXY 720P 60FPS', recommendedFor:'Action footage' },
};

export function getAutomaticProxySettings(profile?: DeviceHardwareProfile): ProxySettings {
  const current = profile || detectDeviceCapabilities();
  const rules = getTierOptimizationRules(current.tier);
  return { mode:'PROXY', quality:rules.recommendedProxyQuality, autoGenerateOnImport:true, purgeOnExport:current.tier === 'BUDGET_LOW_RAM', showProxyBadge:true, cacheSizeBytes:current.tier === 'BUDGET_LOW_RAM' ? 120 * 1024 * 1024 : 486 * 1024 * 1024, transcodeSpeedMultiplier: current.chipsetVendor === 'MEDIATEK' ? 3.4 : 3.8 };
}

export function shouldGenerateProxy(sourceWidth:number, sourceHeight:number, profile?:DeviceHardwareProfile): { shouldProxy:boolean; reason:string } {
  const current = profile || detectDeviceCapabilities();
  const high = sourceWidth >= 1920 || sourceHeight >= 1080;
  const is4k = sourceWidth >= 3840 || sourceHeight >= 2160;
  if (current.tier === 'BUDGET_LOW_RAM' && high) return { shouldProxy:true, reason:'Budget hardware: use a 480p proxy for stable playback.' };
  if (current.tier === 'MID_RANGE' && is4k) return { shouldProxy:true, reason:'4K media: use a 720p proxy for smooth scrubbing.' };
  return { shouldProxy:false, reason:'Hardware has sufficient preview headroom.' };
}

export function buildUniversalProxyTranscodeCommand(inputSourcePath:string, outputProxyPath:string, quality:ProxyQuality, profile?:DeviceHardwareProfile): { command:string; codec:string; estimatedTimeSeconds:number } {
  const current = profile || detectDeviceCapabilities();
  const spec = PROXY_SPECS[quality];
  const codec = 'h264_mediacodec';
  const command = ['-y','-hwaccel mediacodec',`-i "${inputSourcePath}"`,`-vf "scale=${spec.width}:${spec.height}:force_original_aspect_ratio=decrease,fps=${spec.fps}"`,`-c:v ${codec}`,`-b:v ${spec.bitrateKbps}k`,'-g 15','-pix_fmt yuv420p','-c:a aac -b:a 128k',`-movflags +faststart "${outputProxyPath}"`].join(' ');
  return { command, codec, estimatedTimeSeconds: Math.max(1, Math.round(15 / (current.tier === 'BUDGET_LOW_RAM' ? 2.2 : 3.8))) };
}

export interface MasterExportOptions { masterSourcePath:string; outputPath:string; exportSettings:ExportSettings; durationSeconds:number; lutFilterApplied?:string; motionBlurActive?:boolean; }
export function buildMasterExportCommand(options:MasterExportOptions): { command:string; targetResolution:string; targetBitrate:string } {
  const { masterSourcePath, outputPath, exportSettings, lutFilterApplied } = options;
  const dimensions = exportSettings.resolution === '4k' ? [3840,2160] : exportSettings.resolution === '1080p' ? [1920,1080] : [1280,720];
  const bitrate = exportSettings.resolution === '4k' ? Math.max(exportSettings.bitrateMbps,35) : exportSettings.resolution === '1080p' ? Math.min(exportSettings.bitrateMbps,20) : Math.min(exportSettings.bitrateMbps,10);
  const codec = exportSettings.codec === 'HEVC_HW' ? 'hevc_mediacodec' : 'h264_mediacodec';
  const filters = [`scale=${dimensions[0]}:${dimensions[1]}:flags=lanczos`,`fps=${exportSettings.frameRate}`];
  if (lutFilterApplied && lutFilterApplied !== 'NONE') filters.push('curves=preset=cross_process');
  const command = ['-y','-hwaccel mediacodec',`-i "${masterSourcePath}"`,`-vf "${filters.join(',')}"`,`-c:v ${codec}`,`-b:v ${bitrate}M`,'-pix_fmt yuv420p','-c:a aac -b:a 256k',`-movflags +faststart "${outputPath}"`].join(' ');
  return { command, targetResolution:`${dimensions[0]}x${dimensions[1]}`, targetBitrate:`${bitrate} Mbps (${codec})` };
}

export function estimateProxyFootprintBytes(durationSeconds:number, quality:ProxyQuality):number { return Math.round((PROXY_SPECS[quality].bitrateKbps * 1000 / 8) * durationSeconds); }
export function formatBytes(bytes:number):string { if (bytes <= 0) return '0 B'; const units=['B','KB','MB','GB']; const i=Math.min(units.length-1, Math.floor(Math.log(bytes)/Math.log(1024))); return `${(bytes/Math.pow(1024,i)).toFixed(1)} ${units[i]}`; }
