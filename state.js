import fs from "fs"
import exec from "./exec.js"

class State {
    static file = "./res/state.json"
    static state = undefined

    static default = {
        totalMinutes: 15,
        delaySeconds: 30,
        clock: 0,
        monitor: null,
        paused: false
    }

    static read() {
        try {
            this.state = JSON.parse(fs.readFileSync(this.file, "utf-8"))
        } catch(error) {
            if(error.code != "ENOENT") throw error
        }
    }

    static write(state = null) {
        state = state || this.state
        fs.writeFileSync(this.file, JSON.stringify(state, null, "  ") + "\n")
    }

    static verifyMonitor() {
        if(this.state.monitor === null) return this.startMonitor()

        const isValid = exec(`ps -p ${this.state.monitor} >/dev/null; echo $?`).result == "0"
        if(!isValid) this.startMonitor()
    }

    static startMonitor() {
        const args = `${this.state.totalMinutes} ${this.state.delaySeconds}`
        const command = `nohup ./res/monitor.bash ${args} >/dev/null 2>&1 & echo $!`
        this.state.monitor = exec(command).result
        this.state.clock = 0
    }
}

export default State
