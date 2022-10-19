import debug from 'debug';

const params = new URLSearchParams(location.search);
const debugNamespaces =
    params.get('debug') ?? localStorage.getItem('debug') ?? '';
debug.enable(debugNamespaces);
localStorage.setItem('debug', debugNamespaces);

const log = debug('main:log');
const error = debug('main:error');

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

async function main(): Promise<void> {
    await domReady();
}

main()
    .then((): void => {
        log('Started normally');
    })
    .catch((err: Error): void => {
        error('Fatal error during startup');
        error(err);
    });
