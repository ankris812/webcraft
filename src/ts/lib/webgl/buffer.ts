import {Context, Resource} from '.';

/**
 * Possible types of a {@link Buffer | WebGL buffer}.
 */
export enum BufferType {
    /**
     * The `ARRAY_BUFFER` type.
     */
    ArrayBuffer = WebGLRenderingContext.ARRAY_BUFFER,

    /**
     * The `ELEMENT_ARRAY_BUFFER` type.
     */
    ElementArrayBuffer = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER
}

/**
 * A wrapper around a WebGL buffer.
 */
export class Buffer extends Resource<WebGLBuffer> {
    /**
     * The type of native WebGL buffer being wrapped by this instance.
     */
    public readonly type: BufferType;

    /**
     * Create a new instance.
     *
     * @param context - The context that will own the new instance.
     * @param type - The type of native WebGL buffer to create.
     */
    public constructor(context: Context, type: BufferType) {
        super(context);
        this.type = type;
    }

    /**
     * Create the native WebGL resource that will be wrapped by this instance.
     *
     * @returns The native WebGL resource on success or `null` on failure.
     */
    protected _createNativeResource(): WebGLBuffer | null {
        return this.context.nativeContext.createBuffer();
    }

    /**
     * Destroy the native WebGL resource that is wrapped by this instance.
     */
    protected _destroyNativeResource(): void {
        this.context.nativeContext.deleteBuffer(this.native);
    }
}
