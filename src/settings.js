import fs from "fs"
import state from "./state.js"

class Settings {
    static file = "./res/settings.json"
    static settings = undefined

    static read() {
        try {
            this.settings = JSON.parse(fs.readFileSync(this.file, "utf-8"))
            state.default = this.settings.defaultState
        } catch(error) {
            if(error.code != "ENOENT") throw error
        }
    }
}

export default Settings
