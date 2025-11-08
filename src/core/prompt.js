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
      message: '是否立即安装依赖?（优先pnpm）',
      default: true
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