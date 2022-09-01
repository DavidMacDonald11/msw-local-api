import Server from "../server.js"
import out from "../out.js"

const func = process.argv[2]
const id = +process.argv[3]
const command = process.argv[4]

export default () => {
    switch(func) {
        case "getServers":
            out(Server.getServers(), null, "  ")
            return true
        case "startServer":
            checkId()
            Server.find(id).start()
            return true
        case "rconServer":
            checkId()
            checkCommand()
            out(Server.find(id).rcon(command))
            return true
        default:
            return false
    }
}

function checkId() {
    if(id === undefined) {
        out(null, "Requires server ID")
        process.exit(2)
    }
}

function checkCommand() {
    if(command === undefined) {
        out(null, "Requires rcon command")
        process.exit(3)
    }
}
