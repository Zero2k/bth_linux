import http from 'http';
import url from 'url';

class Client {

    constructor() {
        this.init()
    }

    init() {
        this.VERBOSE = false;
    }

    /**
    * Set the url of the server to connect to.
    *
    * @param  String url to use to connect to the server.
    *
    */
    setServer(url, port = null) {
        if(port !== null) {
            return this.server = `http://${url}:${port}`;
        } else {
            return this.server = `http://${url}`;
        }
    }

    getServer() {
        return this.server;
    }

    setVerbose() {
        this.VERBOSE = true;
    }

    /**
    * Make a HTTP GET request, wrapped in a Promise.
    *
    * @param  String url to connect to.
    * @return Promise
    *
    */
    httpGet(url) {
        return new Promise((resolve, reject) => {
            http.get(this.server + url, (res) => {
                let data = "";
                if(this.VERBOSE) {
                    console.log("URL: ", this.server + url);
                }
                res.on('data', (chunk) => {
                    data += chunk;
                }).on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                }).on('error', (e) => {
                    reject("Got error: " + e.message);
                });
            });
        });
    }

    list(limit = null) {
        if(limit !== null) {
            return this.httpGet("/room/list" + '?max=' + limit);
        } else {
            return this.httpGet("/room/list");
        }
    }

    view(id) {
        return this.httpGet("/room/view/id/" + id);
    }

    house(houseName, limit = null) {
        if(limit !== null) {
            return this.httpGet("/room/view/house/" + houseName + '?max=' + limit);
        } else {
            return this.httpGet("/room/view/house/" + houseName);
        }
    }

    search(keyword, limit = null) {
        if(limit !== null) {
            return this.httpGet("/room/search/" + keyword + '?max=' + limit);
        } else {
            return this.httpGet("/room/search/" + keyword);
        }
    }

    searchPriority(keyword, limit = null) {
        if(limit !== null) {
            return this.httpGet("/room/searchp/" + keyword + '?max=' + limit);
        } else {
            return this.httpGet("/room/searchp/" + keyword);
        }
    }
}

export default Client;
