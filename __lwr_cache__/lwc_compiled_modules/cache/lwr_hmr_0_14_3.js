import { swapTemplate, swapStyle, swapComponent } from 'lwc';

// Track the newest URI for each module.
const URI_MAPPING = new Map();

async function moduleUpdate(payload) {
    const {
        format,
        oldUri,
        newUri,
        module: { specifier },
    } = payload;

    if (format === 'amd') {
        // Need to integrate new LWC APIs to support inline HMR for AMD+CSR
        window.location.reload();
    } else {
        const lastEvalutedUri = URI_MAPPING.get(oldUri) || oldUri;
        const oldModule = await import(lastEvalutedUri);
        const newModule = await import(newUri);
        URI_MAPPING.set(oldUri, newUri);
        updateStaleModule({ oldModule, newModule, specifier });
    }
}

function updateStaleModule({ oldModule, newModule, specifier }) {
    if (specifier.endsWith('html') && newModule.default) {
        console.log(`Swapping HTML template for module "${specifier}"`);
        swapTemplate(oldModule.default, newModule.default);
    } else if (specifier.endsWith('css') && newModule.default) {
        console.log(`Swapping CSS for module "${specifier}"`);
        swapStyle(oldModule.default[0], newModule.default[0]);
    } else {
        console.log(`Swapping JS for module "${specifier}"`);
        swapComponent(oldModule.default, newModule.default);
    }
}

function viewUpdate(payload, metadata) {
    const { assetId, viewId } = payload;
    if (metadata.templates.includes(viewId) || metadata.assetReferences.includes(assetId)) {
        window.location.reload();
    }
}

async function waitForSuccessfulPing(socketUrl) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            // Poll for the socket URL; reject with a network error if not available.
            // If the dev server comes back online, it resolves with a 404 HTTP response.
            await fetch(`http://${socketUrl}`);
            break;
        } catch (error) {
            await new Promise((resolve) => setTimeout(resolve, 1_000));
        }
    }
}

export function initHMR(serverURI = '', metadata, hmrPolling = true) {
    const normalizedMeta = { ...{ assetReferences: [], templates: [] }, ...metadata };
    // {apiVersion}/hmr/{format}/{compat}?debug
    const host = serverURI.startsWith('/') ? location.host : '';
    const socketUrl = `${host}${serverURI}`;
    const socket = new WebSocket(`ws://${socketUrl}`);

    socket.addEventListener('close', async (evt) => {
        // Don't do anything if the socket close event was initiated by the client.
        if (evt.wasClean) {
            return;
        }

        if (hmrPolling) {
            // Otherwise wait until the server comes back online and reload the page.
            console.log('Lost connection with server, start polling...');
            await waitForSuccessfulPing(socketUrl);
            location.reload();
        }
    });

    socket.addEventListener('message', async ({ data }) => {
        const { eventType, payload } = JSON.parse(data);

        switch (eventType) {
            case 'moduleUpdate':
                return moduleUpdate(payload);
            case 'viewUpdate':
                return viewUpdate(payload, normalizedMeta);
            default:
                return;
        }
    });
}
