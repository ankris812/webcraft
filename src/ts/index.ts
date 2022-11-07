/**
 * Wait for the DOM to become ready to manipulate.
 *
 * @param timeout - The maximum duration, in milliseconds, to wait before
 * failing. A negative or non-finite number will be considered infinite.
 *
 * @returns A promise that resolves when the DOM has become ready or rejects if
 * a timeout is provided and reached.
 */
export async function domReady(timeout = Infinity): Promise<void> {
    if (document.readyState === 'complete') {
        return;
    }
    await new Promise<void>((resolve, reject): void => {
        if (document.readyState === 'complete') {
            return;
        }
        let timer: number | null = null;
        const listener = (): void => {
            if (document.readyState === 'complete') {
                if (timer !== null) {
                    clearTimeout(timer);
                    timer = null;
                }
                document.removeEventListener('readystatechange', listener);
                resolve();
            }
        };
        if (isFinite(timeout) && timeout >= 0) {
            timer = setTimeout((): void => {
                timer = null;
                document.removeEventListener('readystatechange', listener);
                reject(
                    new Error(
                        `DOM did not become ready within ${timeout} milliseconds`
                    )
                );
            }, timeout);
        }
        document.addEventListener('readystatechange', listener);
    });
}

/**
 * The program entry point.
 *
 * @returns A promise that resolves once the game has started or rejects if a
 * fatal error occurs while the game is starting.
 */
async function main(): Promise<void> {
    await domReady();
}

main()
    .then((): void => {
        console.log('Game started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error while starting game');
        console.error(err);
    });
