# Purl Module
Purl is an HTTP promise based module (p-url). It has nothing to do with the Perl lang.  
It can create an HTTP server, HTTP client, and Socket client. It's built around Java's HTTPServer and HTTPClient. Usage is pretty simple.

## Creating an HTTP client and using it
```
var PurlClient = require('purl').Client;
var myHttpClient = new PurlClient();

myHttpClient.get('https://google.com').then(function(result) {
    console.log(result);
}, function(err) {
    console.error(err);
});

myHttpClient.put('https://myurl.com', { params: 'Hello world!', headers: { content: 'application/json' } }).then(function(result) {
    ...
});

myHttpClient.post('https://myurl.com', { params: 'Updating!' }).then(function(result) {
    ...
});

myHttpClient.delete(...)
```

Purl clients are also used for creating socket connections.
```
myHttpClient.open(url, port);
myHttpClient.write('Hello world!');
myHttpClient.read().then(function(result) {
    console.log(result);
});
```

## Creating an HTTP server (WIP)
```
var PurlServer = require('purl').Server;
var myHttpServer = new PurlServer(8080);

myHttpServer.configRoutes([
    { url: 'api/users/:uuid', handler: handleUserFetch }
]);

myHttpServer.configureAuth(function(request) {
    if (request.headers['X-Auth'] != 'MyClient') {
        request.deny();
    }
});

myHttpServer.start();

function handleUserFetch(uuid) {
    return 'Found user ' + myUserFactory.findUser(uuid).name;
}

// to close the server
myHttpServer.close();
```

Currently creating a socket server is not implemented.