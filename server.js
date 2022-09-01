import fs from "fs"
import exec from "./exec.js"
import out from "./out.js"

class Server {
    static file = "./res/servers.json"
    static servers = []

    static read() {
        try {
            const servers = JSON.parse(fs.readFileSync(this.file, "utf-8"))
            servers.forEach(server => {this.servers.push(new Server(server))})
        } catch(error) {
            if(error.code != "ENOENT") throw error
        }
    }

    static write() {
        const servers = this.servers.map(server => {
            return {
                public: server.public,
                local: server.local
            }
        })

        fs.writeFileSync(this.file, JSON.stringify(servers, null, "  ") + "\n")
    }

    static mustBeOff() {
        this.servers.forEach(server => {
            server.info.isOn = false,
            server.info.pid = undefined
        })
    }

    static anyOn() {
        return this.servers.some(server => {return server.public.isOn})
    }

    static find(id) {
        let found = null

        this.servers.forEach(server => {
            if(server.info.id === id) {
                found = server
                return
            }
        })

        if(found) return found

        out(null, `Unknown server ID ${id}`)
        process.exit(3)
    }

    static getServers() {
        return this.servers.map(server => {
            server.checkState()

            return {
                public: server.public,
                state: server.state
            }
        })
    }

    constructor(server) {
        this.public = server.public
        this.local = server.local

        let rconCommand = "java -jar ./res/minecraft-rcon-client-1.0.0.jar"
        let rconArgs = `localhost:${this.local.rcon} ${this.local.rconPass}`

        this.rconCommand = `${rconCommand} ${rconArgs}`
        this.state = {playerCount: 0, minutesLeft: 0}
    }

    start() {
        if(this.public.isOn) return
        this.public.isOn = true

        this.local.pid = exec([
            `cd "${this.local.path}"`,
            "(nohup java -jar -Xms2G -Xmx5G server.jar > logs/run.log 2>&1) & echo $!"
        ]).result
    }

    checkOn() {
        if(this.local.pid === undefined) return

        const result = exec([
            `kill -s 0 ${this.local.pid}`,
            "echo $?"
        ]).result

        this.public.isOn = result == "0"
    }

    rcon(command) {
        return exec(`${this.rconCommand} "${command}"`).result.split("\n")[1]
    }

    checkState() {
        this.checkOn()
        if(!this.public.isOn) return

        const getPlayerCount = "/scoreboard players get #ItHandler it_online"
        const getClock = "/scoreboard players get #Clock it_30mClock"
        const results = exec(`${this.rconCommand} "${getPlayerCount}" "${getClock}"`).result.split("\n")

        let playerCount = +results[1].replace("< #ItHandler has", "").replace("[it_online]", "").trim()
        let clock = +results[3].replace("< #Clock has", "").replace("[it_30mClock]", "").trim()

        const totalMinutes = 30
        let minutesLeft = clock >= 0 ? totalMinutes - (clock / 2) : 0

        this.state = {playerCount, minutesLeft}
    }
}

export default Server
