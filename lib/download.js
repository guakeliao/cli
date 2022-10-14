import {__proname} from "../common/index.js";
import download from "download";
// 请求 ora 库，用于实现等待动画
import ora from "ora";
// 请求 chalk 库，用于实现控制台字符样式
import chalk from "chalk";
import fse from "fs-extra";
import path from "path";
// 拼接 template 模板文件夹完整路径
const tplPath = path.resolve(__proname, './template')

function dlTemplate() {
    return new Promise(async (resolve) => {
        const exists = await fse.pathExists(tplPath)
        if (exists) {
            await fse.remove(tplPath)
        }
        const dlSpinner = ora(chalk.cyan('Downloading template...'))
        // 开始执行等待动画
        dlSpinner.start()
        dlAction().then(res => {
            dlSpinner.succeed(chalk.green(res))
        }).catch(err => {
            dlSpinner.fail(chalk.red(err.message ?? 'Download template failed'))
        }).finally(() => {
            resolve("")
        })
    })
}

function dlAction() {
    // download-git-repo 下载方式: direct:ssh://*****.git
    // return new Promise((resolve, reject) => {
    //     fse.readJson(path.resolve(__proname, './config.json')).then(res => {
    //         // 下载模板后解压
    //         download(res.mirror, path.resolve(__proname, './template/'), {clone: true}, err => {
    //             if (err) {
    //                 reject(new Error(`Download template failed. ${err}`))
    //             } else {
    //                 resolve("'Download template successful.'")
    //             }
    //         });
    //     }).catch(err => {
    //         reject(new Error(`Download template failed. ${err}`))
    //     })
    // })
    return new Promise((resolve, reject) => {
        fse.readJson(path.resolve(__proname, './config.json')).then(res => {
            return download(res.mirror, path.resolve(__proname, './template/'), {extract: true});
        }).then(_ => {
            resolve("'Download template successful.'")
        }).catch(err => {
            reject(new Error(`Download template failed. ${err}`))
        })
    })
}

export default dlTemplate;