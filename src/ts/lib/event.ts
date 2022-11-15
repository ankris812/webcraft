/**
 * A function that can handle an {@link Event | event} being fired.
 */
export type EventHandler<TParams extends unknown[], TResult> = (
    ...params: TParams
) => TResult;

/**
 * Data about an {@link EventHandler | event handler}.
 */
interface EventHandlerData<TParams extends unknown[], TResult> {
    /**
     * The event handler itself.
     */
    readonly handler: EventHandler<TParams, TResult>;

    /**
     * Whether the handler should be called once before being unregistered.
     */
    readonly once: boolean;
}

export class Event<TParams extends unknown[]> {
    /**
     * The event handlers registered for this event.
     */
    private readonly _handlers: EventHandlerData<TParams, unknown>[];

    /**
     * The name of the event.
     *
     * Mainly useful for debugging.
     */
    public readonly name: string;

    /**
     * The {@link EventHandler | event handlers} registered on this event.
     */
    public get handlers(): EventHandler<TParams, unknown>[] {
        return this._handlers.map(({handler}) => handler);
    }

    /**
     * The number of {@link EventHandler | event handlers} registered on this
     * event.
     */
    public get handlerCount(): number {
        return this._handlers.length;
    }

    /**
     * Create a new event.
     *
     * @param name - The name of the event.
     */
    public constructor(name: string) {
        this.name = name;
        this._handlers = [];
    }

    /**
     * Check whether this event has the given event handler registered.
     *
     * @param handler - The handler to check.
     *
     * @returns Whether the given handler is registered on this event.
     */
    public hasHandler(handler: EventHandler<TParams, unknown>): boolean {
        return this._handlers.find((data) => data.handler === handler) !== null;
    }

    /**
     * Add a handler to the event.
     *
     * @param handler - The handler to add.
     *
     * @returns This instance for chaining.
     */
    public addHandler(handler: EventHandler<TParams, unknown>): this {
        this._handlers.push({
            handler,
            once: false
        });
        return this;
    }

    /**
     * Add a handler to the event that will be called only once.
     *
     * @param handler - The handler to add.
     *
     * @returns This instance for chaining.
     */
    public addOnceHandler(handler: EventHandler<TParams, unknown>): this {
        this._handlers.push({
            handler,
            once: true
        });
        return this;
    }

    /**
     * Add a handler to the event to be called first.
     *
     * @param handler - The handler to add.
     *
     * @returns This instance for chaining.
     */
    public prependHandler(handler: EventHandler<TParams, unknown>): this {
        this._handlers.unshift({
            handler,
            once: false
        });
        return this;
    }

    /**
     * Add a handler to the event to be called first that will be called only
     * once.
     *
     * @param handler - The handler to add.
     *
     * @returns This instance for chaining.
     */
    public prependOnceHandler(handler: EventHandler<TParams, unknown>): this {
        this._handlers.unshift({
            handler,
            once: true
        });
        return this;
    }

    /**
     * Remove a registered event handler from this event.
     *
     * @param handler - The handler to remove.
     *
     * @returns This instance for chaining.
     */
    public removeHandler(handler: EventHandler<TParams, unknown>): this {
        const i = this._handlers.findIndex((data) => data.handler === handler);
        if (i >= 0) {
            this._handlers.splice(i, 1);
        }
        return this;
    }

    /**
     * Emit the event.
     *
     * @param data - The data to pass to all handlers.
     *
     * @returns An array containing any errors surfaced from the handlers.
     * This array is not in any particular order.
     */
    public emit(...data: TParams): void {
        if (this.handlerCount <= 0) {
            return;
        }
        const handlers = this._handlers.slice();
        handlers.map(({handler}) => {
            try {
                handler(...data);
            } catch (ex) {
                // TODO: Report
            }
        });
        handlers
            .filter(({once}) => once)
            .forEach((data) => {
                const i = this._handlers.indexOf(data);
                if (i >= 0) {
                    this._handlers.splice(i, 1);
                }
            });
    }
}
