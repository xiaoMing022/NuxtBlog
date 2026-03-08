---
title: package.json
date:  2026/3/8
description: 理解Node.js项目的核心配置文件
image: /blogs-img/blog1.jpg
alt: How to use package.json
ogImage: /blogs-img/blog1.jpg
tags: ['工程', 'Node']
published: true
---

# package.json

`package.json` 是 **Node.js / 前端工程的“项目说明书 + 依赖契约 + 脚本入口”**，主要承担 5 类职责：

1. **项目元信息**（是谁、做什么）
2. **依赖声明**（我依赖谁、依赖什么版本）
3. **脚本编排**（如何启动、构建、测试）
4. **模块发布规则**（别人怎么用我）
5. **工程 / 工具配置入口**

------

## 1. 基础元信息字段

```json
{
  "name": "my-project",
  "version": "1.2.3",
  "description": "A frontend project",
  "private": true
}
```

### 1️⃣ `name`

- **包名**
- npm 全局唯一
- 规则：
  - 小写
  - 不能有空格
  - 可以用 `-`

📌 工程实践：

- 库项目：`@scope/package-name`
- 应用项目：一般无所谓，但**会影响构建产物和日志**

------

### 2️⃣ `version`

- 语义化版本号（SemVer）

```
MAJOR.MINOR.PATCH
```

| 版本  | 含义             |
| ----- | ---------------- |
| MAJOR | 破坏性变更       |
| MINOR | 向下兼容的新功能 |
| PATCH | bug 修复         |

📌 npm 会基于它做依赖解析

------

### 3️⃣ `description`

- 说明性字段
- 对 npm 搜索、文档有用

------

### 4️⃣ `private`

```json
"private": true
```

**非常重要**

- 防止 `npm publish` 误发布
- 应用型项目必须设为 `true`

------

## 2. 依赖相关

### 1️⃣ `dependencies`

```json
"dependencies": {
  "react": "^18.2.0",
  "axios": "^1.6.0"
}
```

📌 **运行时依赖**

- 打包后会进入产物
- 业务代码 `import` 的东西

------

### 2️⃣ `devDependencies`

```json
"devDependencies": {
  "vite": "^5.0.0",
  "typescript": "^5.3.0"
}
```

📌 **开发 / 构建依赖**

- 只在开发、CI 中使用
- 不会进入最终 bundle（理论上）

------

### 3️⃣ `peerDependencies`（进阶）

```json
"peerDependencies": {
  "react": ">=17"
}
```

📌 **“我不带这个，但你必须有”**

常见于：

- 组件库
- 插件
- 框架扩展

📌 典型例子：

```txt
你的组件库 + 用户的 react 必须是同一个实例
```

------

### 4️⃣ `optionalDependencies`

```json
"optionalDependencies": {
  "fsevents": "^2.3.3"
}
```

- 安装失败不会中断
- 常用于平台相关依赖（macOS）

------

### 5️⃣ 版本号符号规则

| 写法     | 含义                    |
| -------- | ----------------------- |
| `^1.2.3` | 允许 minor / patch 更新 |
| `~1.2.3` | 只允许 patch            |
| `1.2.3`  | 精确版本                |
| `*`      | 任意版本（极不推荐）    |

📌 工程建议：

- 应用：`^`
- 库：谨慎使用 `^`

------

## 3. 脚本系统

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "test": "jest"
}
```

### 1️⃣ `scripts`

- npm/yarn/pnpm 的**命令入口**
- 本质是 shell 脚本

```bash
npm run dev
pnpm build
```

------

### 2️⃣ 脚本特性

**✔ 自动注入 `node_modules/.bin`**

```json
"build": "vite build"
```

即使你没全局安装 vite，也能运行

------

**✔ 脚本串联**

```json
"build": "npm run lint && npm run test && vite build"
```

------

**✔ 生命周期脚本**

```json
"prepare": "husky install"
"prebuild": ""
"postbuild": ""
```

📌 常见用途：

- git hooks
- 自动生成文件

------

## 4. 模块入口 & 发布相关

### 1️⃣ `main`

```json
"main": "dist/index.js"
```

- CommonJS 入口
- Node 默认读取

------

### 2️⃣ `module`

```json
"module": "dist/index.esm.js"
```

- ES Module 入口
- bundler 优先使用（tree-shaking）

------

### 3️⃣ `types`

```json
"types": "dist/index.d.ts"
```

- TypeScript 类型声明入口

------

### 4️⃣ `exports`（现代标准，**非常重要**）

```json
"exports": {
  ".": {
    "import": "./dist/index.esm.js",
    "require": "./dist/index.cjs.js",
    "types": "./dist/index.d.ts"
  }
}
```

📌 优点：

- 精准控制暴露 API
- 防止深层路径访问
- 支持条件导出

------

### 5️⃣ `files`

```json
"files": [
  "dist",
  "README.md"
]
```

- 控制发布到 npm 的文件

files所包含的的文件才会被发布到包当中，被引用

------

## 5. 运行环境约束

### 1️⃣ `engines`

```json
"engines": {
  "node": ">=18",
  "pnpm": ">=8"
}
```

📌 CI / 团队协作非常重要

------

### 2️⃣ `os` / `cpu`

```json
"os": ["darwin", "linux"]
```

------

## 6. 工程工具配置入口

`package.json` 也是**配置聚合点**

### 常见配置字段：

```json
"eslintConfig": {}
"prettier": {}
"jest": {}
"lint-staged": {}
"browserslist": {}
```

📌 什么时候放这里？

- 配置较小
- 不想拆文件

📌 什么时候不用？

- 配置复杂（推荐独立文件）

------

## 7. 依赖锁定与包管理器

### 1️⃣ `packageManager`

```json
"packageManager": "pnpm@9.1.0"
```

📌 明确团队使用的包管理器

------

### 2️⃣ lock 文件（不在 package.json 中，但强相关）

| 管理器 | lock              |
| ------ | ----------------- |
| npm    | package-lock.json |
| yarn   | yarn.lock         |
| pnpm   | pnpm-lock.yaml    |

📌 **一定要提交**

------

## 九、真实项目中的推荐结构（示例）

```json
{
  "name": "@org/web-console",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18"
  }
}
```

