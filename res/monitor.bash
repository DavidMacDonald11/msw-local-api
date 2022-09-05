#!/bin/bash

if [[ -z "$1" || -z "$2" ]]
then
    echo "Requires totalMinutes and delaySeconds args"
    exit 1
fi

delay="$2"
max=$(((60 / "$delay") * "$1"))

while true
do
    node app.js getServers >/dev/null
    sleep "$delay"
    clock=$(($(node app.js incClockRaw) + 0))

    if [[ "$clock" -ge "$max" ]]
    then
        node app.js shutdown
        break
    fi
done

exit 0
