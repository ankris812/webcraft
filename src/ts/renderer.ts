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
     *
     * @param native - The native WebGL rendering context to use.
     */
    public constructor(native: WebGLRenderingContext) {
        this.native = native;
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
