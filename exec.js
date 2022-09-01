import {execSync} from "child_process"

function exec(command) {
    const commandIsString = typeof command === "string" || command instanceof String
    if(!commandIsString) { command = scriptToCommand(command)}

    const output = execSync(command, {shell: "/bin/bash"}).toString()
    return output
}

function scriptToCommand(script) {
    let command = ""
    script.forEach(line => {command += `${line};\n`})
    return command.trimEnd()
}

export default exec
