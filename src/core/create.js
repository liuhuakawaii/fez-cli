import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import prompt from './prompt.js';
import Generator from './generate.js';

async function create(projectName) {
  const cwd = process.cwd();
  const targetDir = path.join(cwd, projectName);

  // 检查目录是否存在
  if (fs.existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `目标目录 ${chalk.cyan(targetDir)} 已存在. 请选择:`,
        choices: [
          { name: '覆盖', value: 'overwrite' },
          { name: '取消', value: false }
        ]
      }
    ]);

    if (!action) {
      return;
    } else if (action === 'overwrite') {
      console.log(`\n${chalk.red('正在删除')} ${chalk.cyan(targetDir)}...`);
      await fs.remove(targetDir);
    }
  }

  // 获取用户选项
  const options = await prompt();

  // 创建项目
  const spinner = ora('正在创建项目...').start();

  try {
    const generator = new Generator({
      ...options,
      projectName
    }, targetDir);
    await generator.generate();

    spinner.succeed('项目创建成功!');

    // 更新提示信息
    console.log('\n你可以执行以下命令开始开发:');
    console.log(chalk.cyan(`\n  cd ${projectName}`));
    // 根据实际使用的包管理器显示对应的命令
    const packageManager = generator.packageManager || 'npm';
    const runCmd = {
      npm: 'npm run',
      pnpm: 'pnpm'
    }[packageManager] || 'npm run';
    console.log(chalk.cyan(`  ${runCmd} dev`));

    // 添加额外的帮助信息
    console.log('\n可用的命令:');
    console.log(chalk.cyan(`  ${runCmd} dev`) + ' - 启动开发服务器');
    console.log(chalk.cyan(`  ${runCmd} build`) + ' - 构建生产版本');
    console.log(chalk.cyan(`  ${runCmd} serve`) + ' - 预览生产版本\n');
  } catch (error) {
    spinner.fail('项目创建失败!');
    console.error(chalk.red(error));
  }
}

export default create;