import fs from "fs"

const stateFile = "./res/state.json"

const defaultState = {
    clock: 0,
    monitor: null,
    stop: false
}

function readState() {
    try {
        return JSON.parse(fs.readFileSync(stateFile, "utf-8"))
    } catch(error) {
        if(error.code != "ENOENT") throw error
        return defaultState
    }
}

function writeState(state) {
    fs.writeFileSync(stateFile, JSON.stringify(state) + "\n")
}

export default {readState, writeState, defaultState}
