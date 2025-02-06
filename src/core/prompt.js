import inquirer from 'inquirer';

async function prompt() {
  const questions = [
    {
      type: 'list',
      name: 'framework',
      message: '选择框架:',
      choices: [
        { key: '1', name: '1. React', value: 'react' },
        { key: '2', name: '2. Vue 3', value: 'vue' }
      ]
    }
  ];

  const { framework } = await inquirer.prompt(questions);

  const followUpQuestions = [
    {
      type: 'list',
      name: 'language',
      message: '选择开发语言:',
      choices: [
        { key: '1', name: '1. JavaScript', value: 'javascript' },
        { key: '2', name: '2. TypeScript', value: 'typescript' }
      ]
    },
    {
      type: 'list',
      name: 'bundler',
      message: '选择构建工具:',
      choices: [
        { key: '1', name: '1. Vite', value: 'vite' },
        { key: '2', name: '2. Webpack', value: 'webpack' }
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

  const answers = await inquirer.prompt(followUpQuestions);
  return {
    framework,
    ...answers,
    cssFramework: 'tailwind' // 只保留 Tailwind
  };
}

export default prompt;