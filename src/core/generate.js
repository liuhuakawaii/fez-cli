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
    this.packageManager = options.packageManager || 'npm';
  }

  async generate() {
    // 1. 创建项目目录
    await fs.ensureDir(this.targetDir);

    // 2. 复制框架模板
    await this.copyFrameworkTemplate();

    // 3. 复制通用文件
    await this.copyCommonFiles();

    // 4. 安装依赖
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
      const installCmd = this.getInstallCommand().split(' ')[0]; // 只取包管理器名称
      spinner.text = '正在安装依赖...';
      await this.execCommand(`${installCmd} install`);
      spinner.succeed('依赖安装完成！');
    } catch (error) {
      spinner.fail('依赖安装失败！');
      throw error;
    }
  }

  getInstallCommand() {
    const commands = {
      npm: 'npm install',
      cnpm: 'cnpm install',
      pnpm: 'pnpm add',
      yarn: 'yarn add'
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