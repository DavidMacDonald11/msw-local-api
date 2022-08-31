#!/bin/bash

delay=60 # seconds
max=15 # minutes

while true
do
    sleep "$delay"
    clock=$(($(node app.js incClock) + 0))

    if [[ "$clock" -ge "$max" ]]
    then
        node app.js shutdown
        break
    fi
done

exit 0
