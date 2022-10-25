import {Renderer} from './renderer';

/**
 * The main game logic and state controller.
 */
export class Game {
    /**
     * The main game renderer.
     */
    public readonly renderer: Renderer;

    /**
     * Create a new instance.
     */
    public constructor() {
        this.renderer = new Renderer();
    }
}
