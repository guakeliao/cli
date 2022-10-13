#!/usr/bin/env node
import {program} from "commander";
import fse from "fs-extra";
import path from "path";
import {__proname} from "../common/index.js";
import updateChk from "../lib/update.js"
import dlTemplate from "../lib/download.js";
import {mirror, setMirror} from "../lib/mirror.js";
import initProject from "../lib/init.js";

const configPath = path.resolve(__proname, './package.json')
const pkg = fse.readJsonSync(configPath)
//查看版本
program.version(pkg.version, '-v, --version')
//对比版本
program.command('upgrade').description("Check the cli version.").action(() => {
    // 执行 lib/update.js 里面的操作
    updateChk()
})
//查看模版url
program.command('mirror')
    .description("show the template mirror.")
    .action(() => {
        mirror()
    })
//设置模版url
program.command('setMirror <template_mirror>')
    .description("Set the template mirror.")
    .action((tplMirror) => {
        setMirror(tplMirror)
    })
//下载/更新模板
program.command('template')
    .description("Download template from mirror.")
    .action(() => {
        dlTemplate().finally(() => {
            process.exit()
        })
    })
// 初始化项目
program.command('init <project_name>')
    .description('Create a project.')
    .action(project => {
        initProject(project)
    })
// 解析命令行参数
program.parse(process.argv)
