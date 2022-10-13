import fse from "fs-extra";
import ora from "ora";
import chalk from "chalk";
import symbols from "log-symbols";
import inquirer from "inquirer"; // 请求 inquirer 库，用于控制台交互
import handlebars from "handlebars"; // 请求 handlebars 库，用于替换模板字符
import path from "path";
import dlTemplate from "../lib/download.js"
import {__proname} from "../common/index.js";

async function initProject(projectName) {
    try {
        const exists = await fse.pathExists(projectName)
        if (exists) {
            // 项目重名时提醒用户
            console.log(symbols.error, chalk.red('The project already exists.'))
        } else {
            // 执行控制台交互
            inquirer.prompt([{
                type: 'input', // 类型，其他类型看官方文档
                name: 'name',  // 名称，用来索引当前 name 的值
                message: 'Set a project name ?', default: 'Default',  // 默认值，用户不输入时用此值
            },]).then(async (answers) => {
                // Spinner 初始设置
                const initSpinner = ora(chalk.cyan('Initializing project...'))
                // 开始执行等待动画
                initSpinner.start()
                // 拼接 template 文件夹路径
                const templatePath = path.resolve(__proname, './template/')
                // 返回 Node.js 进程的当前工作目录
                const processPath = process.cwd()
                // 拼接项目完整路径
                const targetPath = `${processPath}/${projectName}`
                // 先判断模板路径是否存在
                const exists = await fse.pathExists(templatePath)
                if (!exists) {
                    // 不存在时，就先等待下载模板，下载完再执行下面的语句
                    await dlTemplate()
                }
                // 等待复制好模板文件到对应路径去
                try {
                    await fse.copy(templatePath, targetPath)
                } catch (err) {
                    console.log(symbols.error, chalk.red(`Copy template failed. ${err}`))
                    process.exit()
                }
                // 把要替换的模板字符准备好
                const multiMeta = {project_name: projectName, global_name: answers.name}
                // 把要替换的文件准备好
                const multiFiles = [`${targetPath}/package.json`, `${targetPath}/gulpfile.js`, `${targetPath}/test/index.html`, `${targetPath}/src/index.js`]
                // 用条件循环把模板字符替换到文件去
                for (let i = 0; i < multiFiles.length; i++) {
                    // 这里记得 try {} catch {} 哦，以便出错时可以终止掉 Spinner
                    try {
                        // 等待读取文件
                        const multiFilesContent = await fse.readFile(multiFiles[i], 'utf8')
                        // 等待替换文件，handlebars.compile(原文件内容)(模板字符)
                        const multiFilesResult = await handlebars.compile(multiFilesContent)(multiMeta)
                        // 等待输出文件
                        await fse.outputFile(multiFiles[i], multiFilesResult)
                    } catch (err) {
                        // 终止等待动画并显示 X 标志
                        initSpinner.fail(chalk.red(`Initialize project failed. ${err}`))
                        // 退出进程
                        process.exit()
                    }
                }
                initSpinner.succeed('Initialize project successful.')
            }).catch((error) => {
                if (error.isTtyError) {
                    console.log(symbols.error, chalk.red("Prompt couldn't be rendered in the current environment."))
                } else {
                    console.log(symbols.error, chalk.red(error))
                }
            })
        }
    } catch (err) {
        console.error(err)
        process.exit()
    }
}

export default initProject