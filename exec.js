import {execSync} from "child_process"

function exec(command) {
    const commandIsString = typeof command === "string" || command instanceof String
    if(!commandIsString) { command = scriptToCommand(command)}

    try {
        return {result: execSync(command, {shell: "/bin/bash"}).toString()}
    } catch(error) {
        return {error, result: "Error"}
    }
}

function scriptToCommand(script) {
    let command = ""
    script.forEach(line => {command += `${line};\n`})
    return command.trimEnd()
}

export default exec
