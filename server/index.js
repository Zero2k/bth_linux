#!/usr/bin/env babel-node
import path from 'path';
import server from "./server.js";

const VERSION = "1.0.0";

// For CLI usage
const scriptName = path.basename(process.argv[1]);
const args = process.argv.slice(2);
let arg;

// Get the server with defaults
let port = process.env.LINUX_PORT || 1337;

/**
 * Display helptext about usage of this script.
 */
function usage() {
    console.log(`
    Usage: ${scriptName} [options]
    Options:
    -h               Display help text.
    -v               Display the version.
    --port <number>  Run server on this port.
    `);
}

/**
 * Display helptext about bad usage.
 *
 * @param String message to display.
 */
function badUsage(message) {
    console.log(`${message} Use -h to get an overview of the command.`);
}

/**
 * Display version.
 */
function version() {
    console.log(VERSION);
}

// Walkthrough all arguments checking for options.
while ((arg = args.shift()) !== undefined) {
    switch (arg) {
        case "-h":
            usage();
            process.exit(0);
            break;

        case "-v":
            version();
            process.exit(0);
            break;

        case "--port":
            port = Number.parseInt(args.shift());
            if (Number.isNaN(port)) {
                badUsage("--port must be followed by a port number.");
                process.exit(1);
            }
            break;

        default:
            badUsage("Unknown argument.");
            process.exit(1);
            break;
    }
}

// Main
server.listen(port);
console.log("The server is now listening on: " + port);
