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
        await dlAction()
    } else {
        await dlAction()
    }
}

async function dlAction() {
    try {
        await fse.remove(tplPath)
    } catch (err) {
        console.error(err)
        process.exit()
    }  // 读取配置，用于获取镜像链接
    const dlSpinner = ora(chalk.cyan('Downloading template...'))
// 开始执行等待动画
    dlSpinner.start()
    try {
        let config = await fse.readJson(path.resolve(__proname, './config.json'))
        // 下载模板后解压
        download(config.mirror, path.resolve(__proname, './template/'), {clone: true}, err => {
            console.log(err)
        });
    } catch (err) {    // 下载失败时提示
        dlSpinner.text = chalk.red(`Download template failed. ${err}`)
        // 终止等待动画并显示 X 标志
        dlSpinner.fail()
        process.exit()
    }
    // 下载成功时提示
    dlSpinner.text = 'Download template successful.'
    process.exit()
}

export default dlTemplate;