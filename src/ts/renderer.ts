import {Scene} from './scene';

export class Renderer {
    /**
     * The native WebGL rendering context.
     */
    public readonly native: WebGLRenderingContext;

    /**
     * The HTML canvas element this renderer is outputting to.
     */
    public get canvas(): HTMLCanvasElement {
        return this.native.canvas;
    }

    /**
     * Create a new instance.
     */
    public constructor() {
        let canvas = document.getElementById('gameCanvas');
        if (!(canvas instanceof HTMLCanvasElement)) {
            canvas = document.getElementsByTagName('canvas')[0] ?? null;
        }
        if (!(canvas instanceof HTMLCanvasElement)) {
            canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
        }
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error('Failed to get/create game canvas');
        }
        const gl = canvas.getContext('webgl', {
            alpha: true,
            antialias: true,
            depth: true,
            desynchronized: false,
            failIfMajorPerformanceCaveat: false,
            powerPreference: 'default',
            premultipliedAlpha: true,
            preserveDrawingBuffer: false,
            stencil: false
        });
        if (gl === null) {
            throw new Error('Failed to create WebGL rendering context');
        }
        this.native = gl;
    }

    /**
     * Reset the renderer.
     */
    public reset(): void {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.native.viewport(
            0,
            0,
            this.native.drawingBufferWidth,
            this.native.drawingBufferHeight
        );
        this.native.clearColor(0, 0, 0, 1);
        this.native.clearDepth(1);
        this.clear();
    }

    /**
     * Clear the renderer's drawing buffers.
     */
    public clear(): void {
        this.native.clear(
            WebGLRenderingContext.COLOR_BUFFER_BIT |
                WebGLRenderingContext.DEPTH_BUFFER_BIT
        );
    }

    /**
     * Render the given scene.
     */
    public render(scene: Scene): void {
        this.clear();
        // TODO: Render
    }
}
