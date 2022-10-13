#!/usr/bin/env node
import {__proname} from "../common/index.js";
import {updateChk} from "../lib/update.js"
import {program} from "commander";
import fse from "fs-extra";
import path from "path";
import dlTemplate from "../lib/download.js";
import {mirror, setMirror} from "../lib/mirror.js";

const configPath = path.resolve(__proname, './package.json')
const pkg = fse.readJsonSync(configPath)

program.version(pkg.version, '-v, --version')
program.command('upgrade').description("Check the cli version.").action(() => {
    // 执行 lib/update.js 里面的操作
    updateChk()
})
// template 下载/更新模板
program.command('template')
    .description("Download template from mirror.")
    .action(() => {
        dlTemplate()
    })

program.command('mirror')
    .description("show the template mirror.")
    .action(() => {
        mirror()
    })
// mirror 切换镜像链接
program.command('setMirror <template_mirror>')
    .description("Set the template mirror.")
    .action((tplMirror) => {
        setMirror(tplMirror)
    })
// 解析命令行参数
program.parse(process.argv)
