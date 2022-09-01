import fs from "fs"
import exec from "./exec.js"

class Servers {
    static file = "./res/servers.json"
    static servers = []

    static read() {
        try {
            const arr = JSON.parse(fs.readFileSync(this.file, "utf-8"))
            arr.forEach(info => {
                this.servers.push(new Servers(info))
            })
        } catch(error) {
            if(error.code != "ENOENT") throw error
        }
    }

    static write() {
        fs.writeFileSync(this.file, this.toJSON() + "\n")
    }

    static mustBeOff() {
        this.servers.forEach(server => {
            server.info.isOn = false,
            server.info.pid = undefined
        })
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

        console.log("Unknown server ID")
        process.exit(3)
    }

    static list() {
        this.servers.forEach(server => {
            console.log(server.info.name)
        })
    }

    static toJSON() {
        const infos = this.servers.map(server => { return server.info })
        return JSON.stringify(infos, null, "  ")
    }

    static getServers() {
        return JSON.stringify(this.servers.map(server => {
            return {
                id: server.info.id,
                name: server.info.name,
                description: server.info.description,
                edition: server.info.edition,
                version: server.info.version,
                port: server.info.port,
                isOn: server.info.isOn
            }
        }))
    }

    static checkAll() {
        this.servers.forEach(server => { server.check() })
    }

    static anyOn() {
        return this.servers.some(server => { return server.info.isOn })
    }

    constructor(info) {
        this.info = info
    }

    start() {
        if(this.info.isOn) return
        this.info.isOn = true

        this.info.pid = exec([
            `cd "${this.info.path}"`,
            "(nohup java -jar -Xms2G -Xmx5G server.jar > logs/run.log 2>&1) & echo $!"
        ]).result.trim()
    }

    check() {
        if(this.info.pid === undefined) return

        const result = exec([
            `kill -s 0 ${this.info.pid}`,
            "echo $?"
        ]).result.trim()

        this.info.isOn = result == "0"
    }

    rcon(command) {
        const java = "java -jar ./res/minecraft-rcon-client-1.0.0.jar"
        const args = `localhost:${this.info.rcon} ${this.info.rconPass} "${command}"`
        return exec(`${java} ${args}`).result.split("\n")[1]
    }

    getStats() {
        if(!this.info.isOn) return {playerCount: 0, minutesLeft: 0}

        let playerCount = this.rcon("/scoreboard players get #ItHandler it_online")
        playerCount = +playerCount.replace("< #ItHandler has", "").replace("[it_online]", "").trim()

        let clock = this.rcon("/scoreboard players get #Clock it_30mClock")
        clock = +clock.replace("< #Clock has", "").replace("[it_30mClock]", "").trim()

        const totalMinutes = 30
        let minutesLeft = clock >= 0 ? totalMinutes - (clock / 2) : 0

        return {playerCount, minutesLeft}
    }
}

export default Servers
