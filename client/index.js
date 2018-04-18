#!/usr/bin/env babel-node
"use strict";
import readline from 'readline';
import Client from './client.js';

const VERSION = "1.0.0";

// For CLI usage
let path = require("path");
let scriptName = path.basename(process.argv[1]);
let args = process.argv.slice(2);
let arg, port;

const client = new Client();

let server = "localhost:1337";

// Make it using prompt

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Display helptext about usage of this script.
 */
function usage() {
    console.log(`Usage: ${scriptName} [options]

    Options:
    -h               Display help text.
    -v               Display the version.
    --server <url>   Set the server url to use.
    `);
}

/**
 * Display helptext about bad usage.
 *
 * @param String message to display.
 */
function badUsage(message) {
    console.log(`${message}
    Use -h to get an overview of the command.`);
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

        case "--server":
            server = args.shift();
            if (server === undefined) {
                badUsage("--server must be followed by a url such as localhost or google.com");
                process.exit(1);
            }
            break;

        case "--port":
            port = Number.parseInt(args.shift());
            if (Number.isNaN(port)) {
                badUsage("--port must be followed by a port number. (Combine this with --server to specify a port)");
                process.exit(1);
            }
            break;

        case "--develop":
            client.setVerbose();
            break;

        default:
            badUsage("Unknown argument.");
            process.exit(1);
            break;
    }
}

/**
 * Display a menu.
 */
function menu() {
    console.log(`
    Commands available:
    exit            Leave this program.
    menu            Print this menu.
    url             Get url to view the server in browser.
    list            List all rooms.
    view <id>       View the room with the selected id.
    house <house>   View the names of all rooms in this building (house).
    search <string> View the details of all matching rooms (one per row).
    `);
}

/**
 * Callbacks for client asking question.
 */
rl.on("line", function(line) {
    // Split incoming line with arguments into an array
    var args = line.trim().split(" ");
    args = args.filter(value => {
        return value !== "";
    });

    switch (args[0]) {
        case "exit":
            console.log("Bye!");
            process.exit(0);
            break;

        case "menu":
            menu();
            rl.prompt();
            break;

        case "url":
            console.log("Click this url to see the API in the browser.\n" + client.getServer() + "");
            rl.prompt();
            break;

        case "list":
            if (args[1] != null) {
                let limit = args[1];
                client.list(limit)
                .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not view the list.\nDetails: " + err);
                    rl.prompt();
                });
            } else {
                client.list()
                .then(value => {
                    console.log(value);
                    rl.prompt();
                });
            }
            break;

        case "view":
            if (args[1] != null) {
                let id = args[1];

                client.view(id)
                .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not find the selected room.\nDetails: " + err);
                    rl.prompt();
                });
            } else {
                client.list()
                .then(value => {
                    console.log(value);
                    rl.prompt();
                });
            }
            break;

        case "house":
            if (args[1] != null) {
                let name = args[1];
                let limit = args[2];

                client.house(name, limit)
                .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not find the selected house.\nDetails: " + err);
                    rl.prompt();
                });
            } else {
                console.log("FAILED: You need to provid a house name.");
            }
            break;

        case "search":
            if (args[1] != null) {
                let keyword = args[1];
                let limit = args[2];

                client.search(keyword, limit)
                .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: No room match your keyword.\nDetails: " + err);
                    rl.prompt();
                });
            } else {
                console.log("FAILED: You need to provid a search term.");
            }
            break;

        case "searchp":
            if (args[1] != null) {
                let keyword = args[1];
                let limit = args[2];

                client.searchPriority(keyword, limit)
                .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: No room match your keyword.\nDetails: " + err);
                    rl.prompt();
                });
            } else {
                console.log("FAILED: You need to provid a search term.");
            }
            break;

        default:
            console.log("Enter 'menu' to get an overview of what you can do here.");
            rl.prompt();
    }
});



rl.on("close", function() {
    console.log("Bye!");
    process.exit(0);
});



// Main
client.setServer(server, port);
console.log("Use -h to get a list of options to start this program.");
console.log("Ready to talk to server on url '" + client.getServer() + "'.");
console.log("Use 'menu' to get a list of commands.");
rl.setPrompt("Input$ ");
rl.prompt();
