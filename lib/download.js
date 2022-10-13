import {__proname} from "../common/index.js";
import download from "download-git-repo"
// 请求 ora 库，用于实现等待动画
import ora from "ora";
// 请求 chalk 库，用于实现控制台字符样式
import chalk from "chalk";
import fse from "fs-extra";
import path from "path";
// 拼接 template 模板文件夹完整路径
const tplPath = path.resolve(__proname, './template')

async function dlTemplate() {
    const exists = await fse.pathExists(tplPath)
    if (exists) {
        await fse.remove(tplPath)
    }
    await dlAction()
}

async function dlAction() {
    const dlSpinner = ora(chalk.cyan('Downloading template...'))
    // 开始执行等待动画
    dlSpinner.start()
    let config = await fse.readJson(path.resolve(__proname, './config.json')).catch(err => {
        dlSpinner.text = chalk.red(`Download template failed. ${err}`)
        dlSpinner.fail()
        process.exit()
    })
    // 下载模板后解压
    await download(config.mirror, path.resolve(__proname, './template/'), {clone: true}, err => {
        if (err) {
            dlSpinner.fail(`Download template failed. ${err}`)
        } else {
            dlSpinner.succeed('Download template successful.')
        }
        process.exit()
    });

}

export default dlTemplate;