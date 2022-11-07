/**
 * An interface for objects that can be disposed to release some kind of managed
 * resource.
 */
export interface Disposable {
    /**
     * Whether the instance has been disposed.
     */
    readonly isDisposed: boolean;

    /**
     * Dispose the instance and release any managed resources.
     *
     * This method should not throw any errors.
     */
    dispose(): void;
}
