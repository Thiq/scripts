import * as client from './client/index';
import * as server from './server/index';

export function Client() {
    return client();
}

export function Server(port: number) {
    return server(port);
}