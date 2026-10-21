export type NativeMediaOperation = 'decode' | 'encode' | 'segment' | 'lut' | 'audio';

export interface MediaPipelineRequest { operation: NativeMediaOperation; inputUri?: string; outputUri?: string; options?: Record<string, unknown>; }
export interface MediaPipelineResult { supported: boolean; operation: NativeMediaOperation; message: string; }

export interface MediaPipelineAdapter { supports(operation: NativeMediaOperation): boolean; execute(request: MediaPipelineRequest): Promise<MediaPipelineResult>; }

/** Platform-neutral boundary for FFmpeg/MediaCodec/ML Kit/native GPU implementations. */
export class WebMediaPipelineAdapter implements MediaPipelineAdapter {
  supports(operation: NativeMediaOperation) { return operation === 'lut' || operation === 'audio'; }
  async execute(request: MediaPipelineRequest): Promise<MediaPipelineResult> {
    return { supported: this.supports(request.operation), operation: request.operation, message: `Web adapter prepared for ${request.operation}; native execution must be supplied by the Android runtime.` };
  }
}

export const mediaPipeline = new WebMediaPipelineAdapter();
