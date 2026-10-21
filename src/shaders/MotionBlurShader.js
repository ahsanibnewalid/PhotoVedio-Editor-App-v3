/** Directional motion blur shader and browser fallback carried forward from v2. */
export const MOTION_BLUR_SKSL = `uniform shader image; uniform float2 uVelocity; uniform float uSamples; uniform float uIntensity; half4 main(float2 xy){ float samples=max(uSamples,1.0); float2 stepVector=(uVelocity*uIntensity)/samples; half4 accumulatedColor=half4(0.0); float totalWeight=0.0; for(float i=0.0;i<16.0;i+=1.0){if(i>=samples) break; float progress=(i/(samples-1.0))-0.5; float2 sampleCoord=xy+(uVelocity*uIntensity*progress); float weight=clamp(1.0-abs(progress*1.6),0.1,1.0); accumulatedColor+=image.eval(sampleCoord)*weight; totalWeight+=weight;} return accumulatedColor/totalWeight;}`;

export const MOTION_BLUR_WEBGL_FRAG = `precision mediump float; uniform sampler2D uTexture; uniform vec2 uVelocity; uniform float uIntensity; uniform float uSamples; uniform vec2 uResolution; varying vec2 vTexCoord; void main(){float samples=max(uSamples,1.0); vec2 normalizedVelocity=(uVelocity*uIntensity)/uResolution; vec4 sum=vec4(0.0); float totalWeight=0.0; for(float i=0.0;i<16.0;i+=1.0){if(i>=samples) break; float t=(i/(samples-1.0))-0.5; vec2 coord=vTexCoord+normalizedVelocity*t; float weight=1.0-abs(t*1.5); sum+=texture2D(uTexture,clamp(coord,0.0,1.0))*weight; totalWeight+=weight;} gl_FragColor=sum/totalWeight;}`;

export const MOTO_BLUR_PRESETS = { OFF:{id:'off',name:'Disabled',angle:0,velocity:0,intensity:0,samples:4}, MOTO_CRUISE:{id:'cruise',name:'Moto City Cruise',angle:25,velocity:16,intensity:.55,samples:10}, HIGHWAY_RUSH:{id:'highway',name:'Highway Warp',angle:15,velocity:28,intensity:.85,samples:14}, LEAN_CORNERING:{id:'cornering',name:'Apex Lean Angle',angle:45,velocity:34,intensity:.95,samples:16} };

export function applyCanvasDirectionalBlur(ctx, sourceCanvasOrVideo, width, height, angleDegrees=25, velocityMagnitude=20, intensity=.8, samples=8) {
  if (intensity <= .01 || velocityMagnitude <= .5) { ctx.drawImage(sourceCanvasOrVideo,0,0,width,height); return; }
  const rad=(angleDegrees*Math.PI)/180; const dx=Math.cos(rad)*velocityMagnitude*intensity; const dy=Math.sin(rad)*velocityMagnitude*intensity;
  ctx.save(); ctx.globalAlpha=1; ctx.drawImage(sourceCanvasOrVideo,0,0,width,height);
  const stepX=dx/samples, stepY=dy/samples, alphaStep=.45/samples; ctx.globalAlpha=alphaStep;
  for(let i=1;i<=samples;i++){const x=stepX*i,y=stepY*i;ctx.drawImage(sourceCanvasOrVideo,x,y,width,height);ctx.drawImage(sourceCanvasOrVideo,-x,-y,width,height);} ctx.restore();
}

export default { MOTION_BLUR_SKSL, MOTION_BLUR_WEBGL_FRAG, MOTO_BLUR_PRESETS, applyCanvasDirectionalBlur };
