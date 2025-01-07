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
  const { framework, language, cssFramework, bundler } = options;

  // 基础依赖
  const dependencies = {
    react: {
      dependencies: ['react', 'react-dom'],
      devDependencies: [
        // 添加 React 相关的 Babel 预设
        '@babel/preset-react',
        '@babel/preset-env'
      ]
    },
    vue: {
      dependencies: ['vue'],
      devDependencies: ['@vitejs/plugin-vue']
    }
  };

  // 语言相关依赖
  const languageDeps = {
    typescript: {
      dependencies: [],
      devDependencies: [
        'typescript',
        '@types/node',
        framework === 'react' ? '@types/react' : ''
      ].filter(Boolean)
    }
  };

  // CSS相关依赖
  const cssDeps = {
    sass: {
      dependencies: [],
      devDependencies: ['sass']
    },
    less: {
      dependencies: [],
      devDependencies: ['less']
    },
    tailwind: {
      dependencies: [],
      devDependencies: [
        'tailwindcss',
        'postcss',
        'autoprefixer',
        'postcss-loader'
      ]
    }
  };

  // 构建工具相关依赖
  const bundlerDeps = {
    webpack: {
      dependencies: [],
      devDependencies: [
        'webpack',
        'webpack-cli',
        'webpack-dev-server',
        'html-webpack-plugin',
        'babel-loader',
        '@babel/core',
        '@babel/preset-env',
        'css-loader',
        'style-loader',
        'postcss-loader',
        'serve'
      ]
    },
    vite: {
      dependencies: [],
      devDependencies: [
        'vite',
        framework === 'react' ? '@vitejs/plugin-react' : '@vitejs/plugin-vue'
      ]
    }
  };

  // 合并所有依赖
  const result = {
    dependencies: [
      ...dependencies[framework].dependencies,
      ...(languageDeps[language]?.dependencies || []),
      ...(cssDeps[cssFramework]?.dependencies || []),
      ...(bundlerDeps[bundler]?.dependencies || [])
    ],
    devDependencies: [
      ...dependencies[framework].devDependencies,
      ...(languageDeps[language]?.devDependencies || []),
      ...(cssDeps[cssFramework]?.devDependencies || []),
      ...(bundlerDeps[bundler]?.devDependencies || [])
    ]
  };

  return result;
}