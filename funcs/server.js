import Servers from "../servers.js"

const func = process.argv[2]
const id = +process.argv[3]
const command = process.argv[4]

export default () => {
    switch(func) {
        case "startServer":
            checkId()
            Servers.find(id).start()
            return true
        case "listServers":
            Servers.list()
            return true
        case "getServers":
            console.log(Servers.getServers())
            return true
        case "checkServers":
            Servers.checkAll()
            return true
        case "anyServersOn":
            console.log(Servers.anyOn())
            return true
        case "getServerStats":
            checkId()
            const result = Servers.find(id).getStats()
            console.log(JSON.stringify(result))
            return true
        case "rconServer":
            checkId()
            checkCommand()
            console.log(Servers.find(id).rcon(command))
            return true
        default:
            return false
    }
}

function checkId() {
    if(id === undefined) {
        console.log("Requires server ID")
        process.exit(2)
    }
}

function checkCommand() {
    if(command === undefined) {
        console.log("Requires rcon command")
        process.exit(3)
    }
}
