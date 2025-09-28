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

// 已弃用：依赖信息现在直接在模板的 package.json 中定义
export function getDependencies(options) {
  // 为了保持向后兼容性，保留此函数但返回空数组
  console.warn('getDependencies is deprecated. Dependencies are now defined in template package.json files.');
  return {
    dependencies: [],
    devDependencies: []
  };
}