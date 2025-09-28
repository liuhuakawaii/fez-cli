import inquirer from 'inquirer';

async function prompt() {
  const questions = [
    {
      type: 'list',
      name: 'framework',
      message: '选择项目类型:',
      choices: [
        {
          key: '1',
          name: '1. React (TypeScript + Vite + Tailwind + 现代化目录结构)',
          value: 'react'
        },
        {
          key: '2',
          name: '2. Vue 3 (TypeScript + Vite + Tailwind)',
          value: 'vue'
        }
      ]
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: '是否立即安装依赖?',
      default: true
    },
    {
      type: 'list',
      name: 'packageManager',
      message: '选择包管理工具:',
      choices: [
        { key: '1', name: '1. npm', value: 'npm' },
        { key: '2', name: '2. cnpm', value: 'cnpm' },
        { key: '3', name: '3. pnpm', value: 'pnpm' },
        { key: '4', name: '4. yarn', value: 'yarn' }
      ],
      when: (answers) => answers.installDeps
    }
  ];

  const answers = await inquirer.prompt(questions);

  // 根据选择的框架设置固定配置
  return {
    ...answers,
    language: 'typescript',  // 统一使用 TypeScript
    bundler: 'vite',         // 统一使用 Vite
    cssFramework: 'tailwind' // 统一使用 Tailwind
  };
}

export default prompt;