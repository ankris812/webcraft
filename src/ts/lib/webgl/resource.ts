import {Disposable} from '..';
import {types, Context} from '.';

/**
 * A wrapper around a native WebGL resource.
 */
export abstract class Resource<
    TNative extends types.NativeResource,
    TParams extends unknown[] = []
> implements Disposable
{
    /**
     * The native WebGL resource this instance wraps.
     */
    private _native: TNative | null;

    /**
     * The context that owns this instance.
     */
    public readonly context: Context;

    /**
     * The native WebGL resource this instance wraps.
     */
    public get native(): TNative | null {
        return this._native;
    }

    /**
     * Whether this instance has been disposed.
     */
    public get isDisposed(): boolean {
        return this._native !== null;
    }

    /**
     * Create a new instance.
     *
     * @param context - The context that will own the new instance.
     * @param params - The parameters to pass along to the native WebGL resource
     * factory.
     */
    protected constructor(context: Context, ...params: TParams) {
        this.context = context;
        this._native = this._createNativeResource(...params);
        if (this._native === null) {
            throw new Error('Failed to create native WebGL resource');
        }
    }

    /**
     * Dispose this instance and release the native WebGL resource being
     * managed.
     */
    public dispose(): void {
        if (this.isDisposed) {
            return;
        }
        this._destroyNativeResource();
        this._native = null;
    }

    /**
     * Create the native WebGL resource that will be wrapped by this instance.
     *
     * @param params - The parameters to pass along to the native WebGL resource
     * factory.
     *
     * @returns The native WebGL resource on success or `null` on failure.
     */
    protected abstract _createNativeResource(
        ...params: TParams
    ): TNative | null;

    /**
     * Destroy the native WebGL resource that is wrapped by this instance.
     */
    protected abstract _destroyNativeResource(): void;
}
