import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';

export async function renderTemplate(templatePath, targetPath, options) {
  const stats = await fs.stat(templatePath);

  if (stats.isDirectory()) {
    // 如果是目录，递归处理
    await fs.ensureDir(targetPath);
    const files = await fs.readdir(templatePath);
    for (const file of files) {
      await renderTemplate(
        path.join(templatePath, file),
        path.join(targetPath, file),
        options
      );
    }
  } else {
    // 如果是文件，处理模板
    const content = await fs.readFile(templatePath, 'utf-8');
    const templateData = {
      projectName: options.projectName,
      framework: options.framework,
      language: options.language,
      cssFramework: options.cssFramework,
      bundler: options.bundler,
      ...options
    };

    const result = await ejs.render(content, templateData, { async: true });
    await fs.writeFile(targetPath, result);
  }
}

export function getDependencies(options) {
  const { framework, language, bundler } = options;

  // 基础依赖
  const dependencies = {
    react: ['react', 'react-dom'],
    vue: ['vue']
  }[framework];

  // 构建工具相关依赖
  const bundlerDeps = {
    webpack: [
      'webpack',
      'webpack-cli',
      'webpack-dev-server',
      'html-webpack-plugin',
      'babel-loader',
      '@babel/core',
      '@babel/preset-env',
      ...(framework === 'react' ? ['@babel/preset-react'] : []),
      'css-loader',
      'style-loader',
      'postcss-loader'
    ],
    vite: [
      'vite',
      framework === 'react' ? '@vitejs/plugin-react' : '@vitejs/plugin-vue'
    ]
  }[bundler];

  const devDependencies = [
    // 构建工具依赖
    ...bundlerDeps,

    // Tailwind 相关
    'tailwindcss',
    'postcss',
    'autoprefixer',

    // TypeScript 相关(如果选择了 TypeScript)
    ...(language === 'typescript'
      ? [
        'typescript',
        '@types/node',
        ...(framework === 'react' ? ['@types/react', '@types/react-dom'] : [])
      ]
      : []
    )
  ];

  return {
    dependencies,
    devDependencies
  };
}