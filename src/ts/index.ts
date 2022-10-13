import {Game} from './game';

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

async function main(): Promise<void> {
    await domReady();
    const game = new Game();
    game.start();
}

main()
    .then(() => console.log('Game started normally'))
    .catch((err: Error) => {
        console.error('Fatal error during startup');
        console.error(err);
    });

export {};
