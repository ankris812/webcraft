async function domReady(timeout = Infinity): Promise<void> {
    if (document.readyState === 'complete') {
        return;
    }
    await new Promise<void>((resolve, reject) => {
        if (document.readyState === 'complete') {
            resolve();
            return;
        }
        let timer: number | null = null;
        const listener = (): void => {
            if (document.readyState === 'complete') {
                document.removeEventListener('readystatechange', listener);
                if (timer !== null) {
                    clearTimeout(timer);
                    timer = null;
                }
                resolve();
            }
        };
        if (isFinite(timeout) && timeout >= 0) {
            timer = setTimeout(() => {
                document.removeEventListener('readystatechange', listener);
                timer = null;
                reject(
                    new Error(`DOM did not become ready within ${timeout} ms`)
                );
            }, timeout);
        }
        document.addEventListener('readystatechange', listener);
    });
}

function getGameCanvas(): HTMLCanvasElement {
    let e = document.getElementById('gameCanvas') as
        | HTMLElement
        | null
        | undefined;
    if (e instanceof HTMLCanvasElement) {
        return e;
    }
    e = document.getElementsByTagName('canvas')[0];
    if (e instanceof HTMLCanvasElement) {
        return e;
    }
    e = document.createElement('canvas');
    if (e instanceof HTMLCanvasElement) {
        document.body.appendChild(e);
        return e;
    }
    throw new Error('Failed to get/create game canvas');
}

async function main(): Promise<void> {
    await domReady();
    const canvas = getGameCanvas();
    const gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        depth: true,
        desynchronized: false,
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'default',
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        stencil: false
    });
    if (gl === null) {
        throw new Error('Failed to create rendering context');
    }
    const resetContext = (): void => {
        if (
            gl.drawingBufferWidth !== canvas.clientWidth ||
            gl.drawingBufferHeight !== canvas.clientHeight
        ) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1);
        gl.clear(
            WebGLRenderingContext.COLOR_BUFFER_BIT |
                WebGLRenderingContext.DEPTH_BUFFER_BIT
        );
        gl.disable(WebGLRenderingContext.DEPTH_TEST);
    };
    let running = false;
    let lastFrameRequestID: number | null = null;
    let lastFrameTimestamp: number | null = null;
    const update = (_delta: number): void => {
        // TODO
    };
    const render = (): void => {
        // TODO
    };
    const nextFrame = (): void => {
        lastFrameRequestID = null;
        lastFrameTimestamp ??= performance.now();
        const delta = performance.now() - lastFrameTimestamp;
        update(delta);
        resetContext();
        render();
        if (running) {
            lastFrameRequestID = requestAnimationFrame(nextFrame);
            lastFrameTimestamp = performance.now();
        }
    };
    const start = (): void => {
        running = true;
        if (lastFrameRequestID === null) {
            lastFrameRequestID = requestAnimationFrame(nextFrame);
            lastFrameTimestamp = performance.now();
        }
    };
    const stop = (): void => {
        running = false;
        if (lastFrameRequestID !== null) {
            cancelAnimationFrame(lastFrameRequestID);
            lastFrameRequestID = null;
            lastFrameTimestamp = null;
        }
    };
    resetContext();
    start();
}

main()
    .then(() => console.log('Game started normally'))
    .catch((err: Error) => {
        console.error('Fatal error during startup');
        console.error(err);
    });

export {};
