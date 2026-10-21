/**
 * PhotoVedio Editor v3 workbench.
 *
 * Provides:
 * 1. An interactive editor workbench/simulator.
 * 2. Architecture/source inspection for the planned native Android runtime.
 *
 * Native FFmpeg, MediaCodec, ML Kit and GPU execution are not provided by
 * this web workbench alone; they require the target Android runtime layer.
 */

import React, { useState } from 'react';
import {
  Play,
  Code2,
  Cpu,
  Film,
  Download,
  Layers,
  Smartphone,
} from 'lucide-react';
import { NativeEditorSimulator } from './components/NativeEditorSimulator';
import { CodeInspector } from './components/CodeInspector';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { EditorScreen } from './screens/EditorScreen';

type TabType = 'editor' | 'simulator' | 'code' | 'architecture';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('editor');

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-[#00f2fe]/30 selection:text-[#00f2fe]">
      <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-[#00f2fe] flex items-center justify-center shadow-[0_0_18px_rgba(0,242,254,0.4)]">
              <Film size={20} className="text-zinc-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm lg:text-base font-black tracking-tight text-white">
                  PhotoVedio Editor v3
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-400/10 text-cyan-400 border border-cyan-400/30">
                  Consolidated
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                v1 + v2 editor architecture • v3 workbench • native-ready adapters
              </p>
            </div>
          </div>

          <div className="flex items-center bg-[#121215] p-1 rounded-xl border border-zinc-800">
            <button onClick={() => setActiveTab('editor')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'editor' ? 'bg-zinc-800 text-cyan-400 shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}`}>
              <Smartphone size={14} />
              <span>Editor</span>
            </button>
            <button onClick={() => setActiveTab('simulator')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'simulator' ? 'bg-zinc-800 text-cyan-400 shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}`}>
              <Play size={14} />
              <span>Studio</span>
            </button>
            <button onClick={() => setActiveTab('code')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'code' ? 'bg-zinc-800 text-cyan-400 shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}`}>
              <Code2 size={14} />
              <span>Source</span>
            </button>
            <button onClick={() => setActiveTab('architecture')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'architecture' ? 'bg-zinc-800 text-cyan-400 shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}`}>
              <Cpu size={14} />
              <span>Blueprint</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => setActiveTab('code')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-700 transition">
              <Code2 size={13} className="text-cyan-400" />
              <span>Inspect Source</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/20 via-zinc-900/40 to-transparent border border-cyan-500/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
            <span className="font-semibold text-zinc-300">Editor workbench:</span>
            <span className="text-cyan-400 font-mono hidden sm:inline">React UI + platform adapters + native Android target</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
            <span>Android target: minSdk 24</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">Native runtime required for real encoding/AI</span>
          </div>
        </div>

        {activeTab === 'editor' && <EditorScreen onOpenCodeInspector={() => setActiveTab('code')} />}

        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <NativeEditorSimulator onOpenCodeInspector={() => setActiveTab('code')} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 space-y-1"><span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">GPU</span><p className="text-xs text-zinc-300 font-semibold">Shader architecture</p><p className="text-[11px] text-zinc-500">Rendering effects are organized behind the editor pipeline.</p></div>
              <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 space-y-1"><span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Timeline</span><p className="text-xs text-zinc-300 font-semibold">Multi-track editing</p><p className="text-[11px] text-zinc-500">Video, audio, text and cutout layers share one timeline model.</p></div>
              <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 space-y-1"><span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Export</span><p className="text-xs text-zinc-300 font-semibold">Codec-ready configuration</p><p className="text-[11px] text-zinc-500">H.264/HEVC settings are represented by platform-neutral adapters.</p></div>
              <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 space-y-1"><span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Android</span><p className="text-xs text-zinc-300 font-semibold">Native runtime boundary</p><p className="text-[11px] text-zinc-500">Actual MediaCodec, FFmpeg and ML execution belongs in Android.</p></div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div><h2 className="text-base font-black text-white">Source & architecture</h2><p className="text-xs text-zinc-400">Reference source for the planned native Android implementation.</p></div>
              <Download size={16} className="text-cyan-400" />
            </div>
            <CodeInspector />
          </div>
        )}

        {activeTab === 'architecture' && <ArchitectureDiagram />}
      </main>

      <footer className="mt-auto border-t border-zinc-800 bg-[#09090b] px-4 py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PhotoVedio Editor v3 • Consolidated v1 + v2 + v3 workbench</span>
          <span className="font-mono text-[11px] text-cyan-400/80"><Layers size={12} className="inline mr-1" /> Native Android integration remains a separate runtime layer</span>
        </div>
      </footer>
    </div>
  );
}
