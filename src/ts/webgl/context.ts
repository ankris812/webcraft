/**
 * A wrapper around a WebGL rendering context.
 */
export class Context {
    /**
     * The native WebGL rendering context.
     */
    public readonly nativeContext: WebGLRenderingContext;

    /**
     * Create a new instance.
     *
     * @param canvas - The HTML canvas element to get the native WebGL rendering
     * context from.
     * @param attributes - The attributes to get the WebGL rendering context.
     */
    public constructor(
        canvas: HTMLCanvasElement,
        attributes?: WebGLContextAttributes
    );

    /**
     * Create a new instance.
     *
     * @param context - The native WebGL rendering context to use.
     */
    public constructor(context: WebGLRenderingContext);

    /**
     * Create a new instance.
     *
     * @param param1 - The native WebGL rendering context to use or the HTML
     * canvas element to get the native WebGL rendering context from.
     * @param attributes - The attributes to get the WebGL rendering context.
     */
    public constructor(
        param1: HTMLCanvasElement | WebGLRenderingContext,
        attributes?: WebGLContextAttributes
    ) {
        const context =
            param1 instanceof HTMLCanvasElement
                ? param1.getContext('webgl', attributes)
                : param1;
        if (context === null) {
            throw new Error(
                'Failed to get WebGL rendering context from HTML canvas element'
            );
        }
        this.nativeContext = context;
    }
}
