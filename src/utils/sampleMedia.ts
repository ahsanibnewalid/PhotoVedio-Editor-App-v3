export interface SampleMediaItem { id: string; title: string; videoUrl: string; duration: number; thumbnailUrl?: string; }

export const SAMPLE_MEDIA_LIST: SampleMediaItem[] = [
  { id: 'flower', title: 'Sample Flower Video', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', duration: 15 }
];
