import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { renderTemplate, getDependencies } from '../utils/template.js';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Generator {
  constructor(options, targetDir) {
    this.options = options;
    this.targetDir = targetDir;
    this.templateDir = path.resolve(__dirname, '../templates');
    this.packageManager = 'npm'; // 默认值，会在安装依赖时自动检测
  }

  async generate() {
    // 1. 创建项目目录
    await fs.ensureDir(this.targetDir);

    // 2. 检测包管理器（即使不安装依赖，也检测以便显示正确的提示信息）
    this.packageManager = await this.detectPackageManager();

    // 3. 复制框架模板
    await this.copyFrameworkTemplate();

    // 4. 复制通用文件
    await this.copyCommonFiles();

    // 5. 安装依赖
    await this.installDependencies();
  }

  async copyFrameworkTemplate() {
    // 新的简化模板结构：直接使用框架目录
    const templatePath = path.join(
      this.templateDir,
      this.options.framework
    );
    await renderTemplate(templatePath, this.targetDir, this.options);
  }

  async copyCommonFiles() {
    const commonPath = path.join(this.templateDir, 'common');
    await renderTemplate(commonPath, this.targetDir, this.options);
  }

  async installDependencies() {
    if (!this.options.installDeps) {
      return;
    }

    // 模板中已经包含 package.json，直接安装依赖
    const spinner = ora('正在安装依赖...').start();

    try {
      const installCmd = this.getInstallCommand();
      spinner.text = '正在安装依赖...';
      await this.execCommand(installCmd);
      spinner.succeed('依赖安装完成！');
    } catch (error) {
      spinner.fail('依赖安装失败！');
      throw error;
    }
  }

  async detectPackageManager() {
    // 优先检测pnpm
    if (await this.isCommandAvailable('pnpm')) {
      return 'pnpm';
    }

    // 如果没有pnpm，提示并回退到npm
    if (await this.isCommandAvailable('npm')) {
      // 只有在需要安装依赖时才显示提示
      if (this.options.installDeps) {
        console.log(chalk.yellow('\n⚠️  未检测到 pnpm，将使用 npm 安装依赖'));
        console.log(chalk.gray('   提示: 可以通过 npm install -g pnpm 安装 pnpm\n'));
      }
      return 'npm';
    }

    // 如果npm也没有，抛出错误
    throw new Error('未检测到 npm 或 pnpm，请先安装其中一个包管理器');
  }

  async isCommandAvailable(command) {
    try {
      execSync(`which ${command}`, {
        stdio: 'ignore',
        shell: true
      });
      return true;
    } catch {
      // Windows系统使用where命令
      try {
        execSync(`where ${command}`, {
          stdio: 'ignore',
          shell: true
        });
        return true;
      } catch {
        return false;
      }
    }
  }

  getInstallCommand() {
    const commands = {
      npm: 'npm install',
      pnpm: 'pnpm install'
    };
    return commands[this.packageManager] || 'npm install';
  }

  async execCommand(command) {
    try {
      execSync(command, {
        cwd: this.targetDir,
        stdio: 'inherit',
        shell: true
      });
    } catch (error) {
      console.error(chalk.red(`执行命令失败: ${command}`));
      throw error;
    }
  }
}

export default Generator;