#!/bin/bash

if [[ -z "$1" ]]
then
    echo "Requires time to stay on arg"
    exit 1
fi

delay=30 # seconds
max=$(((60 / "$delay") * "$1")) # iterations

while true
do
    node app.js checkAll
    sleep "$delay"
    clock=$(($(node app.js incClock) + 0))

    if [[ "$clock" -ge "$max" ]]
    then
        node app.js shutdown
        break
    fi
done

exit 0
