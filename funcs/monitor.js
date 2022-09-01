import State from "../state.js"
import Server from "../server.js"
import exec from "../exec.js"
import out from "../out.js"

const func = process.argv[2]

export default () => {
    const state = State.state

    switch(func) {
        case "pause":
            state.paused = true
            out("Run 'resume' to resume shutdown clock")
            return true
        case "resume":
            state.paused = false
            return true
        case "ping":
            if(state.monitor == null) {
                const monitor = `nohup ./res/monitor.bash ${state.totalMinutes}  &>/dev/null`
                state.clock = 0
                state.monitor = exec(`(${monitor}) & echo $!`).result
            }

            out("OK")
            return true
        case "incClock":
            if(!state.stop && !Server.anyOn()) ++state.clock
            else state.clock = 0

            out(state.clock)
            return true
        case "getFullState":
            out({
                servers: Server.getServers(),
                state: State.state
            })

            return true
        case "shutdown":
            Server.mustBeOff()
            Server.write()
            State.write(State.default)
            exec("./res/shutdown.bash")
            process.exit(0)
        default:
            return false
    }
}
