import * as OutputStream from '@java.io.OutputStream';
import * as InetSocketAddress from '@java.net.InetSocketAddress';
import * as HttpExchange from '@com.sun.net.httpserver.HttpExchange';
import * as HttpHandler from '@com.sun.net.httpserver.HttpHandler';
import * as HttpServer from '@com.sun.net.httpserver.HttpServer';

interface PurlRoute {
    url: string;
    handler: PurlHandler;

    constructor(url: string, handler: PurlHandler);
}

class PurlHandler extends HttpHandler {
    constructor(fn: Function) {
        super();
    }

    private createHandle(fn: Function): Function {
        return () => {
            
        }
    }
}

export default class PurlServer {
    server: any;
    port: number = 80;

    constructor(port: number) {
        this.port = port;
        this.server = HttpServer.create(new InetSocketAddress(this.port), 0);
    }

    start(): Promise<PurlServer> {
        return new Promise<PurlServer>(function(resolve, reject) {
            try {
                this.server.setExecutor(null);
                this.server.start();
                resolve(this);
            } catch (exception) {
                reject(this);
            }
        });
    }

    configRoutes(routes: PurlRoute[]) {
        for (let i = 0; i < routes.length; i++) {
            var route = routes[i];
            this.server.createContext(route.url, route.handler);
        }
    }
}