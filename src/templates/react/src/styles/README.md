# 样式系统文档

## 📁 目录结构

```
src/styles/
├── index.css           # 主入口文件
├── base.css           # 基础样式和重置
├── theme.css          # 主题系统 (CSS 变量)
├── components.css     # 组件样式类
└── utilities/         # 工具类目录
    ├── transitions.css    # 原子化过渡动画
    ├── animations.css     # 预定义动画
    └── responsive.css     # 响应式工具类
```

## 🎨 设计系统特点

### 1. **模块化架构**
- **职责分离**: 每个文件负责特定功能
- **按需导入**: 可以选择性导入需要的模块
- **易于维护**: 清晰的文件组织便于团队协作

### 2. **主题系统**
```css
/* 支持多主题切换 */
:root { /* 默认浅色主题 */ }
[data-theme='dark'] { /* 深色主题 */ }
```

### 3. **原子化工具类**
```css
/* 细粒度的过渡控制 */
.transition-transform-fast  /* transform 150ms */
.transition-bg             /* background 300ms */
.transition-colors         /* 多属性过渡 */
```

## 🚀 使用指南

### 基础组件样式

```tsx
// 卡片组件
<div className="card">
  <h2 className="text-heading-2">标题</h2>
  <p className="text-body">内容</p>
</div>

// 响应式卡片
<div className="card-responsive">
  自适应内容
</div>
```

### 按钮系统

```tsx
// 基础按钮
<button className="btn-primary btn-md">主要按钮</button>
<button className="btn-outline btn-sm">次要按钮</button>

// 状态按钮
<button className="btn-success">成功</button>
<button className="btn-warning">警告</button>
<button className="btn-error">错误</button>
```

### 过渡动画

```tsx
// 基础过渡
<div className="transition-colors hover:bg-primary-50">
  颜色过渡
</div>

// 组合过渡
<div className="transition-all hover:scale-105 hover:shadow-medium">
  综合效果
</div>

// 自定义缓动
<div className="transition-transform duration-300 ease-bounce">
  弹跳效果
</div>
```

### 响应式设计

```tsx
// 响应式容器
<div className="container-responsive">
  <div className="grid-responsive-1 gap-responsive-md">
    {items.map(item => (
      <div key={item.id} className="card-responsive">
        {item.content}
      </div>
    ))}
  </div>
</div>

// 响应式显示/隐藏
<div className="show-mobile">移动端显示</div>
<div className="show-desktop">桌面端显示</div>
```

### 动画效果

```tsx
// 入场动画
<div className="animate-fade-in-up">淡入向上</div>
<div className="animate-slide-in-left animate-delay-200">延迟滑入</div>

// 交互动画
<button className="hover:animate-wiggle">摇摆按钮</button>
<div className="animate-pulse-soft">脉冲效果</div>
```

### 主题切换

```tsx
// JavaScript 主题切换
function toggleTheme() {
  const html = document.documentElement
  const currentTheme = html.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  html.setAttribute('data-theme', newTheme)
}

// 使用主题变量的组件
<div style={{
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  borderColor: 'var(--border-primary)'
}}>
  主题适配内容
</div>
```

## 🛠️ 自定义扩展

### 1. 添加新的组件样式

```css
/* src/styles/components.css */
@layer components {
  .my-custom-component {
    @apply bg-white rounded-lg p-4 shadow-soft;
    /* 自定义样式 */
  }
}
```

### 2. 添加新的工具类

```css
/* src/styles/utilities/custom.css */
.my-utility-class {
  /* 自定义工具类 */
}
```

### 3. 扩展主题变量

```css
/* src/styles/theme.css */
:root {
  --my-custom-color: #ff6b6b;
  --my-custom-spacing: 2.5rem;
}
```

### 4. 添加新的动画

```css
/* src/styles/utilities/animations.css */
@keyframes myAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.animate-my-animation {
  animation: myAnimation 1s ease-in-out infinite;
}
```

## 📱 响应式断点

```css
/* 断点定义 */
xs: 475px   /* 超小屏幕 */
sm: 640px   /* 小屏幕 */
md: 768px   /* 中等屏幕 */
lg: 1024px  /* 大屏幕 */
xl: 1280px  /* 超大屏幕 */
2xl: 1536px /* 2K 屏幕 */
3xl: 1600px /* 自定义超大屏 */
```

## 🎯 最佳实践

### 1. **优先级原则**
```css
/* 推荐顺序 */
1. Tailwind 原生类
2. 自定义组件类
3. 工具类
4. 响应式修饰符
```

### 2. **性能优化**
- 使用 `transition-*` 类而不是 `transition-all`
- 优先使用 `transform` 和 `opacity` 动画
- 合理使用 `will-change` 属性

### 3. **可维护性**
- 保持类名语义化
- 使用组件类封装复用样式
- 避免内联样式，优先使用工具类

### 4. **可访问性**
- 支持 `prefers-reduced-motion`
- 支持 `prefers-contrast: high`
- 提供足够的颜色对比度

## 🔄 与 styles-compare 的对比

| 特性 | 当前方案 | styles-compare |
|------|----------|----------------|
| **组织方式** | 模块化 + Tailwind | 纯模块化 |
| **主题系统** | CSS 变量 + Tailwind | 纯 CSS 变量 |
| **原子化** | 高度原子化 | 高度原子化 |
| **响应式** | Tailwind + 自定义 | 自定义组件 |
| **维护性** | 优秀 | 优秀 |
| **学习成本** | 中等 | 较高 |
| **生态兼容** | 完全兼容 Tailwind | 独立生态 |

## 📝 总结

这套样式系统结合了两种方案的优势：
- **保留 Tailwind 的便利性**和生态兼容性
- **借鉴 styles-compare 的模块化**和原子化思想
- **提供完整的主题系统**和响应式支持
- **确保高度的可定制性**和扩展性

适合作为现代 React 项目的样式基础架构！