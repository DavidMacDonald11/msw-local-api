import State from "./state.js"
import exec from "./exec.js"

const func = process.argv[2]
let state = State.readState()

switch(func) {
    case "clear":
        state = State.defaultState
        break
    case "stop":
        state.stop = true
        console.log("Run 'unstop' to stop stopping")
        break
    case "unstop":
        state.stop = false
        break
    case "ping":
        if(state.monitor == null) {
            state.clock = 0
            state.monitor = exec("(nohup ./res/monitor.bash &>/dev/null) & echo $!")
        }

        console.log("OK")
        break
    case "incClock":
        if(!state.stop) ++state.clock
        console.log(state.clock)
        break
    case "shutdown":
        console.log("Shutting down...")
        State.writeState(State.defaultState)
        exec("./res/shutdown.bash")
        process.exit(0)
    default:
        console.log(`Unknown function ${func}`)
        process.exit(1)
}

State.writeState(state)
