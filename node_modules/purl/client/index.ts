import * as HttpClient from '@java.net.HttpURLConnection';
import * as URL from '@java.net.URL';
import * as BufferedReader from '@java.io.BufferedReader';
import * as BufferedWriter from '@java.io.BufferedWriter';
import * as InputStreamReader from '@java.io.InputStreamReader';
import * as OutputStreamWriter from '@java.io.OutputStreamWriter';
import * as Socket from '@java.net.Socket';
import * as SocketAddress from '@java.net.SocketAddress';
import * as SocketTimeoutException from '@java.net.SocketTimeoutException';
import * as InetAddress from '@java.net.InetAddress';
import * as InetSocketAddress from '@java.net.InetSocketAddress';

function readContentFromConnection(connection: any) {
    var result = '';
    var rd = new BufferedReader(new InputStreamReader(connection.getInputStream()));
    var line = null;
    while ((line = rd.readLine()) != null) {
        result += line;
    }
    rd.close();
    return result;
}

export default class PurlClient {
    isCurrentlyConnected: boolean = false;
    socket: any;

    get(endpoint, options): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isCurrentlyConnected) {
                    reject('The client is currently connected. Disconnect before making any other connections');
                }
                var urlToGet = new URL(endpoint);
                var connection = urlToGet.openConnection();
                connection.setRequestMethod('GET');
                resolve(readContentFromConnection(connection));
            } catch (exception) {
                reject(exception);
            }
        });
    }

    post(endpoint: string, options: any): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isCurrentlyConnected) {
                    reject('The client is currently connected. Disconnect before making any other connections');
                }
                var urlToGet = new URL(endpoint);
                var connection = urlToGet.openConnection();
                connection.setRequestMethod('POST');
                for (var param in options.params) {
                    connection.setRequestProperty(param, options.params[param]);
                }
                resolve(readContentFromConnection(connection));
            } catch (exception) {
                reject(exception);
            }
        });
    }

    put(endpoint: string, options: any): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isCurrentlyConnected) {
                    reject('The client is currently connected. Disconnect before making any other connections');
                }
                var urlToGet = new URL(endpoint);
                var connection = urlToGet.openConnection();
                connection.setRequetMethod('PUT');
                for (var param in options.params) {
                    connection.setRequestProperty(param, options.params[param]);
                }
                resolve(readContentFromConnection(connection));
            } catch (exception) {
                reject(exception);
            }
        });
    }

    delete(endpoint: string, options: any): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.isCurrentlyConnected) {
                    reject('The client is currently connected. Disconnect before making any other connections');
                }
                var urlToGet = new URL(endpoint);
                var connection = urlToGet.openConnection();
                connection.setRequestMethod('DELETE');
                for (var param in options.params) {
                    connection.setRequestProperty(param, options.params[param]);
                }
                resolve(readContentFromConnection(connection));
            } catch (exception) {
                reject(exception);
            }
        });
    }

    open(host: string, port: number, options): Promise<PurlClient> {
        return new Promise<PurlClient>((resolve, reject) => {
            if (!options) options = {};
            try {
                if (!this.isCurrentlyConnected) {
                    reject('The client is currently connected. Disconnect before making any other connections');
                }
                var inetAddress = InetAddress.getByName(host);
                var socketAddress = new InetSocketAddress(inetAddress, port);
                this.socket = new Socket();
                this.socket.connect(socketAddress, options.timeout || 10000);
                resolve(this);
            } catch (exception) {
                reject(exception);
            }
        });
    }

    close(reason: string): Promise<PurlClient> {
        return new Promise<PurlClient>((resolve, reject) => {
            try {

            } catch (exception) {
                reject(exception);
            }
        });
    }

    write(content: string): Promise<PurlClient> {
        return new Promise<PurlClient>((resolve, reject) => {
            try {
                var bufferedWriter = new BufferedWriter(new OutputStreamWriter(this.socket.getOutputStream()));
                bufferedWriter.write(content);
                bufferedWriter.flush();
                resolve(this);
            } catch (exception) {
                reject(exception);
            }
        });
    }

    read(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                var bufferedReader = new BufferedReader(new InputStreamReader(this.socket.getInputStream()));
                var result = '';
                var rd = new BufferedReader(new InputStreamReader(this.socket.getInputStream()));
                var line = null;
                while ((line = rd.readLine()) != null) {
                    result += line;
                }
                rd.close();
                resolve(result);
            } catch (exception) {
                reject(exception);
            }
        });
    }
}