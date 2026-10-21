export interface SampleMediaItem {
  id: string;
  title: string;
  tag: string;
  duration: number;
  videoUrl: string;
  posterUrl: string;
  recommendedFilter: 'NORMAL' | 'NEON_GLOW' | 'GRAYSCALE' | 'SEPIA';
  description: string;
}

export const SAMPLE_MEDIA_LIST: SampleMediaItem[] = [
  { id:'cyberpunk-city', title:'Cyberpunk Neon Streets', tag:'Neon High-Contrast', duration:15, videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', posterUrl:'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80', recommendedFilter:'NEON_GLOW', description:'Cinematic lights for shader testing.' },
  { id:'skate-action', title:'Extreme Skate Park 60FPS', tag:'Fast Action Motion', duration:12, videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', posterUrl:'https://images.unsplash.com/photo-1520045884218-a66e13385802?auto=format&fit=crop&w=600&q=80', recommendedFilter:'NORMAL', description:'Fast motion for playback testing.' },
  { id:'coastal-sunset', title:'Golden Sunset Coastline', tag:'Warm Vintage Landscape', duration:14, videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', posterUrl:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', recommendedFilter:'SEPIA', description:'Landscape media for color grading.' },
  { id:'abstract-motion', title:'Sci-Fi Abstract Geometry', tag:'Monochrome Tech', duration:10, videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', posterUrl:'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80', recommendedFilter:'GRAYSCALE', description:'Geometry and contrast for grading tests.' },
];
