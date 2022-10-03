/**
 * The main game logic/state controller.
 */
export class Game {
    /**
     * The ID returned by the last call to {@link requestAnimationFrame}.
     *
     * This value will be `null` if in the middle of a frame or if the game is
     * not running.
     *
     * @see {@link Game.isRunning}
     */
    private _lastFrameRequest: number | null;

    /**
     * The timestamp of the end of the last frame.
     *
     * This value will be `null` if the game is not running.
     *
     * @see {@link Game.isRunning}
     */
    private _lastFrameTimestamp: number | null;

    /**
     * A bound version of {@link Game._doFrame} that aligns with the
     * {@link requestAnimationFrame} callback.
     */
    private readonly _boundDoFrame: FrameRequestCallback;

    /**
     * Whether the game is running.
     */
    private _running: boolean;

    /**
     * Whether the game is running.
     */
    public get isRunning(): boolean {
        return this._running;
    }

    /**
     * Create a new instance.
     */
    public constructor() {
        this._lastFrameRequest = null;
        this._lastFrameTimestamp = null;
        this._boundDoFrame = this._doFrame.bind(this, false);
        this._running = false;
    }

    /**
     * Start the game running.
     */
    public start(): void {
        this._running = true;
        if (this._lastFrameRequest === null) {
            this._lastFrameRequest = requestAnimationFrame(this._boundDoFrame);
        }
        this._lastFrameTimestamp = performance.now();
    }

    /**
     * Stop the game running.
     */
    public stop(): void {
        this._running = false;
        if (this._lastFrameRequest !== null) {
            cancelAnimationFrame(this._lastFrameRequest);
            this._lastFrameRequest = null;
        }
        this._lastFrameTimestamp = null;
    }

    /**
     * Execute the next frame.
     *
     * This method executes a single frame before returning.
     *
     * @param emulatedFramerate - The framerate to emulate. Defaults to the game
     * frame rate.
     */
    public nextFrame(emulatedFramerate?: number): void {
        const frameDelta = 1000 / (emulatedFramerate ?? 60);
        this._lastFrameTimestamp = performance.now() - frameDelta;
        this._doFrame(true);
    }

    /**
     * Update the game state.
     *
     * @param delta - The time, in fractional seconds, since the end of the last
     * frame.
     */
    private _update(delta: number): void {
        // TODO: Update game state
    }

    /**
     * Render the game state.
     */
    private _render(): void {
        // TODO: Render game state
    }

    /**
     * A private method that executes the next frame.
     *
     * @param isSingleFrame - Whether this method is being called to advance a
     * single frame only or if it should run in a loop. Only used when
     * {@link Game.isRunning} is `true`.
     */
    private _doFrame(isSingleFrame: boolean): void {
        this._lastFrameRequest = null;
        const delta =
            (performance.now() -
                (this._lastFrameTimestamp ?? performance.now())) /
            1000;
        this._update(delta);
        // TODO: Reset renderer
        this._render();
        this._lastFrameTimestamp = performance.now();
        if (this.isRunning && !isSingleFrame) {
            this._lastFrameRequest = requestAnimationFrame(this._boundDoFrame);
        }
    }
}
