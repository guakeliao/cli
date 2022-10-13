import {__proname} from "../common/index.js";
import logSymbols from "log-symbols";
import chalk from "chalk";
import fse from "fs-extra";
import path from "path";

const cfgPath = path.resolve(__proname, './config.json')

async function setMirror(link) {
    const exists = await fse.pathExists(cfgPath)
    if (!exists) {
        await fse.createFile(cfgPath)
    }
    try {
        let mirrorConfig = {
            mirror: link,
            name: 'cli'
        }
        await fse.writeJson(cfgPath, mirrorConfig)
        console.log(logSymbols.success, chalk.green('Set the mirror successful.'))
    } catch (err) {    // 如果出错，提示报错信息
        console.log(logSymbols.error, chalk.red(`Set the mirror failed. ${err}`))
        process.exit()
    }
}

async function mirror() {
    const exists = await fse.pathExists(cfgPath)
    if (!exists) {
        console.log(logSymbols.error, chalk.red(`mirror not exists ,Set the mirror first`))
        process.exit()
    }
    let mirrorConfig = await fse.readJson(cfgPath).catch(err => {
        console.log(logSymbols.error, chalk.red(`mirror not exists ,Set the mirror first`))
        process.exit()
    })
    console.log(logSymbols.success, chalk.green(`mirror:${mirrorConfig.mirror}`))
    process.exit()
}

export {
    setMirror, mirror
}