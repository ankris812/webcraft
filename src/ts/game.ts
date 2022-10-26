import {Renderer} from './renderer';
import {Scene} from './scene';

/**
 * The main game logic and state controller.
 */
export class Game {
    /**
     * Whether the game is running.
     */
    private _running: boolean;

    /**
     * The ID of the last call to `requestAnimationFrame`.
     */
    private _frameRequestID: number | null;

    /**
     * The timestamp of the end of the last frame.
     */
    private _lastFrameTimestamp: number | null;

    /**
     * The main game renderer.
     */
    public readonly renderer: Renderer;

    /**
     * The main game scene.
     */
    public readonly scene: Scene;

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
        this.renderer = new Renderer();
        this.scene = new Scene();
        this._running = false;
        this._frameRequestID = null;
        this._lastFrameTimestamp = null;
    }

    /**
     * Start the game running.
     */
    public start(): void {
        this._running = true;
        if (this._frameRequestID === null) {
            this._frameRequestID = requestAnimationFrame(this._mainLoop);
            this._lastFrameTimestamp = performance.now();
        }
    }

    /**
     * Stop the game running.
     */
    public stop(): void {
        this._running = false;
        if (this._frameRequestID !== null) {
            cancelAnimationFrame(this._frameRequestID);
            this._frameRequestID = null;
            this._lastFrameTimestamp = null;
        }
    }

    /**
     * Update the game state and render the frame.
     */
    public nextFrame(): void {
        const delta =
            (performance.now() -
                (this._lastFrameTimestamp ?? performance.now())) /
            1000;
        this.scene.update(delta);
        this.renderer.resetContext();
        this.renderer.clearContext();
        this.renderer.render(this.scene);
        this._lastFrameTimestamp = performance.now();
    }

    /**
     * The main loop.
     */
    private readonly _mainLoop = (): void => {
        this._frameRequestID = null;
        this.nextFrame();
        if (this.isRunning) {
            this._frameRequestID = requestAnimationFrame(this._mainLoop);
        }
    };
}
