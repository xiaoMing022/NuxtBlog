---
title: 前端
date:  2025/10/13
description: 前端八股总结
image: /blogs-img/web.png
alt: JS&&VUE&REACT
ogImage: /blogs-img/web.png
tags: ['web','Vue','React','JavaScript']
published: true
---

# 前端

## 一、JS相关

### 闭包

1. **什么是闭包？**

**闭包（Closure）** 是指： **函数 + 它能够访问的词法作用域** 形成的整体。

换句话说，当一个函数被定义时，它会“记住”自己所在的作用域，即使这个函数在作用域外执行，它依然能访问当初作用域中的变量。

2. **为什么会有闭包？**

在 JavaScript（还有 Python 等语言）中，作用域是**词法作用域（Lexical Scope）**，也就是函数在**定义时**决定了能访问哪些变量，而不是在**调用时**决定。

闭包就是这种机制的自然结果：
 即使外层函数执行结束，它的变量本应被销毁，但只要有内部函数“引用”了这些变量，那么它们就会被保留下来。

3. **一个例子**

```
function makeCounter() {
  let count = 0; // 外层函数的局部变量

  return function() {
    count++;
    return count;
  };
}

const counter1 = makeCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter1()); // 3
```

这里发生了什么？

- `makeCounter()` 执行后，按理说它的局部变量 `count` 应该消失。
- 但 `return` 出去的匿名函数引用了 `count`，所以 `count` 被保留了。
- 每次调用 `counter1()`，都能访问并修改同一个 `count`。
   👉 这就是 **闭包**。

4. 闭包的常见用途

- **数据封装**
   隐藏内部变量，只暴露需要的接口。

```
function createUser(name) {
  let password = "secret"; // 私有变量
  return {
    getName: () => name,
    checkPassword: (pwd) => pwd === password
  };
}
```

- **函数工厂**
   根据传入参数生成不同的函数。

```
function multiplier(factor) {
  return function(x) {
    return x * factor;
  };
}

const double = multiplier(2);
console.log(double(5)); // 10
```

- **回调 / 异步操作**
   在定时器、事件监听器中保持对外部变量的访问。

5. 注意点

- **内存泄漏风险**
   如果闭包引用了很大的对象，就会阻止垃圾回收。

- **调试难度**
   变量“消失又存在”，有时不容易追踪。

- **性能问题**
   太多闭包可能导致额外的内存开销。

****



### 原型链

![image-20250924124212366](C:\Users\AKA小周\AppData\Roaming\Typora\typora-user-images\image-20250924124212366.png)

****

### Promise

`Promise` 是一种用于 **处理异步操作** 的对象，能让你更优雅地写出异步代码，避免「回调地狱」。

- 它有三种状态：
  - `pending`（进行中）
  - `fulfilled`（已成功）
  - `rejected`（已失败）

状态一旦从 `pending` 变为 `fulfilled` 或 `rejected` 就不可再改变。

**创建与使用 Promise **

```
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("操作成功！");
  } else {
    reject("操作失败！");
  }
});

myPromise
  .then(result => {
    console.log(result); // 操作成功！
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log("无论成功失败都会执行");
  });
```

**要点：**

- `resolve()` 表示成功
- `reject()` 表示失败
- `.then()` 处理成功结果
- `.catch()` 处理失败结果
- `.finally()` 总会执行

- ** Promise 链式调用 **

```
new Promise((resolve) => {
  resolve(1);
})
.then(num => {
  console.log(num); // 1
  return num + 1;
})
.then(num => {
  console.log(num); // 2
});
```

- 每个 `.then()` 返回的值会传给下一个 `.then()`
- 如果抛出错误，会被最近的 `.catch()` 捕获

- **Promise 组合使用 **

**并行执行多个异步任务：**

```
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);

Promise.all([p1, p2])
  .then(values => {
    console.log(values); // [1, 2]
  });
```

常见方法：

- `Promise.all([ ... ])`：全部成功才算成功
- `Promise.race([ ... ])`：第一个完成的决定结果
- `Promise.allSettled([ ... ])`：等全部结束，不管成功失败
- `Promise.any([ ... ])`：第一个成功的就返回

五、配合 async / await 使用

```
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("开始");
  await delay(1000);
  console.log("1秒后执行");
}

run();
```

- `async` 声明异步函数
- `await` 等待 `Promise` 结果，像同步代码一样写异步逻辑
- 更加直观可读

****

### this

#### call apply bind

1. 共同点

- `call`、`apply`、`bind` 都是 **函数对象的方法**。
- 它们的作用都是：
   **改变函数调用时的 this 指向**，并能传递参数。

👉 换句话说：谁来调用不重要，你可以强行指定 `this`。

2. call

语法：

```
func.call(thisArg, arg1, arg2, ...)
```

- 立即执行函数。
- 参数从第 2 个开始，逐个传入。

例子：

```
function greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}
const person = { name: "Liu" };

greet.call(person, "Hello", "!"); 
// "Hello, Liu!"
```

3. apply

语法：

```
func.apply(thisArg, [argsArray])
```

- 立即执行函数。
- 参数必须打包成数组传入。

例子：

```
greet.apply(person, ["Hi", "!!"]); 
// "Hi, Liu!!"
```

👉 **区别 call 和 apply**：参数传递方式不同。

- `call`: 单个参数依次传递
- `apply`: 数组传递

4. bind

语法：

```
const boundFunc = func.bind(thisArg, arg1, arg2, ...)
```

- **不会立即执行**，而是返回一个新函数。
- 新函数的 `this` 永远绑定到指定对象。

例子：

```
const boundGreet = greet.bind(person, "Hey");
boundGreet("?"); 
// "Hey, Liu?"
```

5. 使用场景对比

   1. **借用方法**

      ```
      const arr = [1, 2, 3];
      console.log(Math.max.apply(null, arr)); // 3
      ```

      👉 用 `apply` 把数组当作参数传入。

   2. **函数绑定**

   ```
   const button = {
     text: "Click me",
     click() {
       console.log(this.text);
     }
   };
   
   setTimeout(button.click.bind(button), 1000); 
   // 确保 this 还是 button
   ```

   3. **继承构造函数属性**

   ```
   function Parent(name) {
     this.name = name;
   }
   function Child(name, age) {
     Parent.call(this, name); // 借用 Parent 构造函数
     this.age = age;
   }
   ```

6. 总结口诀

- **call**：改 this，参数一个个传，立即执行。
- **apply**：改 this，参数打包数组，立即执行。
- **bind**：改 this，返回新函数，之后再执行。

****

### 事件中心

```javascript
class EventEmitter {
  constructor() {
    // 存储事件: { eventName: [callback1, callback2, ...] }
    this.events = {};
  }

  /**
   * 注册订阅者（事件监听）
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    console.log(`✅ 监听事件: ${event}`);
  }

  /**
   * 注册一次性订阅者（触发一次后销毁）
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  once(event, callback) {
    const onceWrapper = (...args) => {
      callback(...args);          // 执行原回调
      this.off(event, onceWrapper); // 取消订阅
    };
    this.on(event, onceWrapper);
  }

  /**
   * 取消订阅
   * @param {string} event - 事件名称
   * @param {Function} callback - 要移除的回调
   */
  off(event, callback) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(cb => cb !== callback);
    console.log(`❌ 取消事件监听: ${event}`);
  }

  /**
   * 触发事件（发布）
   * @param {string} event - 事件名称
   * @param  {...any} args - 传递给回调的参数
   */
  emit(event, ...args) {
    if (this.events[event]) {
      console.log(`📢 触发事件: ${event}, 参数:`, args);
      this.events[event].forEach(callback => callback(...args));
    }
  }
}

// ================== 使用示例 ==================

const bus = new EventEmitter();

function greet(name) {
  console.log("👋 你好,", name);
}

function onlyOnce(msg) {
  console.log("⚡ 只执行一次:", msg);
}

// 订阅事件
bus.on("sayHello", greet);

// 订阅一次性事件
bus.once("init", onlyOnce);

// 触发事件
bus.emit("sayHello", "Alice");
bus.emit("sayHello", "Bob");

// 一次性事件
bus.emit("init", "第一次调用");
bus.emit("init", "第二次调用（不会触发）");

// 取消订阅
bus.off("sayHello", greet);

// 再次触发（不会执行）
bus.emit("sayHello", "Charlie");
```

```ts
class AdvancedEventCenter {
    constructor() {
        // 保存事件名 -> 回调数组
        // 每个元素: { callback, once, priority }
        this.events = {};
    }

    // 普通订阅
    subscribe(eventName, callback, { priority = 0 } = {}) {
        if (!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push({ callback, once: false, priority });

        // 按优先级排序，数字越大越先执行
        this.events[eventName].sort((a, b) => b.priority - a.priority);

        // 返回取消订阅函数
        return () => this.unsubscribe(eventName, callback);
    }

    // 一次性订阅
    once(eventName, callback, { priority = 0 } = {}) {
        if (!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push({ callback, once: true, priority });
        this.events[eventName].sort((a, b) => b.priority - a.priority);
    }

    // 取消订阅
    unsubscribe(eventName, callback) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(item => item.callback !== callback);
    }

    // 发布事件（支持异步回调）
    async publish(eventName, data) {
        if (!this.events[eventName]) return;

        const callbacks = [...this.events[eventName]]; // 拷贝，避免回调中修改数组

        for (const item of callbacks) {
            try {
                await item.callback(data); // 支持 async/await
            } catch (err) {
                console.error(`Event "${eventName}" callback error:`, err);
            }

            if (item.once) {
                this.unsubscribe(eventName, item.callback);
            }
        }
    }
}


```

### 防抖节流

**🔹 1. 防抖（Debounce）**

**定义**

- 在 **事件触发后，延迟一段时间再执行回调**
- 如果在这段时间内事件再次触发，则重新计时
- 典型场景：**输入搜索、自动保存**

> 简单理解：**事件触发频繁，但只在最后一次触发后执行回调**

**示意图**

```
事件触发:  |---|---|---|---->
防抖延迟:  -----------[执行一次]
```

- 多次事件触发，只执行最后一次

**JS 实现示例**

```js
/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的回调函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 返回一个新的函数，事件触发时调用
 *
 * 思路：
 * 1. 每次事件触发时，清除之前的定时器
 * 2. 重新设置定时器，延迟执行回调
 * 3. 只有最后一次触发事件后，回调才会执行
 */
function debounce(fn, delay = 300) {
    let timer; // 保存定时器 ID

    return function(...args) {
        const context = this; // 保存调用时的 this

        // 如果上一次定时器存在，清除它
        if (timer) clearTimeout(timer);

        // 重新设置定时器
        timer = setTimeout(() => {
            fn.apply(context, args); // 延迟执行回调
        }, delay);
    };
}

// 使用示例
const debouncedFn = debounce(() => {
    console.log('防抖触发', new Date().toLocaleTimeString());
}, 1000);

// document.querySelector('#input').addEventListener('input', debouncedFn);

```

****



**🔹 2. 节流（Throttle）**

**定义**

- 保证 **固定时间间隔只执行一次回调**
- 即使事件不断触发，也会按照时间间隔执行
- 典型场景：**滚动加载、鼠标拖动、按钮防多次点击**

> 简单理解：**事件触发频繁，但回调按照固定频率执行**

**示意图**

```
事件触发:  |---|---|---|---->
节流执行:  [执行]-X-X-[执行]-X-[执行]
```

- 每隔固定时间执行一次，不管事件触发多少

**JS 实现示例**

```js
/**
 * 节流函数
 * @param {Function} fn - 需要节流的回调函数
 * @param {number} interval - 时间间隔（毫秒）
 * @returns {Function} 返回一个新的函数，事件触发时调用
 *
 * 思路：
 * 1. 记录上一次回调执行的时间
 * 2. 每次事件触发时，判断距离上一次执行是否超过间隔
 * 3. 超过间隔就执行回调，并更新上一次执行时间
 */
function throttle(fn, interval = 300) {
    let lastTime = 0; // 保存上一次执行时间

    return function(...args) {
        const context = this;
        const now = Date.now();

        if (now - lastTime >= interval) {
            fn.apply(context, args); // 执行回调
            lastTime = now; // 更新上一次执行时间
        }
    };
}

// 使用示例
const throttledFn = throttle(() => {
    console.log('节流触发', new Date().toLocaleTimeString());
}, 2000);

// window.addEventListener('scroll', throttledFn);

```

****



**🔹 3. 防抖 vs 节流**

| 特性     | 防抖 (Debounce)          | 节流 (Throttle)          |
| -------- | ------------------------ | ------------------------ |
| 执行时机 | 最后一次触发后延迟执行   | 固定间隔执行一次         |
| 触发频率 | 事件连续触发，不执行回调 | 时间间隔到达才执行       |
| 典型场景 | 输入框实时搜索、自动保存 | 滚动、拖拽、按钮点击限制 |
| 优点     | 减少无用调用             | 平滑处理高频事件         |
| 缺点     | 触发延迟                 | 不保证最后一次触发回调   |

****



## 二、Vue相关

### 插槽

## 三、React相关

## 四、性能优化方案

### 1. 总述

#### 1.1 资源加载优化

**目标：减少首屏加载时间，加快页面展示。**

**(1) 代码层面**

- **代码分割**：通过 `Webpack` / `Vite` 的 `dynamic import` 按需加载路由或组件，避免一次性加载全部代码。
- **Tree Shaking**：清除未使用的代码。
- **压缩与混淆**：对 `JS/CSS/HTML` 进行压缩（如 `terser`、`cssnano`）。
- **Polyfill 按需引入**：通过 `core-js`、`babel-preset-env` 仅针对目标浏览器注入需要的 polyfill。

**(2) 资源层面**

- **静态资源压缩**：使用 gzip、brotli 压缩。
- **图片优化**：
  - 使用 WebP、AVIF 替代 JPG/PNG。
  - 按需加载不同尺寸（响应式图片 `srcset`）。
  - 使用雪碧图（减少请求数量）。
- **字体优化**：
  - 使用 `font-display: swap` 避免字体阻塞渲染。
  - 子集化字体文件（仅保留项目所需字符）。

**(3)网络层面**

- **CDN 加速**：将静态资源托管至 CDN。

- **HTTP 缓存**：

  - 强缓存：`Cache-Control: max-age`、`Expires`。
  - 协商缓存：`ETag`、`Last-Modified`。

- **DNS 预解析 / 预连接**：

  ```
  <link rel="dns-prefetch" href="//cdn.example.com">
  <link rel="preconnect" href="//cdn.example.com">
  ```

#### 1.2 渲染性能优化

**目标：减少页面卡顿，保证流畅体验。**

**(1)减少重排与重绘**

- 避免频繁修改 DOM 样式，合并多次操作。
- 使用 `class` 切换代替逐个样式设置。
- 避免使用 `table` 进行布局。
- 使用 `transform/opacity` 代替 `top/left` 来实现动画。

(2)**合理使用 CSS**

- 避免过度复杂的选择器。
- 使用 GPU 加速动画属性（`transform: translateZ(0)`）。
- 避免大面积使用 `box-shadow`、`filter`。

(3)**虚拟列表 / 分片渲染**

- 对长列表使用虚拟滚动（如 `react-window`、`vue-virtual-scroller`）。
- 使用 `requestIdleCallback` / `setTimeout` 分批渲染大量 DOM。

#### 1.3 脚本执行优化

**目标：降低 JS 阻塞，提高交互速度。**

**(1)异步加载 JS**

- `<script src="xxx.js" defer>`：延迟执行，按顺序。
- `<script src="xxx.js" async>`：异步执行，不保证顺序。

(2)**减少主线程压力**

- 将计算密集任务放入 `Web Worker`。
- 使用 `OffscreenCanvas` 处理复杂绘图。

(3)**事件节流与防抖**

- 避免滚动、窗口缩放时频繁触发事件。

#### 1.4 构建与部署优化

**目标：构建产物更轻，部署加载更快。**

1. **SSR / SSG**
   - 服务端渲染（SSR，Nuxt/Next.js）或预渲染（SSG），减少首屏白屏时间。
2. **懒加载与预加载**
   - **懒加载**：路由级、组件级、图片懒加载。
   - **预加载**：关键资源（字体、首屏脚本）使用 `<link rel="preload">`。
3. **Bundle 优化**
   - 使用 CDN external（Vue、React、lodash 等大库外链）。
   - 按需引入 UI 库组件（如 `babel-plugin-import`、`unplugin-vue-components`）。

#### 1.5 运行时体验优化

**目标：让用户感知“快”。**

1. **骨架屏 / Loading 占位**
   - 首屏请求慢时，展示骨架屏或加载动画，减少心理等待。
2. **懒加载图片 / 组件**
   - 滚动到可视区域时再加载。
3. **PWA**
   - 利用 Service Worker 离线缓存，提高二次访问速度。

#### 1.6 监控与分析

**目标：持续优化，发现瓶颈。**

1. **性能指标监控**
   - 常见核心指标：
     - **FCP**（First Contentful Paint，首屏渲染时间）
     - **LCP**（Largest Contentful Paint，最大内容渲染时间）
     - **FID**（First Input Delay，首次交互延迟）
     - **CLS**（Cumulative Layout Shift，布局稳定性）
2. **工具**
   - `Lighthouse`、`WebPageTest`、`Chrome Performance` 分析。
   - 接入前端监控平台（如 Sentry、阿里 ARMS）。

#### 总结一下：

- **加载阶段** → 代码分割、压缩、缓存、CDN。
- **渲染阶段** → 减少重绘、虚拟列表、GPU 动画。
- **交互阶段** → 防抖节流、Web Worker。
- **部署阶段** → SSR/SSG、懒加载、预加载。
- **运行时体验** → 骨架屏、PWA。
- **持续优化** → 性能监控、指标追踪。

****



### LightHouse

**Lighthouse** 是 Google 提供的一个 **开源自动化网站质量评估工具**，主要用来检查网页在 **性能、可访问性、SEO、渐进式 Web 应用（PWA）** 等方面的质量。可以把它理解为一个 **前端性能体检工具**，帮你发现网站的瓶颈和优化建议。Lighthouse 的特点：

- **覆盖面广**：检查性能、可访问性、SEO、最佳实践、PWA。
- **自动化**：不用手动点点点，它会跑一套测试流程。
- **集成方便**：可以在 Chrome DevTools、命令行、CI/CD 中使用。
- **直观结果**：生成一个带有 **分数 + 详细建议** 的报告。

**Lighthouse 可以检查什么？**

1. **性能（Performance）**
   - 页面加载速度（首屏时间、JS 执行时间、图片加载等）
   - 核心 Web Vitals（FCP、LCP、FID、CLS）
   - 资源大小、缓存策略、是否压缩
2. **可访问性（Accessibility）**
   - 图片是否有 `alt` 标签
   - 对比度是否足够
   - 表单是否可被屏幕阅读器识别
3. **最佳实践（Best Practices）**
   - 是否使用 HTTPS
   - 是否避免使用过时的 API
   - 是否安全（无混合内容）
4. **SEO**
   - 是否有 `<title>`、`meta description`
   - 是否移动端友好
   - 是否可被搜索引擎索引
5. **PWA（渐进式 Web 应用）**
   - 是否支持离线访问
   - 是否有 manifest.json
   - 是否支持安装到桌面

**🚀 使用方式**

1. **在 Chrome DevTools 中**

   - 打开网页 → 按 `F12` → 切到 `Lighthouse` 面板 → 点击 `Generate report`。
   - 会生成一个打分报告（满分 100）。

2. **命令行**

   ```bash
   npx lighthouse https://example.com --view
   ```

   会生成一个 HTML 报告。

3. **CI/CD 集成**

   - 可以在 GitHub Actions、Jenkins 中跑，确保上线前性能不过关的版本不会被发布。

### 2. 资源加载优化

#### 2.1 代码分割

动态 `import()` 是 **代码分割**（Code Splitting）和 **懒加载**（Lazy Loading）的核心方式。下面我分别给你演示 **Webpack（Vue-Router / React-Router）** 和 **Vite** 下的具体用法。

**1️⃣ Vue 3 + Vite + Vue Router 动态 import 按需加载路由**

假设我们有几个页面：

- `Home.vue`
- `About.vue`
- `Dashboard.vue`

👉 **路由配置：**

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// 使用动态 import 按需加载组件
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue') // 懒加载
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue') // 懒加载
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue') // 懒加载
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

**⚡ 效果：**

- 首次进入 `/` 只会下载 `Home.vue` 的代码块。
- 访问 `/about` 时才会去加载 `About.vue`。
- 打包后会生成多个 `.js` 文件（`about.xxx.js`、`dashboard.xxx.js`）。

****

**2️⃣ React + Webpack / Vite + React Router 动态 import**

假设我们有同样的三个页面：

- `Home.tsx`
- `About.tsx`
- `Dashboard.tsx`

👉 **路由配置（React Router v6 示例）：**

```react
// App.tsx
import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// 使用 React.lazy + dynamic import
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <Router>
      {/* Suspense 作为懒加载的占位符 */}
      <Suspense fallback={<div>加载中...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
```

⚡ 效果：

- React 会把 `Home`、`About`、`Dashboard` 分割成单独的 chunk。
- 访问 `/about` 时才会发起请求加载 `about.xxx.js`。

****

**3️⃣ 动态 import 组件（非路由）**

有时候我们只想在**某个功能被触发时再加载组件**，比如点击按钮时才加载一个图表组件。

👉 **Vue 示例：**

```vue
<template>
  <div>
    <button @click="showChart = true">加载图表</button>
    <Suspense>
      <template #default>
        <Chart v-if="showChart" />
      </template>
      <template #fallback>
        <div>图表加载中...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const showChart = ref(false)

// 按需加载组件
const Chart = defineAsyncComponent(() => import('@/components/Chart.vue'))
</script>
```

👉 **React 示例：**

```react
import { lazy, Suspense, useState } from 'react'

const Chart = lazy(() => import('./components/Chart'))

function Dashboard() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button onClick={() => setShowChart(true)}>加载图表</button>
      <Suspense fallback={<div>图表加载中...</div>}>
        {showChart && <Chart />}
      </Suspense>
    </div>
  )
}

export default Dashboard
```

------

✅ **总结：**

- 在 **路由层面**：动态 import 让每个页面独立打包，减少首屏体积。
- 在 **组件层面**：只在需要时加载（比如模态框、图表），避免一次性把所有功能塞进首屏。

#### 2.2 TreeShaking清除未使用代码

**Tree Shaking**（摇树优化）就是在打包时**自动移除未使用的代码**，减少最终产物体积。
 它主要针对 **ES Module (ESM)** 的 `import/export` 语法，因为这种语法是 **静态结构**，能在编译阶段确定依赖关系。

**🌲 Tree Shaking 的核心条件**

1. **必须使用 ESM (`import` / `export`)**
   - ✅ `import { foo } from './utils'`
   - ❌ `const utils = require('./utils')` （CommonJS 不支持 Tree Shaking）
2. **打包工具支持 Tree Shaking**
   - Webpack（生产模式默认启用）
   - Vite（基于 Rollup，默认启用）
3. **代码没有副作用**
   - 如果一个模块只是定义函数 / 变量但没有额外逻辑，未被使用的部分会被移除。
   - 如果模块有副作用（比如修改全局变量），需要配置 `sideEffects: false` 来告诉打包工具可以安全移除。

****

**1️⃣ Webpack 中使用 Tree Shaking**

`package.json` 配置

```
{
  "name": "demo",
  "sideEffects": false,
  "scripts": {
    "build": "webpack --mode production"
  }
}
```

👉 `sideEffects: false` 表示项目中所有模块都**没有副作用**，可以安全地进行 Tree Shaking。
 如果某些文件必须保留（比如样式文件），可以这样写：

```
"sideEffects": ["*.css"]
```

**示例**

```
// utils.js
export function add(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}
// main.js
import { add } from './utils'

console.log(add(2, 3))
```

👉 打包结果里 **`multiply` 函数会被移除**，因为没有用到。

****

**2️⃣ Vite / Rollup 中使用 Tree Shaking**

Vite 基于 Rollup，默认就支持 Tree Shaking，不需要额外配置。

**示例**

```
// math.ts
export const sum = (a: number, b: number) => a + b
export const sub = (a: number, b: number) => a - b
// main.ts
import { sum } from './math'

console.log(sum(1, 2))
```

👉 打包结果里只会保留 `sum`，`sub` 会被删除。

****

**3️⃣ 验证 Tree Shaking 是否生效**

你可以通过以下方式确认：

1. 打包后看输出文件，未使用的函数是否还在。
2. 用 **Webpack Bundle Analyzer** 或 **rollup-plugin-visualizer** 查看产物体积和依赖图。

```
# Webpack 安装分析工具
npm install webpack-bundle-analyzer --save-dev
// webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  plugins: [new BundleAnalyzerPlugin()]
}
```

然后运行 `npm run build`，就能看到未用代码是否被剔除了。

------

✅ **总结**：

- 用 **ESM 模块** (`import/export`)
- 配置 `sideEffects: false`
- 在 **生产模式** 打包（Webpack / Vite 默认 Tree Shaking）
- 用分析工具验证

****



#### 2.3 压缩和混淆

- 🚀 减小文件体积，加快传输速度
- 🔒 增加代码安全性（混淆后更难反向工程）
- 📦 配合 gzip/brotli 等压缩，进一步优化

****

**1️⃣ JavaScript 压缩与混淆**

常见工具

- **Terser** 👉 目前最常用的 JS 压缩器，Webpack / Vite 默认使用它。
- **UglifyJS** 👉 早期流行，但对 ES6+ 支持不佳，基本被 Terser 替代。

主要功能

1. **压缩 (Minification)**

   - 删除空格、换行、注释
   - 删除无用的代码（Tree Shaking 已经做了一部分，这里会再做 DCE — Dead Code Elimination）
   - 缩短变量名、函数名
   - 合并声明

   ```js
   // 原始
   function add(a, b) {
     return a + b;
   }
   console.log(add(1, 2));
   ```

   ```js
   // 压缩后
   function add(n,d){return n+d}console.log(add(1,2));
   ```

2. **混淆 (Obfuscation)**

   - 将变量、函数名替换为随机短名称（如 `a`, `b`, `_0xabc123`）
   - 提高代码反编译难度（但不是安全手段，仍能被还原）

   ```js
   // 混淆后
   function _0x1a2b(_0x3c4d,_0x5e6f){return _0x3c4d+_0x5e6f}console['log'](_0x1a2b(1,2));
   ```

**在 Vite/Webpack 中使用**

- **Vite**（内置 Terser/ESBuild，默认开启压缩）

  ```js
  // vite.config.js
  export default defineConfig({
    build: {
      minify: 'terser', // 也可以 'esbuild'（更快）
      terserOptions: {
        compress: {
          drop_console: true, // 移除 console.log
          drop_debugger: true
        }
      }
    }
  })
  ```

- **Webpack**

  ```js
  // webpack.config.js
  const TerserPlugin = require('terser-webpack-plugin');
  
  module.exports = {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: true }
          }
        })
      ]
    }
  };
  ```

****

**2️⃣ CSS 压缩**

**常见工具**

- **cssnano** 👉 基于 PostCSS 的 CSS 压缩工具（最常用）。
- **clean-css** 👉 也可用，但 cssnano 生态更好。

**主要优化点**

- 删除注释、空格、换行
- 合并重复选择器和声明
- 优化 `0px` → `0`，`#ffffff` → `#fff`
- 合并相同媒体查询

```css
/* 原始 */
body {
  margin: 0px;
  color: #ffffff;
}
h1 {
  font-size: 24px;
}
/* 压缩后 */
body{margin:0;color:#fff}h1{font-size:24px}
```

**在 Vite 中使用**

```js
npm install cssnano postcss --save-dev
// postcss.config.js
module.exports = {
  plugins: {
    cssnano: {
      preset: 'default',
    },
  },
};
```

**3️⃣ HTML 压缩**

**常见工具**

- **html-minifier-terser** 👉 处理 HTML 压缩的常用工具。

**压缩点**

- 删除空格、换行
- 删除 HTML 注释
- 压缩内联 JS / CSS
- 移除不必要的属性（如 `<input type="text">` → `<input>`）

```
<!-- 原始 -->
<!DOCTYPE html>
<html>
  <head>
    <title> Demo </title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
<!-- 压缩后 -->
<!DOCTYPE html><html><head><title>Demo</title></head><body><h1>Hello World</h1></body></html>
```

**Vite 插件**

```
npm install vite-plugin-html --save-dev
```

或者更常用：

```
npm install vite-plugin-html-minify --save-dev
```

配置：

```
import { defineConfig } from 'vite'
import htmlMinify from 'vite-plugin-html-minify'

export default defineConfig({
  plugins: [
    htmlMinify({
      collapseWhitespace: true,
      removeComments: true,
    }),
  ],
})
```

**4️⃣ 总结**

| 文件类型 | 工具                 | 作用                           |
| -------- | -------------------- | ------------------------------ |
| JS       | Terser / ESBuild     | 压缩、删除无用代码、混淆变量名 |
| CSS      | cssnano              | 删除注释/空格、合并声明        |
| HTML     | html-minifier-terser | 删除空格、注释、压缩内联资源   |

📦 **最佳实践**：

- Vite/Webpack 默认就会压缩 JS（生产模式）
- CSS 推荐用 `cssnano`（通过 PostCSS）
- HTML 可额外加插件 `vite-plugin-html-minify`

****



#### 2.4 图片资源优化

**1️⃣ 按需加载不同尺寸图片（响应式图片 `srcset`）**

**📌 背景**

- 传统 `<img src="xxx.png">`：无论用户是 1920px 屏幕还是 375px 屏幕，都会下载同一张图片。
- 问题：小屏幕设备（比如手机）也要加载大图，**浪费带宽**。

**📌 解决方案 —— `srcset` + `sizes`**

HTML5 提供了 `srcset` 和 `sizes` 属性，让浏览器根据 **屏幕宽度 / 分辨率** 自动选择最合适的图片。

```
<img 
  src="images/photo-800.jpg"  <!-- 默认图 -->
  srcset="
    images/photo-400.jpg 400w,
    images/photo-800.jpg 800w,
    images/photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  alt="风景图">
```

**📌 工作原理**

- `srcset`：列出图片文件及其宽度（单位 `w`）
- `sizes`：定义在不同条件下，浏览器需要的图片显示宽度
- 浏览器会自动选择最合适的图片下载

👉 **示例**：

- 如果屏幕宽度 ≤ 600px → 加载 `photo-400.jpg`
- 如果 ≤ 1200px → 加载 `photo-800.jpg`
- 如果 > 1200px → 加载 `photo-1200.jpg`

**📌 适用场景**

- 响应式布局的网站
- 电商/博客等大量图片的站点（节省流量）
- 支持 **Retina 高清屏优化**：可以根据像素比（`2x`, `3x`）提供不同清晰度图片

```
<img 
  src="images/icon@1x.png"
  srcset="images/icon@1x.png 1x, images/icon@2x.png 2x"
  alt="icon">
```

****



**2️⃣ 使用雪碧图（CSS Sprites）**

**📌 背景**

- 早期网页很多小图标（按钮、菜单、icon），每个图片都要发起一次 HTTP 请求。
- 请求过多 → **白屏时间长**。

**📌 解决方案 —— 雪碧图**

把多个小图标合成一张大图（Sprite），再通过 **CSS 背景定位** 来显示其中某个部分。

👉 **雪碧图示意图**（sprite.png 包含三个图标）：

```
.icon {
  background-image: url('sprite.png');
  background-repeat: no-repeat;
  display: inline-block;
  width: 32px;
  height: 32px;
}

.icon-home {
  background-position: 0 0;      /* 第1个图标 */
}

.icon-user {
  background-position: -32px 0;  /* 第2个图标 */
}

.icon-settings {
  background-position: -64px 0;  /* 第3个图标 */
}
<span class="icon icon-home"></span>
<span class="icon icon-user"></span>
<span class="icon icon-settings"></span>
```

📌 优点

- **减少 HTTP 请求数**（尤其在 HTTP/1.1 时代非常重要）
- 所有图标只需下载一次
- 浏览器缓存雪碧图后，页面切换速度更快

📌 缺点

- 修改某个小图标，需要重新生成整个雪碧图
- 不适合太大或太多的图（否则维护复杂）

**3️⃣ 总结对比**

| 优化方式              | 解决问题                 | 优点                               | 缺点                 |
| --------------------- | ------------------------ | ---------------------------------- | -------------------- |
| **响应式图片 srcset** | 不同设备加载不同尺寸图片 | 节省流量，移动端体验好，支持高清屏 | 需要多张图片资源     |
| **雪碧图 (Sprite)**   | 减少小图标请求数量       | 请求少、缓存好                     | 维护麻烦，不适合大图 |

------

💡 **最佳实践**：

- **大图 / 产品图 / Banner** → 用 `srcset`（自适应加载）
- **小图标** → 现代项目更多用 **iconfont / SVG sprite / Icon 组件库**（比传统雪碧图更灵活）

****



#### 2.5 静态资源压缩

1. **什么是 Gzip / Brotli 压缩？**

想象一下，你有一个很大的文本文件需要通过网络发送给朋友。直接发送会很慢。于是你先用压缩软件（如 WinRAR, 7-Zip）将它压缩成一个 `.zip` 或 `.rar` 文件，体积变小了很多，然后再发送。朋友收到后，解压缩就能看到原始内容。Gzip 和 Brotli 就是应用在 Web 传输领域的“压缩软件”。它们是两种高效的数据压缩算法，专门用来在服务器端对 **文本类资源**（如 HTML, CSS, JavaScript, JSON, SVG 等）进行“实时压缩”，然后传输给浏览器。浏览器接收到这些被压缩过的文件后，会自动进行“实时解压”，并渲染出页面内容。

**整个过程对用户是完全透明的，用户无需任何操作，但却能感受到网站加载速度的显著提升。**

2. **为什么它如此重要？**

前端项目中的 HTML、CSS 和 JavaScript 文件本质上都是文本文件。这些文件内部存在大量的重复字符串和相似模式（例如，CSS 中反复出现的 `color: #333;`，HTML 中重复的标签 `<div>` 等）。压缩算法正是利用了这些重复性，用更短的符号来表示这些重复内容，从而大幅度减小文件的体积。

**带来的核心好处：**

- **减少传输体积：** Gzip 通常能将文本文件压缩到其原始大小的 **30%** 左右，而 Brotli 的效果更佳，可以达到 **20%-25%**。这意味着原本需要传输 100KB 的 JS 文件，压缩后可能只需要 25KB。
- **加快加载速度：** 文件体积变小，通过网络传输的时间就越短。这直接减少了页面的“白屏”时间，提升了 LCP (Largest Contentful Paint) 等关键性能指标。
- **节省带宽成本：** 对于网站运营者来说，用户请求所消耗的总流量减少了，从而节省了服务器的带宽费用。

| 特性             | Gzip                     | Brotli                               |
| ---------------- | ------------------------ | ------------------------------------ |
| **开发者**       | GNU 项目                 | Google                               |
| **压缩率**       | **良好**                 | **更优**（通常比 Gzip 高 15-25%）    |
| **压缩速度**     | **非常快**               | 相对 Gzip 较慢（但可调压缩级别）     |
| **解压速度**     | 快速                     | **非常快**（与 Gzip 相当，甚至更快） |
| **浏览器兼容性** | **几乎所有浏览器都支持** | **所有现代浏览器都支持** (IE 除外)   |
| **使用前提**     | 几乎所有服务器都支持     | **必须通过 HTTPS 连接**              |

**结论：**

- **Brotli 是当前更优的选择。** 它提供了更高的压缩率，并且解压速度很快，不会给浏览器带来额外负担。由于现在几乎所有网站都已采用 HTTPS，所以其使用前提也不是问题。
- **最佳实践是同时启用两者。** 服务器可以配置为优先使用 Brotli。如果浏览器不支持 Brotli（例如非常古老的浏览器），则自动降级使用 Gzip。这样可以做到最大化的兼容和性能优化。

3. 如何在服务器端配置？

配置的核心思想是告诉服务器：当浏览器请求某些类型的文件（如 `text/html`, `text/css`, `application/javascript`）时，请先对这些文件进行压缩，然后在 HTTP 响应头中加入 `Content-Encoding: gzip` 或 `Content-Encoding: br` 标识，再发给浏览器。Nginx 的配置非常直观。通常在 `nginx.conf` 文件的 `http`、`server` 或 `location` 块中添加以下指令：

Nginx 配置示例

```yaml

    server_name your.domain.com; # 替换成你的域名
    root /var/www/my-vue-app; # 项目的根目录，也就是 dist 文件夹所在的位置

    index index.html; # 默认入口文件

    # 路由配置 (重要！用于处理 Vue Router 的 history 模式)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # -------------------- 压缩配置开始 --------------------

    # 1. 启用 Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6; # 压缩级别，6 是性能和效果的平衡点
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # 2. 启用 Brotli (推荐，效果更好)
    # 注意：这需要你的 Nginx 编译时包含了 ngx_brotli 模块
    brotli on;
    brotli_comp_level 6; # Brotli 的压缩级别，推荐 5 或 6
    brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # -------------------- 压缩配置结束 --------------------

    # 其他配置，例如缓存控制
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}

配置解释：
# root /var/www/my-vue-app;：告诉 Nginx 你的网站文件在哪里。

# location / { ... }：这是针对 Vue Router history 模式的关键配置。它确保了当用户刷新一个非根路径（如 your.domain.com/about）的页面时，Nginx 仍然会返回 index.html，让 Vue Router 来接管路由。

# gzip on; / brotli on;: 这是开启压缩功能的开关。

# gzip_types / brotli_types: 定义了哪些类型的文件需要被压缩。我们主要针对文本类文件，如 HTML (默认已包含), CSS, JS, JSON, SVG 等。图片（如 JPG, PNG）因为本身已经是压缩格式，再用 Gzip 压缩效果不大，反而会浪费 CPU 资源，所以不包含它们。

```

**推荐实践 (Nginx):**

由于 `ngx_brotli` 模块可以和 `gzip` 模块共存，Nginx 会根据浏览器发送的 `Accept-Encoding` 请求头（例如 `Accept-Encoding: br, gzip`）来智能地决定返回哪种压缩格式（优先 Brotli）。所以，**同时开启两者是最佳选择**。

**如何验证是否生效？**

验证配置是否成功非常简单，使用浏览器的开发者工具即可：

1. 打开你的网站。
2. 按下 `F12` 打开开发者工具，切换到 **"Network" (网络)** 面板。
3. 刷新页面，找到一个类型为 JS, CSS 或 HTML 的请求。
4. 点击这个请求，在右侧的 **"Headers" (标头)** 面板中，查看 **"Response Headers" (响应标头)**。
5. 如果你看到 `Content-Encoding: br` 或 `Content-Encoding: gzip`，那么恭喜你，压缩已经成功生效了！

****



### 3. 渲染性能优化

#### 3.1 减少重排 (Reflow) 与重绘 (Repaint)

首先，我们需要理解浏览器是如何将代码变成我们看到的像素的。这个过程大致分为三步：

1. **Layout (布局/重排):** 浏览器计算 DOM 元素在屏幕上确切的大小和位置。
2. **Paint (绘制/重绘):** 浏览器将元素的视觉样式（如颜色、背景、边框）绘制到屏幕的位图上。
3. **Composite (合成):** 浏览器将多个绘制好的图层（Layers）按照正确的顺序合并，最终显示在屏幕上。

**重排 (Reflow)** 是最昂贵的操作，因为它会改变元素的几何属性，导致浏览器需要重新执行 Layout 步骤，这通常也会触发后续的 Paint。**重绘 (Repaint)** 开销稍小，因为它只改变外观而不影响布局，所以只需要执行 Paint 步骤。我们的目标就是尽可能避免，尤其是避免频繁地触发重排。

**方案详解：**

- **避免频繁修改 DOM 样式，合并多次操作**

  - **原理：** 当你用 JavaScript 修改一个元素的样式时，每修改一次，都可能触发一次重排。如果在一个循环中连续修改，就会导致页面性能急剧下降，这种现象被称为“布局抖动” (Layout Thrashing)。

  - **反面教材：**

    JavaScript

    ```
    const box = document.getElementById('box');
    for (let i = 0; i < 10; i++) {
        box.style.left = (box.offsetLeft + 10) + 'px'; // 读写交替，性能杀手
        box.style.top = (box.offsetTop + 10) + 'px';
    }
    ```

  - **推荐做法 (合并操作):** 将所有样式修改汇总，最后一次性应用。

    JavaScript

    ```
    const box = document.getElementById('box');
    let left = box.offsetLeft;
    let top = box.offsetTop;
    for (let i = 0; i < 10; i++) {
        left += 10;
        top += 10;
    }
    box.style.left = left + 'px'; // 只在最后写入一次
    box.style.top = top + 'px';
    ```

- **使用 class 切换代替逐个样式设置**

  - **原理：** 这是“合并操作”思想的最佳实践。与其用 JS 逐个设置 `style.color`, `style.fontSize`, `style.padding`，不如预先在 CSS 中定义一个类，然后用 JS 一次性地切换这个类。这只会触发一次重排/重绘。

  - **示例：**

    CSS

    ```
    /* CSS */
    .box-active {
        background-color: red;
        width: 200px;
        transform: scale(1.2);
    }
    ```

    JavaScript

    ```
    // JavaScript
    const box = document.getElementById('box');
    // 只需一次 DOM 操作，即可应用所有样式
    box.classList.add('box-active');
    ```

- **避免使用 table 进行布局**

  - **原理：** `<table>` 元素的渲染算法非常复杂。表格中任何一个单元格 (cell) 的尺寸变化，都可能导致整个表格需要重新计算布局，引发大规模的重排。在现代网页设计中，应使用 Flexbox 或 Grid 来进行页面布局，它们的渲染模型更高效、更可预测。
  - **注意：** 这条规则指的是**不应用于页面整体布局**。对于展示纯粹的表格数据，使用 `<table>` 标签在语义上是完全正确的。

- **使用 `transform/opacity` 代替 `top/left` 来实现动画**

  - **原理：** 这是渲染优化中最关键的一点。修改 `top`, `left`, `width`, `height` 等属性会改变元素的几何信息，必定触发**重排 (Layout)**。

  - 而修改 `transform` (位移、缩放、旋转) 和 `opacity` (透明度) 属性，在现代浏览器中，通常可以直接进入**合成 (Composite)** 阶段。浏览器会将这个元素提升到一个独立的“合成层”，动画的每一帧都只在这个图层上进行，由 GPU 负责处理，完全绕过了耗时的重排和重绘步骤。这种动画性能极高，非常流畅。

  - **示例：**

    CSS

    ```
    /* 不推荐 ❌: 会触发重排 */
    .box.animate {
        transition: top 0.3s;
        top: 100px;
    }
    
    /* 推荐 ✅: 触发 GPU 加速，只走合成阶段 */
    .box.animate {
        transition: transform 0.3s;
        transform: translateY(100px);
    }
    ```

#### 3.2 合理使用 CSS

- **避免过度复杂的选择器**
  - **原理：** 浏览器匹配 CSS 选择器是从右到左的。例如 `div.container ul li a`，浏览器会先找到页面上所有的 `<a>` 标签，然后逐一向上查找它的父元素是否是 `<li>`，再向上找 `<ul>`... 这个过程在 DOM 结构复杂时会变得很慢。
  - **推荐做法：** 保持选择器简洁，层级不宜过深。使用 BEM 这样的命名规范可以帮助你创建扁平且具体的选择器，如 `.nav__link`，匹配效率非常高。
- **使用 GPU 加速动画属性 (`transform: translateZ(0)`)**
  - **原理：** 这是一个“小技巧”，其本质是手动触发“合成层”的创建。当你为一个元素设置了 `transform: translateZ(0)` 或 `will-change: transform` 时，你等于在告诉浏览器：“这个元素即将有变换动画，请将它提升到一个独立的图层，并交给 GPU 准备”。这样，当动画开始时，因为它已经在自己的图层里，它的变化就不会影响到其他元素，从而获得流畅的性能。
  - **注意：** 不要滥用！创建过多的图层会消耗大量内存，甚至可能适得其反。只对那些确实需要高性能动画且出现卡顿的元素使用。
- **避免大面积使用 `box-shadow`、`filter`**
  - **原理：** 像 `box-shadow`（尤其是带有模糊半径的）和 `filter`（如 `blur()`）这类 CSS 属性在绘制时需要大量的计算。浏览器需要计算阴影或滤镜区域内每一个像素的颜色和透明度。如果应用在一个大面积或正在运动的元素上，会极大地增加每一帧的绘制（Paint）时间，导致卡顿。
  - **推荐做法：**
    - 对静态元素谨慎使用。
    - 对于需要动画的元素，可以考虑用一张带阴影的图片来代替 `box-shadow`，或者将动画元素和它的静态阴影分离到不同层级。

****

#### 3.3  虚拟列表 / 分片渲染

这类优化主要解决当页面需要一次性渲染成千上万个 DOM 元素时的性能瓶颈。

- **虚拟列表 / 虚拟滚动 (Virtual Scrolling)**

  - **目标场景：** 长列表展示，例如社交媒体的信息流、聊天记录、大数据表格等。
  - **原理：** “只渲染你所看到的”。假设你有一个包含 10000 个项目的列表，但用户的屏幕一次只能显示 10 个。虚拟列表技术就不会一次性创建 10000 个 DOM 节点，而是只创建能填满可视区域的约 10-20 个节点。当用户滚动时，它并不会创建新节点，而是**复用**这些已存在的节点，仅仅更新它们的内容和位置，来模拟滚动的效果。
  - **效果：** 无论列表总数据量有多大，页面中实际存在的 DOM 节点数量始终很小，从而在渲染性能和内存占用上获得巨大提升。
  - **实践：** 这项技术实现起来较为复杂，推荐直接使用成熟的社区库，如你提到的 `react-window` (for React) 和 `vue-virtual-scroller` (for Vue)。

**🔹 1. Vue + 第三方库（推荐）**

在 Vue 项目里，你可以用 [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)。

安装

```
npm install vue-virtual-scroller
```

使用示例

```
<template>
  <div class="list-container">
    <!-- VirtualList 组件只渲染可见区域 -->
    <RecycleScroller
      :items="items"
      :item-size="50"
      key-field="id"
      class="scroller"
    >
      <template #default="{ item }">
        <div class="item">
          {{ item.id }} - {{ item.text }}
        </div>
      </template>
    </RecycleScroller>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'

// 假设有 10000 条数据
const items = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    text: `这是第 ${i} 条数据`
  }))
)
</script>

<style>
.scroller {
  height: 400px;   /* 容器高度，超出部分滚动 */
  overflow-y: auto;
}
.item {
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
</style>
```

👉 在这个例子里，即使你有 10,000 条数据，DOM 实际上只渲染 **屏幕可见区域 + 缓冲区**（比如 20 条），随着滚动动态替换。

**🔹 2. 手写一个简易虚拟列表**

如果你想理解原理，可以手写一个简易版：

```
<template>
  <div 
    class="list-container" 
    ref="container"
    @scroll="onScroll"
  >
    <!-- 总高度撑开滚动条 -->
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <!-- 渲染可见区的数据 -->
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="item"
        :style="{ 
          position: 'absolute', 
          top: item.index * itemHeight + 'px' 
        }"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const itemHeight = 50
const containerHeight = 400
const buffer = 5 // 缓冲区数量

const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  index: i,
  text: `这是第 ${i} 条数据`
}))

const totalHeight = items.length * itemHeight
const scrollTop = ref(0)

const visibleCount = Math.ceil(containerHeight / itemHeight) + buffer
const startIndex = computed(() => Math.floor(scrollTop.value / itemHeight))
const endIndex = computed(() => startIndex.value + visibleCount)

const visibleItems = computed(() => 
  items.slice(startIndex.value, endIndex.value)
)

function onScroll(e) {
  scrollTop.value = e.target.scrollTop
}
</script>

<style>
.list-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
}
.item {
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}
</style>
```

**👉 原理：**

1. 用一个大容器撑开滚动条（总高度 = `数据条数 * itemHeight`）。
2. 计算当前滚动位置，确定该渲染的数据区间。
3. 只渲染可见区 + 缓冲区的数据，并用 `position: absolute` 定位到正确位置。

✅ **总结：**

- 长列表用虚拟滚动是必须的优化，否则 DOM 数量太大会卡顿。
- 实际开发推荐用 `vue-virtual-scroller` 这样的库，简单可靠。
- 想理解底层，可以尝试手写实现。

****

- **分片渲染 (Chunked Rendering)**

  - **目标场景：** 首次渲染时需要创建大量 DOM 节点，但这些节点并非列表形式，且不需要立即全部展示。

  - **原理：** JavaScript 是单线程的。如果你有一个任务需要执行 500ms（例如，循环创建 10000 个 DOM 节点并插入页面），那么在这 500ms 内，浏览器主线程会被完全阻塞，无法响应任何用户输入（点击、滚动等），页面会完全卡死。

  - 分片渲染的思想就是**化整为零**，将这个 500ms 的大任务，切分成 50 个 10ms 的小任务。每执行完一个小任务，就把控制权交还给浏览器，让它有机会处理其他事情，然后再继续下一个小任务。

  - **实践：**

    - **`setTimeout`:** 最简单的方式。`setTimeout(() => { renderNextChunk() }, 0)` 可以将任务推入宏任务队列的末尾，达到“喘口气”的效果。
    - **`requestIdleCallback` (推荐):** 一个更智能的 API。它允许你注册一个函数，这个函数会在浏览器主线程处于**空闲状态**时才被调用。这非常适合执行那些不紧急的、后台的任务，因为它完全不会影响到用户的交互和动画等高优先级任务。

  - **`requestIdleCallback` 示例：**

    JavaScript

    ```
    const tasks = [/* 很多渲染任务 */];
    let currentTaskIndex = 0;
    
    function renderChunk(deadline) {
        // deadline.timeRemaining() 可以获取当前帧剩余的空闲时间
        while (deadline.timeRemaining() > 0 && tasks[currentTaskIndex]) {
            // 执行一个渲染任务
            render(tasks[currentTaskIndex]);
            currentTaskIndex++;
        }
    
        // 如果还有任务没完成，预约下一次空闲时继续
        if (tasks[currentTaskIndex]) {
            requestIdleCallback(renderChunk);
        }
    }
    
    // 启动任务
    requestIdleCallback(renderChunk);
    ```

## 五、场景相关

### 1. 登录方案

#### 1.1 **基于 Cookie 的 Session 方案**

- **流程**：
  1. 用户在登录页面提交账号和密码。
  2. 后端验证成功后，生成一个 `Session` 并存储在服务器端（如 Redis、内存、数据库）。
  3. 后端通过 `Set-Cookie` 响应头，把 `SessionID` 写入浏览器的 Cookie。
  4. 之后每次请求浏览器都会自动带上 Cookie，后端根据 `SessionID` 查找并验证用户。
- **优点**：
  - 安全性高（只要 Cookie 配置 `HttpOnly`，避免 JS 窃取）。
  - Session 可以灵活存储更多信息。
- **缺点**：
  - 需要服务端保存状态（不利于分布式扩展，需要 Session 共享）。
  - 移动端 App 不好用，因为没有浏览器自动带 Cookie 的机制。

#### 1.2 **基于 Token 的方案（JWT、OAuth2 等）**

- **流程**：
  1. 用户登录后，后端生成一个 Token（最常见是 JWT）。
  2. 前端保存 Token（常用 `localStorage`、`sessionStorage`、或 Cookie）。
  3. 每次请求时，前端手动在请求头中带上 `Authorization: Bearer <token>`。
  4. 后端通过校验 Token 来识别用户身份。
- **优点**：
  - 无状态，后端不需要保存 Session，适合分布式架构。
  - Token 可携带用户信息（如用户 ID、角色）。
  - 移动端和前端都能统一使用。
- **缺点**：
  - 一旦 Token 被窃取，在过期前都能被滥用。
  - 无法主动失效（除非后端引入黑名单机制）。

**JWT（JSON Web Token）**

JWT 是最常见的 Token 格式，它是一个 **自包含（self-contained）** 的字符串，里面直接包含用户信息。

1. JWT 的结构

一个 JWT 分成三部分，用点 `.` 分隔：

```
Header.Payload.Signature
```

- **Header**：说明加密算法、类型（如 `HS256`）。
- **Payload**：存储用户信息（如 `userId: 123`）、过期时间等。
- **Signature**：前两部分+密钥做哈希，保证不能被篡改。

例子（简化后的 JWT）：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. 
eyJ1c2VySWQiOjEyMywiZXhwIjoxNzAwMDAwMDB9. 
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

2. JWT 流程

- 登录成功 → 后端签发 JWT → 前端保存。
- 请求接口 → 前端在 `Authorization` 头里带上 JWT。
- 后端解密并验证签名 → 确认用户身份。

3. 优缺点

✅ 优点：

- 无状态，后端不用存 Session。
- Token 自包含，扩展性好，适合分布式/微服务。
- 前后端、App、小程序都能统一使用。

❌ 缺点：

- Token 一旦泄露，在过期前都能被使用。
- 无法主动失效（需要额外黑名单机制）。
- Token 越大，请求头也越大（因为每次都要带）。

**Node.js + Express + jsonwebtoken举个例子**

**后端部分**

```js
// 安装依赖：npm install express jsonwebtoken body-parser
//后端部分
import express from "express";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// 定义一个密钥（实际生产中要放到环境变量）
const SECRET_KEY = "my_secret_key";

// 登录接口
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 假设账号 admin / 密码 123456 才是正确的
  if (username === "admin" && password === "123456") {
    // 生成一个 Token，有效期 1 小时
    const token = jwt.sign({ userId: 1, username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "账号或密码错误" });
  }
});

// 一个需要验证身份的接口
app.get("/profile", (req, res) => {
  // 从请求头里获取 Token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer xxx

  if (!token) return res.status(401).json({ message: "未提供 Token" });

  // 验证 Token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token 无效或过期" });

    // user 是解码后的数据（即 sign 时传入的 payload）
    res.json({ message: "个人信息", user });
  });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
```

**🛠️ 前端部分**

```js
// 登录函数
async function login() {
  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "123456" })
  });

  const data = await res.json();
  if (res.ok) {
    // 保存 Token（演示用 localStorage，生产推荐 HttpOnly Cookie）
    localStorage.setItem("token", data.token);
    console.log("登录成功，Token：", data.token);
  } else {
    console.error(data.message);
  }
}

// 获取个人信息
async function getProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/profile", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}` // 携带 Token
    }
  });

  const data = await res.json();
  console.log("个人信息：", data);
}
```

**📌 流程总结**

1. 前端调用 `login()` → 服务器返回一个 JWT：

   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. 
   eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAzNjAwMH0. 
   xxx签名部分xxx
   ```

2. 前端保存 JWT（localStorage / sessionStorage / Cookie）。

3. 之后调用 `getProfile()`，在请求头里加：

   ```
   Authorization: Bearer <JWT>
   ```

4. 后端通过 `jwt.verify()` 校验签名 + 过期时间 → 确认用户身份。

#### 1.3. **单点登录（SSO，Single Sign-On）**

- **适用场景**：企业内部多个系统、统一认证中心。

- **流程**：
  1. 用户访问某个系统，如果未登录会被重定向到统一认证中心。
  2. 认证中心验证用户并生成票据（如 Token 或 Ticket）。
  3. 用户带着票据回到业务系统，业务系统验证票据并放行。
  
- **常见实现**：
  - **CAS 协议**、**OAuth2.0**、**SAML** 等。
  
- **优点**：
  - 多系统统一登录，用户体验好。
  
- **缺点**：
  - 架构复杂，需要额外的认证服务。
  
  **⚙️ 常见的 SSO 实现方案**
  
  1. **基于 Cookie + Session 的同域名共享**
  
  - **适用场景**：子系统都在同一个主域名下，比如：
    - `oa.company.com`
    - `mail.company.com`
    - `wiki.company.com`
  - **原理**：设置 Cookie 的 Domain 为 `.company.com`，这样所有子域名都能共享这个 Cookie（即 SessionID）。
  - **优点**：实现简单。
  - **缺点**：仅限于同一主域名下的系统，不适合跨域。
  
   **基于 Cookie + Session 的同域名共享 SSO 实现方案**，这个方式比较适合公司内部的 **同一主域名的子系统**（比如 `oa.company.com`、`mail.company.com`、`wiki.company.com`）。
  
  ****
  
  **🖥️ 实现思路**
  
  1. 有一个统一的 **认证中心**（`sso.company.com`），负责登录。
  2. 用户在认证中心登录成功后，**设置一个跨子域的 Cookie**：
     - `Domain=.company.com`
     - `SESSIONID=xxxxxx`
  3. 浏览器访问任意子系统时，都会自动携带这个 Cookie。
  4. 各个子系统拿到 `SESSIONID` → 去认证中心校验用户信息。
  
  **🛠️ 示例代码**
  
  这里用 Node.js + Express 来演示：
  
  1. SSO 登录中心（`sso.company.com`）
  
  ```js
  import express from "express";
  import session from "express-session";
  
  const app = express();
  
  // 配置 session
  app.use(session({
    secret: "sso_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: ".company.com",  // 关键：设置成主域名
      httpOnly: true
    }
  }));
  
  // 模拟登录接口
  app.get("/login", (req, res) => {
    // 假设账号密码验证通过
    req.session.user = { id: 1, name: "Alice" };
    res.send("登录成功，Session 已写入跨域 Cookie");
  });
  
  // 提供校验用户信息的接口
  app.get("/validate", (req, res) => {
    if (req.session.user) {
      res.json({ loggedIn: true, user: req.session.user });
    } else {
      res.json({ loggedIn: false });
    }
  });
  
  app.listen(3000, () => console.log("SSO 登录中心运行在 http://sso.company.com:3000"));
  ```
  
  2. 子系统（`oa.company.com`）
  
  ```
  import express from "express";
  import session from "express-session";
  import fetch from "node-fetch";
  
  const app = express();
  
  // 这里同样要配置 session，并且 domain 必须和 SSO 保持一致
  app.use(session({
    secret: "oa_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: ".company.com",
      httpOnly: true
    }
  }));
  
  // 子系统首页
  app.get("/", async (req, res) => {
    // 去认证中心校验 Session
    const result = await fetch("http://sso.company.com:3000/validate", {
      headers: { cookie: req.headers.cookie }
    });
    const data = await result.json();
  
    if (data.loggedIn) {
      res.send(`<h2>欢迎 ${data.user.name} 来到 OA 系统</h2>`);
    } else {
      res.redirect("http://sso.company.com:3000/login");
    }
  });
  
  app.listen(4000, () => console.log("OA 系统运行在 http://oa.company.com:4000"));
  ```
  
  **📌 流程演示**
  
  1. 用户访问 `oa.company.com:4000`。
  
  2. 系统发现没有登录 → 重定向到 `sso.company.com:3000/login`。
  
  3. 用户登录成功 → `sso.company.com` 设置 Cookie：
  
     ```
     Set-Cookie: SESSIONID=xxxx; Domain=.company.com; HttpOnly
     ```
  
     这样 `oa.company.com` 也能访问到。
  
  4. 用户回到 `oa.company.com` → 请求时自动携带 `SESSIONID`。
  
  5. 子系统调用 `sso.company.com/validate` → 确认用户已登录 → 放行。
  
  **✅ 优缺点**
  
  - **优点**：
    - 简单，依赖浏览器自动带 Cookie。
    - 不需要复杂的 Token 交换。
  - **缺点**：
    - 仅支持同一主域名下的系统。
    - 不能支持跨公司、跨域的 SSO。
  
  2. **基于 Token（JWT）+ 网关校验**
  
  - **适用场景**：前后端分离、跨域系统、移动端和 Web 混合环境。
  - **原理**：
    1. 用户在 SSO 登录中心输入账号密码。
    2. 登录中心签发一个 Token（JWT）。
    3. 用户访问任一系统时，携带这个 Token（放在 Cookie 或 HTTP Header）。
    4. 各个子系统验证 Token 的合法性（解密签名或请求认证中心验证）。
  - **优点**：支持跨域，移动端也能用。
  - **缺点**：Token 一旦泄露，在有效期内可能被滥用。
  
  3. **基于 OAuth2 / OpenID Connect**
  
  - **适用场景**：第三方登录、企业内部统一认证、跨组织系统。
  - **原理**：
    - 用户访问子系统 → 重定向到 **统一认证中心（Identity Provider, IdP）**。
    - 用户在认证中心完成登录。
    - 认证中心生成一个授权码（Authorization Code）。
    - 子系统拿授权码去认证中心换取 Token（Access Token / ID Token）。
    - 子系统用 Token 获取用户信息并完成登录。
  - **典型应用**：
    - 使用 Google / GitHub 登录一个网站
    - 企业内部用 Keycloak、Auth0、Azure AD 做 SSO
  - **优点**：安全标准化，扩展性强，支持多端、跨域。
  - **缺点**：实现复杂，需要额外的认证服务器。
  
  4. **CAS（Central Authentication Service）**
  
  - **适用场景**：常见于传统企业内部系统。
  - **原理**：
    - 用户访问系统 A → 跳转到 CAS 登录中心。
    - 登录成功后，CAS 发一个 **Ticket** 给系统 A。
    - 系统 A 用 Ticket 去 CAS 验证，获取用户信息。
    - 访问系统 B 时，同样流程，CAS 判断已登录，直接发 Ticket。
  - **优点**：成熟、稳定。
  - **缺点**：比 OAuth2 轻量，但跨端支持不如 OAuth2。

#### 1.4 **第三方登录（OAuth2.0 授权）**

- **场景**：用微信、GitHub、Google 等账号登录。
- **流程**：
  1. 用户点击第三方登录按钮，跳转到第三方授权页面。
  2. 用户授权后，第三方返回 `code`。
  3. 后端用 `code` 换取 `access_token`，再获取用户信息。
  4. 系统生成自己的 Token，前端保存并使用。
- **优点**：
  - 用户无需记住新账号密码，直接用第三方账号。
- **缺点**：
  - 依赖外部平台，流程较复杂。

#### 1.5  **短信/邮箱验证码登录**

- **流程**：
  1. 用户输入手机号或邮箱。
  2. 系统发送验证码。
  3. 用户输入验证码，后端验证并颁发 Token。
- **优点**：
  - 无需记密码，安全性高（配合风控）。
- **缺点**：
  - 成本较高（短信/邮件服务）。
  - 如果验证码逻辑不严谨，容易被攻击。

#### 1.6 小结

📌 前端存储 Token 的常见位置

- **localStorage**：持久存储，刷新页面不丢失，但容易被 XSS 窃取。
- **sessionStorage**：页面关闭后失效，安全性稍高。
- **Cookie（配合 HttpOnly + Secure）**：最安全，但需要后端配置跨域策略。

🛡️ 常见安全措施

- **HTTPS**：防止中间人攻击。
- **CSRF 防护**：对 Cookie 方案尤其重要，可以用 CSRF Token 或 SameSite。
- **XSS 防护**：避免存储在 JS 可访问的地方（如 localStorage）。
- **短 Token + 刷新 Token（Refresh Token）机制**：平衡安全性和体验。
