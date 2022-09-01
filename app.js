import State from "./state.js"
import Servers from "./servers.js"
import useMonitorFuncs from "./funcs/monitor.js"
import useServerFuncs from "./funcs/server.js"

State.read()
Servers.read()

let found = useMonitorFuncs()
found = found || useServerFuncs()

if(found) {
    State.write()
    Servers.write()
    process.exit(0)
}

const func = process.argv[2] || "help"

switch(func) {
    case "clear":
        State.state = State.default
        Servers.mustBeOff()
        break
    case "help":
        console.log("Run node app.js 'func', where 'func' is one of:")
        console.log("\tclear, help, stop, unstop, ping, incClock, getStats, shutdown")
        console.log("\tstartServer, listServers, getServersJSON, checkServers, anyServersOn, getServerStats, rconServer")
        break
    default:
        console.log(`Unknown function ${func}`)
        process.exit(1)
}

State.write()
Servers.write()
