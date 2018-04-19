"use strict";
import http from 'http';
import url from 'url';
import Router from "./router";
import Data from './data';

const router = new Router();
const data = new Data();

let message, dataValue;
let VERBOSE = false;

export const setVerbose = () => {
    VERBOSE = true;
};

/**
 * Wrapper function for sending a JSON response
 *
 * @param  Object        res     The response
 * @param  Object/String content What should be written to the response
 * @param  Integer       code    HTTP status code
 */
const sendJSONResponse = (res, content, code = 200) => {
    res.writeHead(code, {"Content-Type": "application/json"});
    res.write(JSON.stringify(content, null, "  "));
    if (VERBOSE) {
        console.log(JSON.stringify(content, null, "  "));
    }
    res.end();
};

/**
 * Display a helptext about the API.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/", (req, res) => {

    res.writeHead(200, "Content-Type: text/plain");
    res.write(
`Welcome to BTH's lecture hall API. This is what the API can help you with:
---------------------------------------------------------------------------
ROUTES                          DESCRIPTION
------                          -----------
/                               Display this page.
/room/list                      Show all lecture halls.
/room/view/id/:number           Show details of lecture hall with :number.
/room/view/house/:house         Show all lecture halls in the selected :house.
/room/search/:keyword           Search for :keyword in all fields.
/room/search/:priority_search   Priority search. See documentation for full explanation.`
    );
    res.end();
});

/**
 * Get the list of all rooms.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/list", (req, res) => {

    let query = url.parse(req.url, true).query;
    let max = (query.max !== undefined) ? query.max : null;
    try {
        dataValue = data.getList(max);
    } catch (err) {
        message = err.message;
    }

    // Send the response
    sendJSONResponse(res, {
        "message": message || "Success",
        "data": dataValue,
    });
});

/**
 * Return information about single room.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/id/:number", (req, res) => {

    let roomId = req.params.number;
    try {
        dataValue = data.getSingleRoom(roomId);
    } catch (err) {
        message = err.message;
    }

    // Send the response
    sendJSONResponse(res, {
        "message": message || "Success",
        "data": dataValue,
    });
});

/**
 * Return all rooms in specific house.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/view/house/:house", (req, res) => {

    let houseName = req.params.house;
    let query = url.parse(req.url, true).query;
    let max = (query.max !== undefined) ? query.max : null;
    try {
        dataValue = data.getRoomsInHouse(decodeURI(houseName), max);
    } catch (err) {
        message = err.message;
    }

    // Send the response
    sendJSONResponse(res, {
        "message": message || "Success",
        "data": dataValue,
    });
});

/**
 * Search among all rooms.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/search/:search", (req, res) => {

    let searchQuery = req.params.search;
    let query = url.parse(req.url, true).query;
    let max = (query.max !== undefined) ? query.max : null;
    try {
        dataValue = data.search(decodeURI(searchQuery), max);
    } catch (err) {
        message = err.message;
    }

    // Send the response
    sendJSONResponse(res, {
        "message": message || "Success",
        "data": dataValue,
        "keyword": decodeURI(searchQuery)
    });
});

/**
 * Search with priority among all rooms.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/searchp/:search", (req, res) => {

    let searchQuery = req.params.search;
    let query = url.parse(req.url, true).query;
    let max = (query.max !== undefined) ? query.max : null;
    try {
        dataValue = data.searchPriority(decodeURI(searchQuery), max);
    } catch (err) {
        message = err.message;
    }

    // Send the response
    sendJSONResponse(res, {
        "message": message || "Success",
        "data": dataValue,
        "keyword": decodeURI(searchQuery)
    });
});

/**
 * Create and export the server
 */
const server = http.createServer((req, res) => {
    let ipAddress,
        route;

    // Log incoming requests
    ipAddress = req.connection.remoteAddress;

    // Check what route is requested
    route = url.parse(req.url).pathname;
    console.log("Incoming route " + route + " from ip " + ipAddress);

    // Let the router take care of all requests
    router.route(req, res);
});

export default server;
