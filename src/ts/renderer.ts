import {Scene} from './scene';

/**
 * The main game renderer.
 */
export class Renderer {
    /**
     * The native WebGL rendering context.
     */
    public readonly context: WebGLRenderingContext;

    /**
     * Create a new instance.
     */
    public constructor() {
        const canvas =
            document.getElementById('gameCanvas') ??
            document.getElementsByTagName('canvas')[0];
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error('Failed to get game canvas');
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
            throw new Error('Failed to get native WebGL rendering context');
        }
        this.context = gl;
    }

    /**
     * Reset the native WebGL rendering context.
     */
    public resetContext(): void {
        if (
            this.context.drawingBufferWidth !==
                this.context.canvas.clientWidth ||
            this.context.drawingBufferHeight !==
                this.context.canvas.clientHeight
        ) {
            this.context.canvas.width = this.context.canvas.clientWidth;
            this.context.canvas.height = this.context.canvas.clientHeight;
            this.context.viewport(
                0,
                0,
                this.context.drawingBufferWidth,
                this.context.drawingBufferHeight
            );
        }
        this.context.clearColor(0, 0, 0, 1);
        this.context.clearDepth(1);
    }

    /**
     * Clear the native WebGL rendering context.
     */
    public clearContext(): void {
        this.context.clear(
            WebGLRenderingContext.COLOR_BUFFER_BIT |
                WebGLRenderingContext.DEPTH_BUFFER_BIT
        );
    }

    /**
     * Render a scene.
     *
     * @param scene - The scene to render.
     */
    public render(scene: Scene): void {
        // TODO
    }
}
