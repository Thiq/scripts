// this uses Java based HTTP so we can incorporate it into the JS
var HttpClient = importClass('java.net.HttpURLConnection');
var URL = importClass('java.net.URL');
var BufferedReader = importClass('java.io.BufferedReader');
var InputStreamReader = importClass('java.io.InputStreamReader');

function get(endpoint) {
    return new Promise(function(resolve, reject) {
        try {
            var urlToGet = new URL(endpoint);
            var connection = urlToGet.openConnection();
            connection.setRequestMethod('GET');
            var result = '';
            var rd = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            var line = null;
            while ((line = rd.readLine()) != null) {
                result += line;
            }

            rd.close();
            resolve(result.toString());
        } catch (exception) {
            reject(exception);
        }
    });
}

function post(endpoint, properties) {
    return new Promise(function(resolve, reject) {
        try {
            var urlToGet = new URL(endpoint);
            var connection = urlToGet.openConnection();
            connection.setRequestMethod('POST');
            for (var prop in properties) {
                connection.setRequestProperty(prop, properties[prop]);
            }
            var result = '';
            var rd = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            var line = null;
            while ((line = rd.readLine()) != null) {
                result += line;
            }

            rd.close();
            resolve(result.toString());
        } catch (exception) {
            reject(exception);
        }
    });
}

function put(endpoint, properties) {
    return new Promise(function(resolve, reject) {
        try {
            var urlToGet = new URL(endpoint);
            var connection = urlToGet.openConnection();
            connection.setRequestMethod('PUT');
            for (var prop in properties) {
                connection.setRequestProperty(prop, properties[prop]);
            }
            var result = '';
            var rd = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            var line = null;
            while ((line = rd.readLine()) != null) {
                result += line;
            }

            rd.close();
            resolve(result.toString());
        } catch (exception) {
            reject(exception);
        }
    });
}

function ddelete(endpoint, data, credentials) {
    return new Promise(function(resolve, reject) {
        try {
            var urlToGet = new URL(endpoint);
            var connection = urlToGet.openConnection();
            connection.setRequestMethod('DELETE');
            for (var prop in properties) {
                connection.setRequestProperty(prop, properties[prop]);
            }
            var result = '';
            var rd = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            var line = null;
            while ((line = rd.readLine()) != null) {
                result += line;
            }

            rd.close();
            resolve(result.toString());
        } catch (exception) {
            reject(exception);
        }
    });
}

exports.get = get;
exports.delete = ddelete;
exports.post = post;
exports.put = put;