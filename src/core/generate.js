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
    const templatePath = path.join(
      this.templateDir,
      this.options.framework,
      this.options.language,
      this.options.bundler
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

    const { dependencies, devDependencies } = getDependencies(this.options);

    // 创建 package.json
    const packageJson = {
      name: this.options.projectName,
      version: '1.0.0',
      private: true,
      scripts: {
        "dev": this.options.bundler === 'vite' ? 'vite' : 'webpack serve',
        "build": this.options.bundler === 'vite' ? 'vite build' : 'webpack build',
        "serve": this.options.bundler === 'vite' ? 'vite preview' : 'serve dist'
      }
    };

    await fs.writeJSON(path.join(this.targetDir, 'package.json'), packageJson, { spaces: 2 });

    const spinner = ora('正在安装依赖...').start();

    try {
      const installCmd = this.getInstallCommand();

      if (dependencies.length > 0) {
        spinner.text = '正在安装项目依赖...';
        await this.execCommand(`${installCmd} ${dependencies.join(' ')}`);
      }

      if (devDependencies.length > 0) {
        spinner.text = '正在安装开发依赖...';
        await this.execCommand(`${installCmd} -D ${devDependencies.join(' ')}`);
      }

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