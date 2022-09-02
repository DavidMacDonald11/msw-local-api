import State from "./state.js"
import Server from "./server.js"
import useMonitorFuncs from "./funcs/monitor.js"
import useServerFuncs from "./funcs/server.js"
import out from "./out.js"

State.read()
Server.read()

let found = useMonitorFuncs()
found = found || useServerFuncs()

if(found) {
    State.write()
    Server.write()
    process.exit(0)
}

const func = process.argv[2] || "help"

switch(func) {
    case "clear":
        State.state = State.default
        Server.mustBeOff()
        break
    case "help":
        console.log([
            "Run node app.js 'func', where 'func' is one of:",
            "\tclear, help, pause, resume, ping, incClockRaw, getFullState, shutdown",
            "\tgetServers, startServer, rconServer.",
            "WARNING: 'Raw' commands do no NOT output JSON."
        ].join("\n"))
        break
    default:
        out(null, `Unknown function ${func}`)
        process.exit(1)
}

State.write()
Server.write()
