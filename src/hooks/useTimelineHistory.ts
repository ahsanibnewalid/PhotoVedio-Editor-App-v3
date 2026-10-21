import { useState, useCallback } from 'react';
import { TimelineSnapshot, VideoClipSegment, TextOverlayItem, OverlayCutoutItem, AudioTrackItem, FilterType, LutPresetType, AspectRatioType } from '../types/editor';

const MAX_HISTORY_LIMIT = 35;

type TimelineState = Omit<TimelineSnapshot, 'actionDescription' | 'timestamp'>;
interface UseTimelineHistoryProps { initialState: TimelineState; }

export function useTimelineHistory({ initialState }: UseTimelineHistoryProps) {
  const [present, setPresent] = useState<TimelineSnapshot>({
    ...initialState,
    videoClips: structuredClone(initialState.videoClips),
    textOverlays: structuredClone(initialState.textOverlays),
    overlayCutouts: structuredClone(initialState.overlayCutouts),
    audioTrack: structuredClone(initialState.audioTrack),
    actionDescription: 'Project Initialized',
    timestamp: Date.now(),
  });
  const [past, setPast] = useState<TimelineSnapshot[]>([]);
  const [future, setFuture] = useState<TimelineSnapshot[]>([]);

  const pushState = useCallback((actionDescription: string, updater: Partial<TimelineState> | ((prev: TimelineSnapshot) => Partial<TimelineState>)) => {
    setPresent(currentPresent => {
      const updates = typeof updater === 'function' ? updater(currentPresent) : updater;
      const newSnapshot: TimelineSnapshot = {
        ...currentPresent,
        ...updates,
        videoClips: updates.videoClips ? structuredClone(updates.videoClips) : currentPresent.videoClips,
        textOverlays: updates.textOverlays ? structuredClone(updates.textOverlays) : currentPresent.textOverlays,
        overlayCutouts: updates.overlayCutouts ? structuredClone(updates.overlayCutouts) : currentPresent.overlayCutouts,
        audioTrack: updates.audioTrack ? structuredClone(updates.audioTrack) : currentPresent.audioTrack,
        actionDescription,
        timestamp: Date.now(),
      };
      setPast(prevPast => [...prevPast, currentPresent].slice(-MAX_HISTORY_LIMIT));
      setFuture([]);
      return newSnapshot;
    });
  }, []);

  const undo = useCallback(() => {
    setPast(prevPast => {
      if (!prevPast.length) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      setPresent(current => {
        setFuture(prevFuture => [current, ...prevFuture]);
        return previous;
      });
      return prevPast.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setFuture(prevFuture => {
      if (!prevFuture.length) return prevFuture;
      const next = prevFuture[0];
      setPresent(current => {
        setPast(prevPast => [...prevPast, current].slice(-MAX_HISTORY_LIMIT));
        return next;
      });
      return prevFuture.slice(1);
    });
  }, []);

  const jumpToHistoryIndex = useCallback((targetIndex: number) => {
    setPast(prevPast => {
      if (targetIndex < 0 || targetIndex >= prevPast.length) return prevPast;
      const target = prevPast[targetIndex];
      setPresent(current => {
        setFuture(prevFuture => [...prevPast.slice(targetIndex + 1), current, ...prevFuture]);
        return target;
      });
      return prevPast.slice(0, targetIndex);
    });
  }, []);

  const resetHistory = useCallback((newState: TimelineState, description = 'New Media Composition Initialized') => {
    setPast([]);
    setFuture([]);
    setPresent({
      ...newState,
      videoClips: structuredClone(newState.videoClips),
      textOverlays: structuredClone(newState.textOverlays),
      overlayCutouts: structuredClone(newState.overlayCutouts),
      audioTrack: structuredClone(newState.audioTrack),
      actionDescription: description,
      timestamp: Date.now(),
    });
  }, []);

  return {
    state: present,
    pushState,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    past,
    future,
    jumpToHistoryIndex,
    resetHistory,
    lastUndoDescription: past.length > 0 ? past[past.length - 1].actionDescription : null,
    nextRedoDescription: future.length > 0 ? future[0].actionDescription : null,
  };
}
