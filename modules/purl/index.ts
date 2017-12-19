import * as client from './purl-client/index';
import * as server from './purl-server/index';

export function Client() {
    return client();
}

export function Server(port: number) {
    return server(port);
}