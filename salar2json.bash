#!/bin/bash

JSON=$(jq --slurp --raw-input --raw-output \
    'split("\n") | .[1:] | .[2:] | map(split(",")) |
    map({
        "Salsnr": .[0],
        "Salsnamn": .[1],
        "Lat": .[2],
        "Long": .[3],
        "Ort": .[4],
        "Hus": .[5],
        "Våning": .[6],
        "Typ": .[7],
        "Storlek": .[8]
})' salar.csv)

echo "${JSON//\"\"/null}" > salar.json
