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
            State.verifyMonitor()
            out({monitorPID: state.monitor})
            return true
        case "incClockRaw":
            if(!state.paused && !Server.anyOn()) ++state.clock
            else state.clock = 0

            console.log(state.clock)
            return true
        case "getFullState":
            State.verifyMonitor()

            out({
                servers: Server.getServers(),
                hostState: State.state
            })

            return true
        case "shutdown":
            Server.mustBeOff()
            Server.write()
            State.write(State.default)
            exec("../res/shutdown.bash")
            process.exit(0)
        default:
            return false
    }
}
