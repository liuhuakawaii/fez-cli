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

  // 根据框架选择动态加载后续问题
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
      name: 'cssFramework',
      message: '选择CSS方案:',
      choices: [
        { key: '1', name: '1. Sass', value: 'sass' },
        { key: '2', name: '2. Less', value: 'less' },
        { key: '3', name: '3. Tailwind CSS', value: 'tailwind' },
        { key: '4', name: '4. 无 CSS 预处理器', value: 'none' }
      ]
    },
    {
      type: 'list',
      name: 'bundler',
      message: '选择构建工具:',
      choices: ({ framework }) => {
        const choices = [
          { key: '1', name: '1. Vite (推荐)', value: 'vite' },
          { key: '2', name: '2. Webpack', value: 'webpack' }
        ];
        return framework === 'vue' ? choices : choices.reverse();
      }
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
    ...answers
  };
}

export default prompt;