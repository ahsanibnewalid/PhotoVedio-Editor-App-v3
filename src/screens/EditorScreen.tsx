import React, { useMemo, useState } from 'react';
import { Download, Music, Sparkles, Scissors, Wand2 } from 'lucide-react';
import { PreviewViewport } from '../components/PreviewViewport';
import { MultiTrackTimeline } from '../components/MultiTrackTimeline';
import { ExportSettingsStudio } from '../components/ExportSettingsStudio';
import { VideoClipSegment, TextOverlayItem, OverlayCutoutItem, AudioTrackItem, AspectRatioType, FilterType, LutPresetType } from '../types/editor';

interface EditorScreenProps { onOpenCodeInspector?: () => void; }

const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

function makeWaveform(seed = 7, length = 96) {
  let value = seed >>> 0;
  return Array.from({ length }, () => { value = (value * 1664525 + 1013904223) >>> 0; return 0.18 + ((value / 4294967295) * 0.82); });
}

export const EditorScreen: React.FC<EditorScreenProps> = ({ onOpenCodeInspector }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(15);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [filterType, setFilterType] = useState<FilterType>('NORMAL');
  const [activeLut, setActiveLut] = useState<LutPresetType>('NONE');
  const [exportOpen, setExportOpen] = useState(false);
  const [aiNotice, setAiNotice] = useState('AI tools are modular and ready for native/provider adapters.');

  const [clips, setClips] = useState<VideoClipSegment[]>([
    { id:'clip-1', name:'Main video', startTime:0, endTime:8, duration:8, color:'#00f2fe' },
    { id:'clip-2', name:'Second segment', startTime:8, endTime:15, duration:7, color:'#38bdf8', transitionIn:{id:'t1',type:'DISSOLVE',duration:.5,targetClipId:'clip-2',curve:'ease-in-out'} }
  ]);
  const [selectedClipId, setSelectedClipId] = useState<string>('clip-1');
  const texts: TextOverlayItem[] = useMemo(() => [{ id:'caption-1', text:'PhotoVedio Editor', startTime:0.5, endTime:5, xPercent:50, yPercent:18, fontSize:22, color:'#fff', glow:true, layerPosition:'IN_FRONT_OF_SUBJECT' }], []);
  const cutouts: OverlayCutoutItem[] = useMemo(() => [{ id:'subject-1', name:'AI Subject', type:'AI_CUTOUT', startTime:0, endTime:duration, maskActive:true, depthOfFieldBlur:6, subjectGlow:true, glowColor:'#00f2fe', xPercent:50, yPercent:50, scale:1 }], [duration]);
  const audios: AudioTrackItem[] = useMemo(() => [{ id:'audio-1', title:'Music / Voice track', startTime:0, duration, volume:1, fadeInSeconds:.4, fadeOutSeconds:.6, muted:false, waveform:makeWaveform() }], [duration]);

  const splitClip = (clipId: string, time: number) => {
    const index = clips.findIndex(c => c.id === clipId); if(index < 0) return;
    const c = clips[index]; if(time <= c.startTime || time >= c.endTime) return;
    const a={...c,id:`${c.id}-a`,endTime:time,duration:time-c.startTime};
    const b={...c,id:`${c.id}-b`,startTime:time,duration:c.endTime-time};
    const next=[...clips]; next.splice(index,1,a,b); setClips(next); setSelectedClipId(b.id);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-zinc-800 bg-[#121215] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 p-4">
          <div><h2 className="text-lg font-black">PhotoVedio Editor v3</h2><p className="text-xs text-zinc-500">Consolidated v1 + v2 editor architecture with AI Studio work.</p></div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setAiNotice('AI subject segmentation requested. Connect the native ML/AI adapter to execute it.'); }} className="flex items-center gap-2 rounded-xl bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300 border border-cyan-500/20"><Sparkles size={14}/> AI Tools</button>
            <button onClick={() => setExportOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#ff9500] px-3 py-2 text-xs font-black text-black"><Download size={14}/> Export Studio</button>
          </div>
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <PreviewViewport videoUrl={SAMPLE_VIDEO} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(v => !v)} currentTime={currentTime} duration={duration} onTimeUpdate={setCurrentTime} aspectRatio={aspectRatio} filterType={filterType} activeLut={activeLut} texts={texts} cutouts={cutouts} />
          <aside className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
            <div className="text-xs font-black uppercase tracking-wider text-zinc-400">Quick tools</div>
            <button onClick={() => setFilterType(v => v === 'NORMAL' ? 'HIGH_CONTRAST' : 'NORMAL')} className="flex w-full items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs"><Wand2 size={14}/> Toggle cinematic filter</button>
            <button onClick={() => setActiveLut(v => v === 'NONE' ? 'TEAL_ORANGE' : 'NONE')} className="flex w-full items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs"><Sparkles size={14}/> Toggle LUT</button>
            <button onClick={() => setCurrentTime(Math.max(0,currentTime-1))} className="flex w-full items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs"><Scissors size={14}/> Previous second</button>
            <button onClick={() => splitClip(selectedClipId,currentTime)} className="flex w-full items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs"><Scissors size={14}/> Split at playhead</button>
            <button onClick={() => setAiNotice('Auto-caption pipeline ready: speech-to-text provider/native adapter required for execution.')} className="flex w-full items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs"><Music size={14}/> AI captions</button>
            <div className="rounded-lg bg-zinc-900/70 p-2 text-[10px] text-zinc-500">{aiNotice}</div>
            <div className="flex gap-2 pt-1">{(['9:16','16:9','1:1','4:5'] as AspectRatioType[]).map(r => <button key={r} onClick={()=>setAspectRatio(r)} className={`rounded-lg px-2 py-1 text-[10px] ${aspectRatio===r?'bg-cyan-400 text-black':'bg-zinc-900 text-zinc-400'}`}>{r}</button>)}</div>
          </aside>
        </div>
        <div className="border-t border-zinc-800 p-3">
          <MultiTrackTimeline currentTime={currentTime} totalDuration={duration} onSeek={setCurrentTime} clips={clips} selectedClipId={selectedClipId} onSelectClip={setSelectedClipId} onSplitClip={splitClip} texts={texts} cutouts={cutouts} audios={audios} />
        </div>
      </div>
      <ExportSettingsStudio isOpen={exportOpen} onClose={() => setExportOpen(false)} aspectRatio={aspectRatio} currentFilter={filterType} duration={duration} activeMediaTitle="PhotoVedio-v3-project" />
      {onOpenCodeInspector && <button onClick={onOpenCodeInspector} className="text-xs text-zinc-500 hover:text-cyan-300">Open native source inspector</button>}
    </section>
  );
};
