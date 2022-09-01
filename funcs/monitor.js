import State from "../state.js"
import Servers from "../servers.js"
import exec from "../exec.js"

const func = process.argv[2]

export default () => {
    const state = State.state

    switch(func) {
        case "stop":
            state.stop = true
            console.log("Run 'unstop' to stop stopping")
            return true
        case "unstop":
            state.stop = false
            return true
        case "ping":
            if(state.monitor == null) {
                const monitor = `nohup ./res/monitor.bash ${state.totalMinutes}  &>/dev/null`
                state.clock = 0
                state.monitor = exec(`(${monitor}) & echo $!`).result.trim()
            }

            console.log("OK")
            return true
        case "incClock":
            if(!state.stop && !Servers.anyOn()) ++state.clock
            else state.clock = 0

            console.log(state.clock)
            return true
        case "getStats":
            console.log(JSON.stringify(state))
            return true
        case "shutdown":
            Servers.mustBeOff()
            Servers.write()
            State.write(State.default)
            exec("./res/shutdown.bash")
            process.exit(0)
        default:
            return false
    }
}
