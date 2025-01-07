# <%= projectName %>

这个项目使用 [<%= framework === 'react' ? 'React' : 'Vue' %>] 构建，采用 <%= language === 'typescript' ? 'TypeScript' : 'JavaScript' %> 开发。

## 技术栈

- <%= framework === 'react' ? 'React' : 'Vue' %> <%= framework === 'react' ? '18' : '3' %>
- <%= language === 'typescript' ? 'TypeScript' : 'JavaScript' %>
- <%= cssFramework.charAt(0).toUpperCase() + cssFramework.slice(1) %>
- <%= bundler === 'vite' ? 'Vite' : 'Webpack' %>

## 开始使用

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

## 项目结构
src/
├── components/ # 组件目录
├── assets/ # 静态资源
├── styles/ # 样式文件
└── <%= framework === 'react' ? 'App.jsx' : 'App.vue' %> # 根组件


## 开发指南

1. 组件开发请遵循组件目录结构规范
2. 样式文件使用 <%= cssFramework %> 进行开发
3. 确保代码经过 ESLint 检查

## 构建和部署

项目使用 <%= bundler === 'vite' ? 'Vite' : 'Webpack' %> 进行构建，构建产物将输出到 \`dist\` 目录。

## License

MIT
EOL

# .gitignore 模板
```config
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
dist
build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

# .env 模板
```config
VITE_APP_TITLE=<%= projectName %>
```

# babel.config.js (用于 Webpack)
```js
module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-<%= framework %>', { runtime: 'automatic' }],
    <% if (language === 'typescript') { %>
    '@babel/preset-typescript',
    <% } %>
  ],
}
```

# postcss.config.js (用于 Tailwind)
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

# 创建基础组件目录结构
```bash
mkdir -p src/templates/react/base/src/{components,assets,styles}
mkdir -p src/templates/vue/base/src/{components,assets,styles}
```

# React 示例组件
```js
import React from 'react'

function Header() {
  return (
    <header>
      <h1><%= projectName %></h1>
    </header>
  )
}

export default Header
```

# Vue 示例组件
```vue
<template>
  <header>
    <h1><%= projectName %></h1>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>
```