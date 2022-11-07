/**
 * Flags indicating which buffers of a {@link Context} to clear.
 */
export enum ContextClearFlags {
    /**
     * Clear the color buffer.
     */
    ColorBuffer = WebGLRenderingContext.COLOR_BUFFER_BIT,

    /**
     * Clear the depth buffer.
     */
    DepthBuffer = WebGLRenderingContext.DEPTH_BUFFER_BIT,

    /**
     * Clear the stencil buffer.
     */
    StencilBuffer = WebGLRenderingContext.STENCIL_BUFFER_BIT,

    /**
     * Clear all the buffers.
     */
    AllBuffers = ColorBuffer | DepthBuffer | StencilBuffer
}

/**
 * A wrapper around a WebGL rendering context.
 */
export class Context {
    /**
     * The native WebGL rendering context being wrapped.
     */
    public readonly nativeContext: WebGLRenderingContext;

    /**
     * The HTML canvas element this instance is rendering into.
     */
    public get canvas(): HTMLCanvasElement {
        return this.nativeContext.canvas;
    }

    /**
     * Whether this instance has been lost.
     */
    public get isLost(): boolean {
        return this.nativeContext.isContextLost();
    }

    /**
     * The width of the drawing buffer of the instance.
     */
    public get drawingBufferWidth(): number {
        return this.nativeContext.drawingBufferWidth;
    }

    /**
     * The height of the drawing buffer of the instance.
     */
    public get drawingBufferHeight(): number {
        return this.nativeContext.drawingBufferHeight;
    }

    /**
     * The value being used to clear the color buffer of the instance.
     */
    public get colorBufferClearValue(): [number, number, number, number] {
        if (this.isLost) {
            throw new Error('Context lost');
        }
        return this.nativeContext.getParameter(
            WebGLRenderingContext.COLOR_CLEAR_VALUE
        ) as [number, number, number, number];
    }
    public set colorBufferClearValue(value: [number, number, number, number]) {
        if (this.isLost) {
            throw new Error('Context lost');
        }
        this.nativeContext.clearColor(...value);
    }

    /**
     * The value being used to clear the depth buffer of the instance.
     */
    public get depthBufferClearValue(): number {
        if (this.isLost) {
            throw new Error('Context lost');
        }
        return this.nativeContext.getParameter(
            WebGLRenderingContext.DEPTH_CLEAR_VALUE
        ) as number;
    }
    public set depthBufferClearValue(value: number) {
        if (this.isLost) {
            throw new Error('Context lost');
        }
        this.nativeContext.clearDepth(value);
    }

    /**
     * The value being used to clear the stencil buffer of the instance.
     */
    public get stencilBufferClearValue(): number {
        if (this.isLost) {
            throw new Error('Context lost');
        }
        return this.nativeContext.getParameter(
            WebGLRenderingContext.STENCIL_CLEAR_VALUE
        ) as number;
    }
    public set stencilBufferClearValue(value: number) {
        if (this.isLost) {
            throw new Error('Context lost');
        }
        this.nativeContext.clearStencil(value);
    }

    /**
     * Create a new instance.
     *
     * @param nativeContext - The native WebGL rendering context to wrap.
     */
    public constructor(nativeContext: WebGLRenderingContext) {
        this.nativeContext = nativeContext;
    }

    /**
     * Clear the buffers of the instance.
     *
     * @param flags - Flags indicating which buffers to clear.
     *
     * @returns This instance for chaining.
     *
     * @throws if the instance is lost.
     * @throws if a WebGL error occurs during the
     * operation.
     */
    public clear(flags = ContextClearFlags.AllBuffers): this {
        if (this.isLost) {
            throw new Error('Context lost');
        }
        this.nativeContext.clear(flags);
        const err = this.nativeContext.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error('WebGL error during operation');
        }
        return this;
    }

    /**
     * Set the viewport of the instance.
     *
     * @param x - The X coordinate of the lower left corner of the viewport.
     * @param y - The Y coordinate of the lower left corner of the viewport.
     * @param width - The width of the viewport, in pixels.
     * @param height - The height of the viewport, in pixels.
     *
     * @returns This instance for chaining.
     *
     * @throws if the instance is lost.
     * @throws if a WebGL error occurs during the
     * operation.
     */
    public viewport(x: number, y: number, width: number, height: number): this {
        if (this.isLost) {
            throw new Error('Context lost');
        }
        this.nativeContext.viewport(x, y, width, height);
        const err = this.nativeContext.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error('WebGL error during operation');
        }
        return this;
    }
}
