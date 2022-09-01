import fs from "fs"

class State {
    static file = "./res/state.json"
    static state = undefined

    static default = {
        totalMinutes: 15,
        clock: 0,
        monitor: null,
        stop: false
    }

    static read() {
        try {
            this.state = JSON.parse(fs.readFileSync(this.file, "utf-8"))
        } catch(error) {
            if(error.code != "ENOENT") throw error
        }
    }

    static write(state = null) {
        state = state || this.default
        fs.writeFileSync(this.file, JSON.stringify(this.state, null, "  ") + "\n")
    }
}

export default State
