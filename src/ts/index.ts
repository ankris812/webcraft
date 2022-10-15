import debug from 'debug';
import {utils} from './lib';

const params = new URLSearchParams(location.search);
const debugNamespaces =
    params.get('debug') ?? localStorage.getItem('debug') ?? '';
debug.enable(debugNamespaces);
localStorage.setItem('debug', debugNamespaces);

const log = debug('main:log');
const error = debug('main:error');

async function main(): Promise<void> {
    await utils.domReady();
}

main()
    .then((): void => {
        log('Started normally');
    })
    .catch((err: Error): void => {
        error('Fatal error during startup');
        error(err);
    });
