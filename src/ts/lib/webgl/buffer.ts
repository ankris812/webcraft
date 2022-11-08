import {Context, Resource} from '.';

/**
 * Possible targets for a {@link Buffer | WebGL buffer}.
 */
export enum BufferTarget {
    /**
     * The `ARRAY_BUFFER` target.
     */
    ArrayBuffer = WebGLRenderingContext.ARRAY_BUFFER,

    /**
     * The `ELEMENT_ARRAY_BUFFER` target.
     */
    ElementArrayBuffer = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER
}

/**
 * Possible usage modes for a {@link Buffer | WebGL buffer}.
 */
export enum BufferUsageMode {
    /**
     * The `STATIC_DRAW` usage mode.
     */
    StaticDraw = WebGLRenderingContext.STATIC_DRAW,

    /**
     * The `DYNAMIC_DRAW` usage mode.
     */
    DynamicDraw = WebGLRenderingContext.DYNAMIC_DRAW,

    /**
     * The `STREAM_DRAW` usage mode.
     */
    StreamDraw = WebGLRenderingContext.STREAM_DRAW
}

/**
 * A wrapper around a WebGL buffer.
 */
export class Buffer extends Resource<WebGLBuffer> {
    /**
     * Get the parameter value for getting the binding of a buffer target.
     *
     * @param target - The target to get the binding parameter for.
     *
     * @returns A parameter that can be used to get the buffer bound to the
     * given target.
     */
    private static _getBufferTargetBindingParameter(
        target: BufferTarget
    ): GLenum {
        switch (target) {
            case BufferTarget.ArrayBuffer:
                return WebGLRenderingContext.ARRAY_BUFFER_BINDING;
            case BufferTarget.ElementArrayBuffer:
                return WebGLRenderingContext.ELEMENT_ARRAY_BUFFER_BINDING;
            default:
                throw new Error('Invalid buffer type');
        }
    }

    /**
     * The amount of VRAM allocated to the instance, in bytes.
     */
    private _size: number | null;

    /**
     * The usage mode the instance is in.
     */
    private _usageMode: BufferUsageMode | null;

    /**
     * The target of native WebGL buffer being wrapped by this instance.
     */
    public readonly target: BufferTarget;

    /**
     * The amount of VRAM allocated to the instance, in bytes.
     */
    public get sizeBytes(): number | null {
        if (this.isDisposed) {
            return null;
        }
        return this._size;
    }

    /**
     * The usage mode the instance is in.
     */
    public get usageMode(): number | null {
        if (this.isDisposed) {
            return null;
        }
        return this._usageMode;
    }

    /**
     * Whether this instance is bound to its target.
     */
    public get isBound(): boolean {
        if (this.isDisposed) {
            return false;
        }
        return (
            this.context.nativeContext.getParameter(
                Buffer._getBufferTargetBindingParameter(this.target)
            ) === this.native
        );
    }

    /**
     * Create a new instance.
     *
     * @param context - The context that will own the new instance.
     * @param target - The type of native WebGL buffer to create.
     */
    public constructor(context: Context, target: BufferTarget) {
        super(context);
        this._size = null;
        this._usageMode = null;
        this.target = target;
    }

    /**
     * Bind this instance to its target.
     *
     * @returns This instance for chaining.
     */
    public bind(): this {
        if (this.isDisposed) {
            throw new Error('Resource is disposed');
        }
        if (this.isBound) {
            return this;
        }
        this.context.nativeContext.bindBuffer(this.target, this.native);
        const err = this.context.nativeContext.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error('WebGL error during operation');
        }
        return this;
    }

    /**
     * Unbind this instance from its target.
     *
     * @returns This instance for chaining.
     */
    public unbind(): this {
        if (this.isDisposed) {
            throw new Error('Resource is disposed');
        }
        if (!this.isBound) {
            return this;
        }
        this.context.nativeContext.bindBuffer(this.target, null);
        const err = this.context.nativeContext.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error('WebGL error during operation');
        }
        return this;
    }

    /**
     * Allocate space in VRAM for the instance.
     *
     * @param size - The amount of space in VRAM, in bytes, to allocate.
     * @param usageMode - The usage mode to place the instance into.
     *
     * @returns This instance for chaining.
     */
    public allocate(
        size: number,
        usageMode = BufferUsageMode.DynamicDraw
    ): this {
        if (this.isDisposed) {
            throw new Error('Resource is disposed');
        }
        if (!this.isBound) {
            throw new Error('Resource is not bound');
        }
        this.context.nativeContext.bufferData(this.target, size, usageMode);
        const err = this.context.nativeContext.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error('WebGL error during operation');
        }
        this._size = size;
        return this;
    }

    /**
     * Upload data into, an optionally allocate space for, the instance.
     *
     * @param data - The data to upload into the instance.
     * @param usageMode - The usage mode to place the instance into.
     *
     * @returns This instance for chaining.
     */
    public uploadData(
        data: BufferSource,
        usageMode = BufferUsageMode.DynamicDraw
    ): this {
        if (this.isDisposed) {
            throw new Error('Resource is disposed');
        }
        if (!this.isBound) {
            throw new Error('Resource is not bound');
        }
        this.context.nativeContext.bufferData(this.target, data, usageMode);
        const err = this.context.nativeContext.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error('WebGL error during operation');
        }
        this._size = data.byteLength;
        return this;
    }

    /**
     * Upload data into the instance at the given offset into the existing
     * allocation.
     *
     * @param data - The data to upload into the instance.
     * @param offset - The offset into the existing allocation to place the data
     * at.
     *
     * @returns This instance for chaining.
     */
    public uploadDataAtOffset(data: BufferSource, offset = 0): this {
        if (this.isDisposed) {
            throw new Error('Resource is disposed');
        }
        if (!this.isBound) {
            throw new Error('Resource is not bound');
        }
        if (this.sizeBytes === null) {
            throw new Error('Resource is not allocated');
        }
        if (offset < 0) {
            throw new Error('Data would underflow resource allocation');
        }
        if (data.byteLength + offset >= this.sizeBytes) {
            throw new Error('Data would overflow resource allocation');
        }
        this.context.nativeContext.bufferSubData(this.target, offset, data);
        const err = this.context.nativeContext.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error('WebGL error during operation');
        }
        return this;
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
        this._size = null;
        this._usageMode = null;
    }
}
