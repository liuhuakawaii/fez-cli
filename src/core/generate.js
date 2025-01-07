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

    // 2. 复制基础模板
    await this.copyBaseTemplate();

    // 3. 应用语言模板
    await this.applyLanguageTemplate();

    // 4. 应用样式模板
    await this.applyStyleTemplate();

    // 5. 配置构建工具
    await this.configureBundler();

    // 6. 安装依赖
    await this.installDependencies();
  }

  async copyBaseTemplate() {
    const baseTemplatePath = path.join(
      this.templateDir,
      this.options.framework,
      'base'
    );
    await renderTemplate(baseTemplatePath, this.targetDir, this.options);
  }

  async applyLanguageTemplate() {
    if (this.options.language === 'typescript') {
      const tsTemplatePath = path.join(
        this.templateDir,
        this.options.framework,
        'typescript'
      );
      await renderTemplate(tsTemplatePath, this.targetDir, this.options);
    }
  }

  async applyStyleTemplate() {
    // 只复制用户选择的 CSS 方案的模板
    if (this.options.cssFramework !== 'none') {
      const styleTemplatePath = path.join(
        this.templateDir,
        this.options.framework,
        'styles',
        this.options.cssFramework
      );
      await renderTemplate(styleTemplatePath, this.targetDir, this.options);
    }
  }

  async configureBundler() {
    const configPath = path.join(
      this.templateDir,
      'config',
      this.options.bundler
    );
    await renderTemplate(configPath, this.targetDir, this.options);
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