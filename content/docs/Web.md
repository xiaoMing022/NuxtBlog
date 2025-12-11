---
title: 前端
date:  2025/10/13
description: 前端学习手册
image: /blogs-img/web.png
alt: JS&&VUE&REACT
ogImage: /blogs-img/web.png
tags: ['web','Vue','React','JavaScript']
published: true
---
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

```js
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

```js
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

```js
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



### 函数柯里化

**1️⃣ 什么是函数柯里化？**

**函数柯里化**就是把一个**多参数函数**，
 转化成**多个单参数函数**的过程。

简单来说：

> **一个接受多个参数的函数 → 变成一系列每次只接受一个参数的函数。**

📌 例子对比

普通函数：

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
```

柯里化后的函数：

```js
function add(a) {
  return function(b) {
    return a + b;
  }
}

console.log(add(2)(3)); // 5
```

- 原来一次传两个参数 → 现在分两次传，每次一个参数。

- `add(2)` 返回一个函数，等待第二个参数 `b`。

  

2️⃣ 使用箭头函数写柯里化

```
const add = a => b => a + b;

console.log(add(2)(3)); // 5
```

> 箭头函数写法更加简洁，每一层都是一个返回函数。



3️⃣ 多参数函数柯里化

```
const multiply = a => b => c => a * b * c;

console.log(multiply(2)(3)(4)); // 24
```

- 这里函数 `multiply` 一次只能接收一个参数，但可以链式调用。
- 柯里化的好处：**可以灵活复用参数**。



4️⃣ 实际应用场景

**a. 参数复用**

```
const add10 = add(10);
console.log(add10(5)); // 15
console.log(add10(20)); // 30
```

- 先固定一个参数 `10` → 得到一个新的函数 `add10`，可以多次调用。

**b. 函数组合 & 高阶函数**

```
const log = prefix => message => console.log(`${prefix}: ${message}`);

const info = log("INFO");
const warn = log("WARN");

info("This is info"); // INFO: This is info
warn("This is warning"); // WARN: This is warning
```

- 柯里化让我们更容易**封装功能、固定参数**。



5️⃣ 通用柯里化工具函数

```
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args); // 参数足够直接执行
    } else {
      return function(...next) {
        return curried.apply(this, args.concat(next));
      }
    }
  }
}

// 使用
function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
```

- `fn.length` 是函数声明时的参数个数。
- 可以实现**任意函数的柯里化**。
- 支持一次传一个或多个参数，比较灵活。



🔑 总结

- **概念**：把多参数函数 → 变成一系列单参数函数。

- **语法**：

  - 普通函数：

    ```
    function add(a) { return function(b) { return a + b; } }
    ```

  - 箭头函数：

    ```
    const add = a => b => a + b;
    ```

- **优势**：

  1. 参数复用（partial application）
  2. 高阶函数组合
  3. 更灵活、函数式编程风格

----



### 原型链

![原型链](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9afcd1172d340508d25c095b1103fac~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)





****

### Promise

`Promise` 是一种用于 **处理异步操作** 的对象，能让你更优雅地写出异步代码，避免「回调地狱」。

- 它有三种状态：
  - `pending`（进行中）
  - `fulfilled`（已成功）
  - `rejected`（已失败）

状态一旦从 `pending` 变为 `fulfilled` 或 `rejected` 就不可再改变。

**创建与使用 Promise **

```js
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

- **Promise 链式调用 **

```js
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

```js
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

```js
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

```js
func.call(thisArg, arg1, arg2, ...)
```

- 立即执行函数。
- 参数从第 2 个开始，逐个传入。

例子：

```js
function greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}
const person = { name: "Liu" };

greet.call(person, "Hello", "!"); 
// "Hello, Liu!"
```

3. apply

语法：

```js
func.apply(thisArg, [argsArray])
```

- 立即执行函数。
- 参数必须打包成数组传入。

例子：

```js
greet.apply(person, ["Hi", "!!"]); 
// "Hi, Liu!!"
```

👉 **区别 call 和 apply**：参数传递方式不同。

- `call`: 单个参数依次传递
- `apply`: 数组传递

4. bind

语法：

```js
const boundFunc = func.bind(thisArg, arg1, arg2, ...)
```

- **不会立即执行**，而是返回一个新函数。
- 新函数的 `this` 永远绑定到指定对象。

例子：

```js
const boundGreet = greet.bind(person, "Hey");
boundGreet("?"); 
// "Hey, Liu?"
```

5. 使用场景对比

   1. **借用方法**


   ```js
   const arr = [1, 2, 3];
   console.log(Math.max.apply(null, arr)); // 3
   ```

   👉 用 `apply` 把数组当作参数传入。

   1. **函数绑定**

   ```js
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

   ```js
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

### 经典手撕

####  1. 订阅发布

```js
class Bus{
    constrcutor(){
        this.events=[];
    }

    //订阅
    on(event,callback){
        if(!this.events[event])this.events[event]=[];
        this.events[event].push(callback);
    }

    //取消订阅
    off(event,callback){
        if(!this.events[event])return;
        this.events[event].fliter(cb => cb!== callback);
    }

    //发布
    publish(event,...args){
        if(!this.events[event])return;
        this.events[event].forEach( callback =>
                                   callback(...args);
                                   })
	}

	//一次性订阅
	once(event,callback){
        const onceWrap=(...args)=>{
            callback(...args);
            this.off(event, onceWrap); 
        }
        this.on(event,onceWrap)
        
	}

}
```



#### 2. 手写promise

```js
//promise.all
Promise.myAll = function ( promises ) {
  if(!Array.isArray(promises))return reject("传入参数错误")
  if(!promises.length)return resolve([])
  
  let results=[]
  let count=0;
  
  promises.forEach((p,index)=>{
    Promise.resolve(p).then(value=>{
      results[index]=value;
      count++;
      
      if(count===promises.length)resolve(results)
    }).catch(reject)
  })
  
  
}
```





### 浅拷贝和深拷贝

“浅拷贝（shallow copy）”和“深拷贝（deep copy）”是 JavaScript 中非常常见的概念，尤其在处理对象或数组时。

**🧩 一、根本区别**

| 类型       | 拷贝层级             | 结果                                       |
| ---------- | -------------------- | ------------------------------------------ |
| **浅拷贝** | 只拷贝**第一层属性** | 若属性值是对象，依然拷贝**引用**           |
| **深拷贝** | 拷贝**所有层级**     | 完全复制一个新的对象，和原对象**互不影响** |



**🔍 二、举个例子**

```js
const obj1 = {
  name: "Liu",
  info: { age: 25 }
};

// 浅拷贝
const obj2 = { ...obj1 };

// 修改内层对象
obj2.info.age = 30;

console.log(obj1.info.age); // ❗ 输出 30，被影响
```

👉 原因：`info` 是一个对象，被拷贝时只是复制了引用地址（浅拷贝）。



**🧠 三、常见的浅拷贝方式**

| 方法                       | 示例                       | 说明           |
| -------------------------- | -------------------------- | -------------- |
| `Object.assign()`          | `Object.assign({}, obj)`   | 复制第一层属性 |
| 展开运算符 `...`           | `{ ...obj }` 或 `[...arr]` | 同样是浅拷贝   |
| `Array.prototype.slice()`  | `arr.slice()`              | 数组的浅拷贝   |
| `Array.prototype.concat()` | `[].concat(arr)`           | 浅拷贝数组     |



**🌊 四、深拷贝的实现方式**

✅ 1. JSON 方法（最简单）

```js
const obj2 = JSON.parse(JSON.stringify(obj1));
```

**优点：** 简单快捷
 **缺点：**

- 不能拷贝函数
- 不能拷贝 `undefined` / `Symbol`
- 日期对象会变成字符串
- 原型链信息丢失

✅ 2. 递归实现（手写深拷贝）

```js
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  const newObj = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key]);
    }
  }
  return newObj;
}
```

✅ 3. 使用结构化克隆（现代方案）

现代浏览器或 Node.js 17+ 支持：

```js
const obj2 = structuredClone(obj1);

//使用实例
const obj1 = {
  name: "Liu",
  age: 25,
  info: { hobby: "coding" },
  date: new Date(),
  arr: [1, 2, 3],
  map: new Map([["a", 1]]),
  set: new Set([1, 2, 3])
};

const obj2 = structuredClone(obj1);

obj2.info.hobby = "reading";

console.log(obj1.info.hobby); // "coding" ✅ 没被影响
console.log(obj1.date === obj2.date); // false ✅ 深拷贝成功

//支持循环引用
const obj = {};
obj.self = obj; // 循环引用

const clone = structuredClone(obj);
console.log(clone.self === clone); // ✅ true，不报错


```

**优点**：

- 完全深拷贝
- 支持循环引用
- 支持 Map、Set、Date、RegExp 等对象

 **缺点**：

- 不支持函数

  

## 二、CSS

### 1. position

1️⃣ `static`（默认值）

- 默认值，元素按照文档流正常排列。
- **top / left / right / bottom** 无效。

```
div {
  position: static;
  top: 10px; /* 无效 */
}
```

2️⃣`relative`（相对定位）

- 元素仍占据原本文档流位置，但可以通过 `top/left/right/bottom` **相对自身原位置**进行偏移。
- 其他元素的位置不会改变。

```
div {
  position: relative;
  top: 10px; /* 向下偏移10px */
  left: 20px; /* 向右偏移20px */
}
```

✅ 优点：不会脱离文档流，适合微调位置。



3️⃣`absolute`（绝对定位）

- 元素脱离文档流，不占据空间。
- **定位基准**：
  - 如果父元素有 `position` 为 `relative/absolute/fixed/sticky`，则以最近的定位父元素为参考。
  - 如果没有，则以 **body（html）** 为参考。
- 可以使用 `top/left/right/bottom` 精确控制位置。

```
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 0;
  right: 0;
}
```

✅ 常用场景：弹窗、下拉菜单、角标等。



4. `fixed`（固定定位）

- 元素脱离文档流，并相对于 **浏览器窗口** 固定位置，不随滚动条滚动而改变。

```
div {
  position: fixed;
  bottom: 0;
  right: 0;
}
```

✅ 常用场景：悬浮导航、回到顶部按钮、固定底栏。



5. `sticky`（粘性定位）

- 元素在 **跨越滚动区间时表现为 relative/absolute 的结合**，相对于最近的可滚动容器，且不脱离文档流
- 当滚动到阈值时，元素会固定；其他时候像 `relative` 一样随文档流。

```
div {
  position: sticky;
  top: 0; /* 滚动到0px时固定 */
}
```

✅ 常用场景：表头固定、吸顶导航。



二、`position` 属性结合 `z-index`

- 只有 `position` 值为 **relative/absolute/fixed/sticky** 的元素，`z-index` 才有效。
- `z-index` 控制元素堆叠顺序，值越大越靠前。

```
div {
  position: absolute;
  z-index: 10;
}
```

### 2. 移动端适配

#### 2.1 媒体查询（Media Queries）

CSS 里最基础的适配手段，根据设备宽度、分辨率等条件，应用不同的样式。

```css
/* 手机小屏幕 */
@media (max-width: 480px) {
  body {
    font-size: 14px;
  }
}

/* 平板 */
@media (min-width: 481px) and (max-width: 768px) {
  body {
    font-size: 16px;
  }
}

/* PC大屏 */
@media (min-width: 769px) {
  body {
    font-size: 18px;
  }
}
```

✅ 优点：灵活、可控
 ❌ 缺点：样式表容易膨胀，需要手动维护多个断点

------

#### 2.2 REM/EM 布局（相对单位）

通过相对单位配合 `meta viewport` 进行适配。

```css
<meta name="viewport" content="width=device-width, initial-scale=1.0">
html {
  font-size: 16px; /* 基准大小 */
}

body {
  font-size: 1rem; /* 16px */
}

h1 {
  font-size: 2rem; /* 32px */
}
```

- **REM**：相对于根元素 `<html>` 的字体大小
- **EM**：相对于父元素的字体大小

📌 做法：可以配合 JS 动态计算屏幕宽度改变 `html` 的 font-size，使页面自适应不同屏幕。

```js
function setRem() {
  const html = document.documentElement;
  const width = html.clientWidth;
  html.style.fontSize = width / 10 + 'px'; // 设计稿宽度 375px → 1rem = 37.5px
}
window.addEventListener('resize', setRem);
setRem();
```

------

#### 2.3 百分比 / 弹性盒子（Flex）

- **百分比**：宽度、间距用 `%` 表示，相对父容器自适应。
- **Flex 布局**：非常适合移动端一维布局。

```css
.container {
  display: flex;
  justify-content: space-between;
}
.item {
  flex: 1; /* 平分空间 */
  margin: 0 5px;
}
```

------

#### 2.4 栅格系统（Grid / UI 框架）

- 常用的移动端 UI 框架如 **Vant**, **Ant Design Mobile**, **WeUI**, **Bootstrap（响应式栅格）**
- 栅格可以快速实现多列布局、间距自适应、隐藏显示元素等功能。

```html
<div class="row">
  <div class="col-6">左侧</div>
  <div class="col-6">右侧</div>
</div>
```

------

#### 2.5. 图片 / 字体自适应

- **图片**：

```css
img {
  max-width: 100%;
  height: auto;
}
```

- **字体**：
  - 使用 `rem` 或 `vw` 单位

```css
h1 {
  font-size: 5vw; /* 视口宽度的 5% */
}
```

------

#### 2.6 视口（Viewport）设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

- **width=device-width** → 宽度与设备宽度一致
- **initial-scale=1.0** → 初始缩放比例
- **user-scalable=no** → 禁止用户缩放

------

#### 2.7 移动端适配工具

- **PostCSS + px2rem**：自动将 px 转为 rem
- **Lib-flexible**：阿里出品，动态计算根字体大小
- **vw/vh**：CSS 单位，根据视口宽高适配

------

#### 2.8移动端适配的思路

1. **先设计移动端**：先做移动端页面，再做平板和 PC（Mobile First）
2. **使用相对单位**：避免绝对像素，布局和字体尽量用 `rem`, `%`, `vw`
3. **合理断点**：常见断点 375px（小手机）、768px（平板）、1024px（PC）
4. **测试真机**：浏览器模拟器无法完全覆盖真实机型，需要在 iOS/Android 真机上测试



## 三、Vue

### 1. Diff算法

**🧠 Diff 算法的核心思想**

Vue 的更新机制基于 “**虚拟 DOM（Virtual DOM）**”。
 当数据更新时，Vue 会：

1. 重新渲染出一个新的 **虚拟节点树（VNode Tree）**
2. 与旧的 VNode 树做 **Diff 对比**
3. 根据最小的差异去修改真实 DOM（这一步称为 **Patch**）

Diff 的目标就是：
 👉 **尽可能少地修改真实 DOM，以达到性能最优。**



**⚙️ Vue Diff 的主要流程（以 Vue2 为例）**

Vue2 的 Diff 算法借鉴自 **React 的 Diff 思想**，并做了针对性优化。

**1️⃣同层比较**

Vue 的 Diff 算法只会在同层级节点之间比较：

```
<div>
  <span></span>
</div>

<p></p>
```

即使 `<div>` 变成 `<p>`，也不会去比对 `<span>` 与 `<p>`。
 **不同层级之间不会比较**，这大大降低了复杂度（O(n³) → O(n)）。



**2️⃣比较流程（核心函数：`patch(oldVNode, newVNode)`）**

Vue 通过 `patch` 函数递归对比新旧节点：

🧩 Step 1：节点类型不同 → 直接替换

如果 `oldVNode.tag !== newVNode.tag`，则直接销毁旧节点，创建新节点。

🧩 Step 2：节点类型相同 → 比对属性

如果标签相同，则只比对：

- 属性变化（class, style, id...）
- 事件变化（onClick 等）

🧩 Step 3：比对子节点（核心部分）

对比 `oldChildren` 与 `newChildren` 时，Vue 采用 **双端比较（双指针）算法**。

**🔁 双端比较算法（Vue2 核心）**

假设：

```
oldChildren = [a, b, c, d]
newChildren = [d, b, a, c]
```

Vue 会维护四个指针：

```
oldStart, oldEnd, newStart, newEnd
```

每轮比较：

- oldStart vs newStart
- oldEnd vs newEnd
- oldStart vs newEnd
- oldEnd vs newStart

匹配成功 → 移动指针
 匹配失败 → 尝试用 key 快速定位已有节点 → 移动或创建新节点

这种方式比“全量查找”效率高得多，复杂度接近 **O(n)**。



**🚀 Vue3 的 Diff 优化**

Vue3 对 Diff 进行了重写（基于 **静态标记 + 快速路径优化**）：

**1️⃣ 静态标记（Patch Flag）**

在模板编译阶段，Vue3 编译器会为动态节点打上“标记”，
 只在运行时对这些节点进行 Diff。

例：

```
<div>静态内容</div>
<p>{{ msg }}</p>
```

→ 编译结果：

- `<div>` 无标记（跳过比较）
- `<p>` 有动态标记（仅比较文本）

✅ 优化：跳过静态部分的比较，大大减少计算量。



**2️⃣ Fragment / Block Tree 优化**

Vue3 引入 **Block Tree**，在 Diff 时只追踪可能变化的节点，
 减少无关节点的遍历。



**3️⃣最长递增子序列（LIS）优化移动节点**

Vue3 在列表 Diff 中使用 **最长递增子序列（LIS）算法** 来最小化 DOM 移动。

例：

```
old = [a, b, c, d]
new = [b, a, d, c]
```

通过 LIS 算法，可以找出 `[b, d]` 不需移动，只移动剩下的节点。

👉 结果：减少节点移动次数，提升渲染性能。



**📊 Vue2 vs Vue3 Diff 对比总结**

| 特性          | Vue2     | Vue3                       |
| ------------- | -------- | -------------------------- |
| Diff 方式     | 双端比较 | 静态标记 + 双端比较 + LIS  |
| 静态节点优化  | ❌ 无     | ✅ 编译期标记，跳过静态节点 |
| Fragment 支持 | ❌        | ✅                          |
| 性能          | 优       | 更优（2~3倍）              |



💡 总结一句话

> Vue 的 Diff 算法核心是 **"同层比较 + 双端指针 + Key + 静态标记 + LIS 优化"**，
>  目标是尽可能减少真实 DOM 的更新和移动，从而获得极高的性能。

### 2. 组件通信方式



## 四、React

### 1.生命周期



### 2. 常见的Hook

#### 2.1 **状态管理类 Hook**

**1️⃣ `useState`**

**作用：** 定义一个组件内部的响应式状态变量。
 **语法：**

```
const [state, setState] = useState(initialValue)
```

**参数：**

- `initialValue`: 初始值（可以是任意类型，也可以是函数延迟初始化）
   **返回值：**
- `[state, setState]`: 当前状态值和更新状态的函数

**使用场景：**

- 管理组件内的局部状态，如表单输入、开关状态、计数器等。

**示例：**

```js
const [count, setCount] = useState(0)
setCount(prev => prev + 1)

//使用useState修改数组，需要把state当中的数据视为只读的
//不应该使用类似于 arr[0] = 'bird' 这样的方式来重新分配数组中的元素
//也不应该使用会直接修改原始数组的方法，例如 push() 和 pop()

//1、在数组添加元素，推荐使用[...arr]数组展开语法

const [artists,serArtists]=useState(["a","b"])
setArtists( // 替换 state
  [ // 是通过传入一个新数组实现的
    ...artists, // 新数组包含原数组的所有元素
    { id: nextId++, name: name } // 并在末尾添加了一个新的元素
  ]
);

//2、在数组中删除元素
setArtists(
  artists.filter(a =>
    a.id !== artist.id
  )
);

//3、修改特定元素
let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

const [shapes, setShapes] = useState(initialShapes);

function handleClick() {
  const nextShapes = shapes.map(shape => {
    if (shape.type === 'square') {
      // 不作改变
      return shape;
    } else {
      // 返回一个新的圆形，位置在下方 50px 处
      return {
        ...shape,
        y: shape.y + 50,
      };
    }
  });
  // 使用新的数组进行重渲染
  setShapes(nextShapes);
}

//注意：下面的写法是错误的，这是由于这里的运算是一个是浅拷贝，
//nextList[0] 和 list[0] 指向了同一个对象。因此，通过改变 nextList[0].seen，list[0].seen 的值也被改变了。
const nextList = [...list];
nextList[0].seen = true; // 问题：直接修改了 list[0] 的值
setList(nextList);


```

----

2️⃣ `useReducer`

**作用：** 管理复杂状态逻辑（类似 Redux 思想）
 **语法：**

```
const [state, dispatch] = useReducer(reducer, initialState)
```

**参数：**

- `reducer(state, action)`：定义状态如何根据 action 变化
- `initialState`：初始状态值

**返回值：**

- `[state, dispatch]`：**state**：当前状态   **dispatch**：用于触发状态更新的函数

**使用场景：**

- 状态更新逻辑复杂、依赖多个条件时
- 适用于中大型组件逻辑清晰化

**示例：**

```js
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h2>Count: {state.count}</h2>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  )
}
```



#### 2.2 副作用类 Hook

1️⃣ `useEffect`

**作用：** 执行副作用逻辑（如请求、DOM 操作、定时器、订阅等）
 **语法：**

```js
useEffect(() => {
  // 副作用逻辑
  return () => { /* 清理逻辑（卸载时）*/ }
}, [deps])
```

**参数：**

- `callback`: 要执行的副作用函数
- `deps`: 依赖数组，决定执行时机



**执行时机：**

🌟**没有依赖数组**

```
useEffect(() => {
  console.log("每次渲染都会执行")
})
```

> ✅ 执行时机：**组件初次挂载** + **每次更新后**。
>  常用于：调试日志、监听 props/state 的变化。

---

🌟**空依赖数组 `[]`**

```
useEffect(() => {
  console.log("只执行一次")
}, [])
```

> ✅ 执行时机：**仅挂载时执行一次**。
>  常用于：

- 初始化操作（如网络请求）
- 注册全局事件监听

----

🌟**指定依赖 `[a, b]`**

```
useEffect(() => {
  console.log("当 a 或 b 变化时执行")
}, [a, b])
```

> ✅ 执行时机：当依赖项变化时重新执行。
>  常用于：

- 根据依赖变化重新请求或更新数据

----

🌟**带返回函数（清理副作用）**

```
useEffect(() => {
  const id = setInterval(() => console.log('tick'), 1000)
  return () => clearInterval(id)
}, [])
```

> ✅ 返回的函数在组件卸载时执行。
>  常用于：

- 清除定时器
- 取消事件监听
- 断开网络订阅

**常见副作用：**

- 数据请求
- 事件绑定
- 订阅与清理

----

4️⃣ `useLayoutEffect`

**作用：** 类似 `useEffect`，但在 **DOM 更新后、浏览器绘制前** 同步执行。
 **区别：**

- `useEffect`: 异步，不阻塞渲染（推荐默认使用）
- `useLayoutEffect`: 同步执行，阻塞绘制（用于测量 DOM）

**使用场景：**

- 当需要读取/同步 DOM 布局（如元素大小、滚动位置）时。



**⚙️ 语法**

```js
useLayoutEffect(() => {
  // 副作用逻辑（同步执行）
  return () => {
    // 清理逻辑
  }
}, [deps])
```

- `deps` 与 `useEffect` 一样，控制副作用的执行时机。
- 返回函数用于清理副作用。



**🔍 执行时机对比**

```
React 渲染流程：
render -> commit DOM -> useLayoutEffect -> 浏览器绘制 -> useEffect
```

- `useLayoutEffect` 在 **commit DOM 后**立即执行
- `useEffect` 在 **浏览器绘制后**执行
- 如果副作用涉及 DOM 测量或布局调整，推荐 `useLayoutEffect`



**💡 使用场景**

1️⃣ 测量 DOM

```js
import { useLayoutEffect, useRef, useState } from 'react'

function Box() {
  const ref = useRef()
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth)
  }, [])  // 组件挂载后执行一次

  return (
    <div ref={ref}>
      <p>盒子宽度: {width}px</p>
    </div>
  )
}
```

- 这里用 `useEffect` 可能会出现闪烁，因为浏览器先绘制了初始宽度再更新。
- `useLayoutEffect` 确保宽度更新在绘制前完成。



2️⃣ 修改 DOM 样式或位置

```js
useLayoutEffect(() => {
  const box = boxRef.current
  box.style.transform = 'translateX(50px)'
}, [])
```

- 用于动画或布局同步调整
- 避免页面闪烁或不一致



3️⃣ 读取并同步更新布局

```js
useLayoutEffect(() => {
  const box = boxRef.current
  const height = box.offsetHeight
  setBoxHeight(height)
}, [content])
```

- 当内容 `content` 改变时，读取真实 DOM 高度并同步更新状态
- 用 `useEffect` 会有渲染闪烁问题



⚠️ 注意事项

1. **不要滥用**

- `useLayoutEffect` 会阻塞渲染，过多使用会影响性能
- 默认使用 `useEffect`，只有在需要同步操作 DOM 或布局时才用

1. **服务器端渲染（SSR）**

- `useLayoutEffect` 在服务端没有 DOM，会发出警告
- 可条件使用或改用 `useEffect`

**示例：**

```js
useLayoutEffect(() => {
  const height = divRef.current.offsetHeight
  console.log(height)
})
```



#### 2.3 引用与缓存类 Hook

**1️⃣ `useRef`**

**作用：** 保存一个在组件整个生命周期中持续存在的可变值。
 **语法：**

```js
const ref = useRef(initialValue)
```

**返回值：** `{ current: initialValue }`

**使用场景：**

- 获取 DOM 节点引用
- 存储任意可变数据而不触发重新渲染

**示例：**

```js
const inputRef = useRef()
useEffect(() => {
  inputRef.current.focus()
}, [])
```



**2️⃣ `useMemo`**

**作用：** 对计算结果进行缓存，避免重复计算。
 **语法：**

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
```

**参数：**

- 第一个参数是计算函数
- 第二个参数是依赖项数组

**使用场景：**

- 计算量大的数据
- 避免组件频繁渲染时重复计算

**3️⃣ `useCallback`**

**作用：** 缓存函数引用，防止子组件不必要的重新渲染。
 **语法：**

```js
const memoizedFn = useCallback(() => { doSomething(a, b) }, [a, b])
```

**区别：**

- `useMemo` → 缓存 **结果值**
- `useCallback` → 缓存 **函数引用**

**使用场景：**

- 当函数被传递给子组件时，避免子组件重复渲染。

#### 2.4 上下文与引用

**`useContext`**

**作用：** 获取 React Context 中共享的值。
 **语法：**

```js
const value = useContext(MyContext)
```



**参数与返回值**

| 项           | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| **参数**     | `context` 对象，由 `createContext()` 返回                    |
| **返回值**   | 当前上下文的值（由最近的 `Provider` 提供）                   |
| **更新方式** | 当 Provider 的 `value` 变化时，所有使用该 context 的组件都会重新渲染 |



**使用场景：**

- 父子组件之间共享主题、用户信息、语言等状态

`useContext` 是 React 的内置 Hook，用于**订阅上下文（Context）**。

```
const value = useContext(MyContext);
```

它让你能够在函数组件中直接读取由 `React.createContext` 创建的上下文对象的值。



**🌟使用步骤（3 步走）**

**1️⃣ 创建 Context**

```js
import { createContext } from "react";

export const ThemeContext = createContext("light");
```

> 这里的`createContext` 的参数 `"light"` 是默认值，当组件树中没有 Provider 时会使用这个默认值。



**2️⃣ 提供 Context 值（Provider）**

```js
import { ThemeContext } from "./ThemeContext";

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

> Provider 是一个组件，它接受一个 `value` 属性。
>  所有被包裹的子组件都可以通过 `useContext(ThemeContext)` 访问这个值。



**3️⃣ 消费 Context 值（useContext）**

```js
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function Toolbar() {
  const theme = useContext(ThemeContext);

  return <div>当前主题：{theme}</div>;
}
```

✅ 结果：
 `Toolbar` 组件中能直接拿到 `"dark"`。



**一个完整示例（父子多层传递）**

```js
import React, { createContext, useContext, useState } from "react";

// 1. 创建 Context
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");

  return (
    // 2. 提供 Context 值
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

function Page() {
  return (
    <div>
      <h1>🌗 Context 示例</h1>
      <ThemeSwitcher />
    </div>
  );
}

function ThemeSwitcher() {
  // 3. 消费 Context 值
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div>
      <p>当前主题：{theme}</p>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        切换主题
      </button>
    </div>
  );
}

export default App;
```

✅ 效果：

- 所有子组件都能访问 `theme`；
- 只需修改 Provider 中的值，所有订阅了该 Context 的组件会自动更新。

✅ 特性

- 没有 Provider 时，会使用 `createContext(defaultValue)` 的默认值；
- 不需要手动订阅或取消订阅；
- 能让组件树中任意层级共享状态。

⚠️ 注意

1. `useContext` **不会**让组件跳过重新渲染；
   - 如果 `Provider` 的 `value` 改变，所有使用它的组件都会重新渲染。
2. 不建议在大型应用中过度使用全局 Context；
   - 太多 Context 更新会影响性能；
   - 更适合用来存储全局配置（如主题、语言、登录信息等）。



**🧩 搭配 `useReducer` 使用（常见高级用法）**

在复杂状态管理中，常会把 `useReducer` 与 `useContext` 搭配使用，做出一个简易的全局 store：

```tsx
import { createContext, useReducer, useContext } from "react";

const CountContext = createContext();

function countReducer(state, action) {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    default:
      return state;
  }
}

export function CountProvider({ children }) {
  const [count, dispatch] = useReducer(countReducer, 0);
  return (
    <CountContext.Provider value={{ count, dispatch }}>
      {children}
    </CountContext.Provider>
  );
}

export function useCount() {
  return useContext(CountContext);
}
```

使用：

```tsx
function Counter() {
  const { count, dispatch } = useCount();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}
```



#### 2.5 自定义与高级 Hook

1️⃣`useImperativeHandle`

**作用：** 与 `forwardRef` 搭配使用，定义暴露给父组件的 ref 接口。
 **语法：**

```js
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current.focus()
}))
```

**使用场景：**

- 让父组件可以通过 ref 调用子组件内部的方法。



2️⃣ `useDebugValue`

**作用：** 仅用于自定义 Hook，在 React DevTools 中显示调试信息。



3️⃣`useId`

**作用：** 在 SSR（服务端渲染）中生成唯一 ID，避免冲突。
 **示例：**

```tsx
const id = useId()
<input id={id} />
<label htmlFor={id}>Name</label>
```



#### 🎯 总结表格

| Hook                  | 参数            | 返回值            | 场景             |
| --------------------- | --------------- | ----------------- | ---------------- |
| `useState`            | 初始值          | [state, setState] | 组件状态管理     |
| `useReducer`          | reducer, 初始值 | [state, dispatch] | 复杂状态逻辑     |
| `useEffect`           | 回调, 依赖      | 无                | 异步副作用       |
| `useLayoutEffect`     | 回调, 依赖      | 无                | DOM 操作同步     |
| `useRef`              | 初始值          | ref 对象          | DOM 或持久值     |
| `useMemo`             | 计算函数, 依赖  | 缓存值            | 性能优化         |
| `useCallback`         | 函数, 依赖      | 缓存函数          | 子组件优化       |
| `useContext`          | context 对象    | context 值        | 全局状态共享     |
| `useImperativeHandle` | ref, 回调       | 自定义暴露方法    | 父组件操作子组件 |
| `useId`               | 无              | 唯一 ID           | SSR 唯一标识     |



### 3. 组件通信方式

在 **React** 当中，**组件之间的信息（数据）传递** 是整个框架的核心逻辑之一。
 React 遵循 **单向数据流（one-way data flow）** 原则：

> 数据只能从父组件传到子组件，子组件不能直接修改父组件的数据。

不过 React 提供了多种机制来实现灵活的 **组件通信**。下面我会系统地讲解每种方式及其适用场景👇

#### 3.1 父传子（Props 传递）

✅ 最常见、最基础的通信方式

父组件通过 **props** 将数据或函数传递给子组件。

```js
function Child({ name, onSayHi }) {
  return (
    <div>
      <p>我是子组件，我的名字是 {name}</p>
      <button onClick={onSayHi}>和父组件打招呼</button>
    </div>
  );
}

function Parent() {
  const handleHi = () => alert("你好，我是父组件");
  return <Child name="React" onSayHi={handleHi} />;
}
```

📌 **特点：**

- 单向流动（父 → 子）
- 子组件不能修改父组件传来的值
- 可通过传函数“反向通信”



#### 3.2 子传父（回调函数传递）

React 没有直接的“子传父”，但可以通过 **props 回调** 实现：

> 父组件把一个函数传给子组件，子组件调用时把数据回传。

```js
function Child({ onSend }) {
  return (
    <button onClick={() => onSend("来自子组件的消息")}>发送数据</button>
  );
}

function Parent() {
  const handleReceive = (msg) => console.log("父组件接收到：", msg);

  return <Child onSend={handleReceive} />;
}
```

📌 **特点：**

- 本质仍是 props，只不过传的是函数。
- 常用于表单、事件回调。



#### 3.3 兄弟组件通信

兄弟组件无法直接传递数据，但可以通过 **共同的父组件** 来间接传递：

```js
function BrotherA({ onSend }) {
  return <button onClick={() => onSend("来自A的消息")}>A 发送</button>;
}

function BrotherB({ message }) {
  return <p>B 接收到：{message}</p>;
}

function Parent() {
  const [msg, setMsg] = useState("");
  return (
    <>
      <BrotherA onSend={setMsg} />
      <BrotherB message={msg} />
    </>
  );
}
```

📌 **特点：**

- 通过“状态提升（lifting state up）”共享状态。
- 小型项目很常见。



#### 3.4 跨层级通信（Context）

当组件层级很深时，一层层通过 props 传递很繁琐。
 这时可以使用 **Context（上下文）**：

```js
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

function Child() {
  const user = useContext(UserContext);
  return <p>子组件读取到用户名：{user}</p>;
}

function Parent() {
  const [user] = useState("Liu");
  return (
    <UserContext.Provider value={user}>
      <Child />
    </UserContext.Provider>
  );
}
```

📌 **特点：**

- 实现“跨组件层级”的共享状态。
- 常用于主题、语言、登录信息。
- 类似 Vue 的 `provide / inject`。



#### 3.5 全局状态管理（Redux、Zustand、Recoil、Jotai）

当项目变大，跨层通信复杂时，可以使用全局状态管理工具。

示例：Redux（经典写法）

```js
// store.js
import { createStore } from "redux";

const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case "INCREMENT": return { count: state.count + 1 };
    default: return state;
  }
};

export const store = createStore(reducer);
// App.jsx
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";

function Counter() {
  const count = useSelector(s => s.count);
  const dispatch = useDispatch();
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
```

📌 **特点：**

- 适合大型应用。
- 任何组件都可访问/修改全局状态。
- 状态统一可控、可追踪。



#### 3.6 Refs（父访问子实例）

如果要在父组件中直接访问子组件内部的 DOM 或方法，可以用 **ref**。

```js
function Child(props, ref) {
  const inputRef = useRef();
  React.useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus()
  }));
  return <input ref={inputRef} />;
}
const ForwardedChild = React.forwardRef(Child);

function Parent() {
  const childRef = useRef();
  return (
    <>
      <ForwardedChild ref={childRef} />
      <button onClick={() => childRef.current.focus()}>聚焦子组件</button>
    </>
  );
}
```

📌 **特点：**

- 用于操作 DOM 或子组件的暴露方法。
- 不建议用于数据传递（违背单向流）。



#### 3.7 事件总线（不推荐，但可用）

在某些特殊情况下，可以使用第三方库（如 mitt、eventemitter3）创建事件总线：

```js
import mitt from "mitt";
export const bus = mitt();

// 组件A
bus.emit("update", "来自A的数据");

// 组件B
bus.on("update", data => console.log(data));
```

📌 **特点：**

- 简单暴力，但破坏数据流。
- 可在小项目或调试阶段使用。

#### 3.8 总结对比

| 通信方式      | 方向        | 适用场景     | 特点           |
| ------------- | ----------- | ------------ | -------------- |
| Props         | 父 → 子     | 基本传值     | 简单直观       |
| 回调函数      | 子 → 父     | 子上报事件   | 单向可控       |
| 状态提升      | 兄弟间      | 局部通信     | 中小项目       |
| Context       | 跨层级      | 主题/用户    | 无需层层传     |
| Redux/Zustand | 全局        | 大型项目     | 全局可控       |
| Ref           | 父 → 子实例 | 操作方法/DOM | 不建议用于状态 |
| 事件总线      | 任意        | 临时通信     | 破坏单向流     |



### 4.Diff算法

**1️⃣核心思想**

React 的 Diff 目标与 Vue 相同：**在数据变化时尽可能少地修改真实 DOM**。
 React 的 Diff 核心原则是：

1. **同类型组件才会更新，不同类型直接替换**
   - 不同标签或组件类型 → 卸载旧节点 → 创建新节点
   - 相同类型 → 更新 props 和子节点
2. **尽量局部更新**
   - React 不会递归比较整个 DOM 树，而是**从根节点开始向下递归，只比较变化部分**
3. **通过 key 优化列表节点**
   - key 唯一标识同级节点，帮助 React 快速定位和重用节点



**2️⃣ Diff 流程**

React 的 Diff 主要分为两步：

1. **树比较（Tree Diff）**

- React 假设 **不同类型的节点差异很大**，直接替换
- 同类型节点则进入 **属性比较 + 子节点比较**
- 复杂度：**O(n)**，没有使用完全的动态规划（减少了计算量）

2. **列表比较（List Diff / Reconciliation）**

- 对于数组类型的 children，React 有两种情况：

a. **无 key 的节点**

- 直接按照索引比较（index-based）
- 新旧节点顺序不同 → 会销毁旧节点重新创建
- 简单但可能导致不必要的 DOM 重新渲染

b. **有 key 的节点**

- React 会构建一个 key → 节点的映射表
- 遍历新节点：
  1. 找到对应 key → 重用节点并更新 props
  2. 找不到 → 创建新节点
- 遍历旧节点：
  1. key 不在新节点 → 删除节点
- 这个过程 **最小化 DOM 移动**
- **复杂度：O(n)**



3️⃣ React Diff 特点总结

| 特性     | React Diff                                         |
| -------- | -------------------------------------------------- |
| 树比较   | 同类型递归，不同类型直接替换                       |
| 列表比较 | 有 key → 快速映射，无 key → 按索引                 |
| 复杂度   | O(n)                                               |
| 优化策略 | key 重用，批量更新，Fiber 架构支持中断和优先级调度 |
| 移动节点 | 基于 key 映射，最小化移动                          |



**4️⃣ Vue vs React Diff 对比**

| 特性         | Vue Diff                         | React Diff                        |
| ------------ | -------------------------------- | --------------------------------- |
| 静态节点优化 | ✅ 编译时标记跳过静态节点         | ❌ 没有静态节点标记                |
| 列表更新     | 双端指针 + LIS 优化移动          | key 映射，按需重用节点            |
| 组件类型变化 | 直接替换                         | 直接替换                          |
| 树比较       | 同层级递归                       | 同类型递归                        |
| 性能优化     | Fragment、Block Tree、Patch Flag | Fiber 架构支持时间分片 + 批量更新 |



## 五、Webpack && Vite

### 1. 打包概述

> Webpack 是一个 **前端模块打包工具**（module bundler）。它可以将你的 JS、CSS、图片等各种资源看作模块，进行处理、依赖分析，然后打包成浏览器能直接使用的文件。
>
> 简单类比：
>
> - **模块（Module）**：像乐高积木，每块积木都有自己的功能。
> - **Webpack**：像工厂，把这些乐高积木组装成最终的作品（浏览器可用的 bundle）。
> - **打包（Bundling）**：把很多小模块组合成一个或多个大文件，提高加载效率。

#### 1.1 基础概念

- **🧩 Module（模块）**
   Webpack 把一切文件都当作模块（module）来处理。无论是 JS、CSS、图片、字体、甚至 Vue 文件，Webpack 都会把它们看作一个模块，分析它们之间的依赖关系。

**例子：**

```js
// src/index.js
import _ from 'lodash'
import './style.css'
import { add } from './math.js'
```

在这里：

- `lodash` 是一个第三方库模块（来自 node_modules）
- `./style.css` 是一个 CSS 模块（通过 css-loader 处理）
- `./math.js` 是你自己写的业务模块

➡️ 这些都被 Webpack 认为是模块（module）。

- **📦 Chunk（代码块）**

当 Webpack 根据依赖关系分析完所有模块后，会按一定的规则把这些模块组合成若干个**代码块（chunk）**。每个 chunk 可以包含多个模块，具体划分由以下因素决定：

​	- **入口（entry）不同** → 产生多个 chunk

​	- **动态导入（import()）** → 代码拆分产生新的 chunk

​	- **优化配置（如 splitChunks）** → 把公共模块提取成独立 chunk

**例子：**

```json
// entry 配置
entry: {
  app: './src/app.js',
  admin: './src/admin.js'
}
```

Webpack 会生成：

- app` chunk（包含 app.js 及其依赖模块）
- `admin` chunk（包含 admin.js 及其依赖模块）
- 如果两个入口都依赖 `lodash`，Webpack 还可能提取一个 `vendor` chunk（公共依赖）

**🪣 三、Bundle（最终打包产物）**

**定义：**
 当 Webpack 编译完所有 chunk 后，会把每个 chunk 输出为最终的 **bundle 文件**（通常是 `.js` 文件）。
 这些就是浏览器中实际加载的文件。

**例子：**
 假设你的构建结果是：

```
dist/
 ├── app.bundle.js
 ├── admin.bundle.js
 └── vendor.bundle.js
```

那么：

- 每个 `.bundle.js` 文件就是一个 bundle；
- 它对应一个 chunk（或多个 chunk 合并后的结果）；
- 浏览器最终加载的就是这些 bundle。

### 2. Webpack

#### 2.1 Webpack的核心概念

1. **Entry（入口）**

   - 告诉 Webpack 从哪里开始构建依赖图。

   - 例子：

     ```json
     entry: './src/index.js'
     ```

2. **Output（输出）**

   - 告诉 Webpack 打包后的文件放在哪里，叫什么名字。

   - 例子：

     ```json
     output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'bundle.js'
     }
     ```

3. **Loaders（加载器）**

   - 用于处理非 JS 模块（如 CSS、图片、TypeScript 等），把它们转换为 Webpack 能识别的模块。

   - 例子：

     ```json
     module: {
       rules: [
         { test: /\.css$/, use: ['style-loader', 'css-loader'] }
       ]
     }
     ```

4. **Plugins（插件）**

   - 用于扩展 Webpack 功能，比如压缩文件、生成 HTML、热更新等。

   - 例子：

     ```json
     plugins: [
       new HtmlWebpackPlugin({ template: './src/index.html' })
     ]
     ```

5. **Mode（模式）**

   - `"development"`：开发模式，打包速度快，保留调试信息
   - `"production"`：生产模式，自动压缩优化代码

#### 2.2 Webpack的工作原理

Webpack 的核心工作流程可以分为 **六步**：

1. 初始化

   > 读取配置文件（`webpack.config.js`），确定 **入口文件** 和 **配置选项**。

2. 构建依赖图（Dependency Graph）

   >  Webpack 从入口文件开始，递归分析 **所有依赖的模块**。
   >
   > 每个模块可能依赖其他模块，形成 **依赖树/依赖图**。

3. 使用 Loader 转换模块

   > 遇到非 JS 文件（如 `.css`、`.ts`、`.png`）时，交给对应的 **Loader** 进行处理，生成可以被 JS 使用的模块。

4. 编译成模块

   >  所有模块都会被封装成 **函数**，存放在内存中，准备打包。
   >
   > 类似：
   >
   > ```js
   > modules = {
   >   0: function(module, exports, require) { ... },
   >   1: function(module, exports, require) { ... }
   > }
   > ```
   >
   > 

5. 输出 Bundle

   >  Webpack 根据配置把这些模块打包成一个或多个 **bundle 文件**。
   >
   > 每个模块在 bundle 中有一个唯一 ID，`require` 用于加载依赖模块。

6. 完成编译

- 最终生成的 bundle 可以直接通过 `<script>` 标签引入浏览器运行。

## 六、性能优化方案

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

  ```html
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

#### LightHouse

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

```json
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

```json
"sideEffects": ["*.css"]
```

**示例**

```js
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

```ts
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

```bash
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

```html
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

```bash
npm install vite-plugin-html --save-dev
```

或者更常用：

```bash
npm install vite-plugin-html-minify --save-dev
```

配置：

```js
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

```html
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

```html
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

```css
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

    ```js
    const box = document.getElementById('box');
    for (let i = 0; i < 10; i++) {
        box.style.left = (box.offsetLeft + 10) + 'px'; // 读写交替，性能杀手
        box.style.top = (box.offsetTop + 10) + 'px';
    }
    ```

  - **推荐做法 (合并操作):** 将所有样式修改汇总，最后一次性应用。


    ```js
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


~~~css
```css
/* CSS */
.box-active {
    background-color: red;
    width: 200px;
    transform: scale(1.2);
}
```
~~~


```js
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

    ```css
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

```bash
npm install vue-virtual-scroller
```

使用示例

```html
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

```html
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

    ```js
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

****

### 4. 排查思路

要**高效排查网页加载慢**，可以需要从**浏览器网络层面、前端资源、接口性能、渲染逻辑、服务器端响应**等多个角度系统分析。

**🧭 一、总体排查思路（5大步骤）**

> 🔍 **一句话总结：**
>  “先区分前端慢还是后端慢，再逐层分析是网络、资源、接口、还是渲染。”

| 步骤         | 关注点                           | 工具                              | 目标                   |
| ------------ | -------------------------------- | --------------------------------- | ---------------------- |
| 1️⃣ 初步定位   | 是前端慢？还是接口慢？           | Chrome DevTools → Network 面板    | 判断慢在哪一层         |
| 2️⃣ 网络传输层 | 是否 DNS、TCP、SSL、CDN 有延迟   | Performance / WebPageTest         | 分析加载链路           |
| 3️⃣ 静态资源层 | JS、CSS、图片是否过大或阻塞渲染  | Lighthouse / DevTools Coverage    | 找体积和请求瓶颈       |
| 4️⃣ 接口层     | API 是否耗时高、并发多、顺序依赖 | Network Timing / 后端日志         | 确认慢的请求           |
| 5️⃣ 渲染层     | JS 执行或 DOM 渲染是否耗时       | Performance 面板 / React Profiler | 检查渲染逻辑和计算压力 |



**🕵️‍♂️ 二、第一步：判断是“前端慢”还是“后端慢”**

✅ 方法：

打开 **Chrome 开发者工具 → Network 面板**
 刷新页面（勾选 “Disable cache”）

观察：

1. **白屏时间**：是否页面空白很久 → 可能是首屏渲染慢；
2. **首个请求响应慢**：比如 HTML 加载就很久 → 后端慢；
3. **静态资源加载慢**：CSS/JS 下载慢 → 网络或 CDN 问题；
4. **接口请求慢**：API 响应延迟高 → 后端或数据库问题。

📊 关键时间指标：

| 指标                       | 含义         | 常见问题      |
| -------------------------- | ------------ | ------------- |
| DNS Lookup                 | 域名解析     | DNS 服务慢    |
| Initial Connection         | TCP 建立慢   | 网络延迟      |
| SSL                        | HTTPS 握手慢 | 证书优化      |
| TTFB（Time To First Byte） | 首字节时间   | 后端慢        |
| Content Download           | 内容传输     | 带宽/压缩问题 |



**🌐 三、网络层排查**

🔹 检查 CDN / 域名 / 网络延迟

- 用 **Chrome Network** 查看每个资源的时长。
- 看看是不是外部资源（比如 fonts.googleapis.com、analytics.js）卡住。
- 可用 WebPageTest.org 或 Lighthouse 查看**瀑布图**。

**优化方向：**

- ✅ 开启资源缓存（Cache-Control、ETag）
- ✅ 使用 CDN 加速（最近节点）
- ✅ 开启 Gzip / Brotli 压缩
- ✅ 合理预加载：`<link rel="preload">`、`<link rel="dns-prefetch">`

----



📦 四、静态资源层排查

查看 **JS/CSS/图片** 的加载情况：

1️⃣ JS 体积过大

- 打开 DevTools → **Coverage 面板**
- 看哪些脚本加载了但没用到（死代码）

**优化方式：**

- Tree-shaking / 按需引入 / 代码分割（Code Splitting）
- 懒加载（Dynamic Import）
- 去掉大库或替换轻量库（如 moment → dayjs）

2️⃣ 图片过大

- 图片未压缩、尺寸过大、格式老旧（jpg/png）
- 使用 WebP / AVIF 格式
- 用 `srcset` 和 `sizes` 适配多终端

3️⃣ 阻塞渲染

- 把非关键 CSS 延迟加载：`<link rel="preload">`

- JS 加上 `defer` 或 `async`

  ```html
  <script src="main.js" defer></script>
  ```

- 首屏 CSS 内联，非关键资源懒加载

----



**🔌 五、接口层排查**

接口请求耗时高是网页加载慢的常见原因之一。

重点看：

- **TTFB**（后端响应时间）
- **请求是否串行发出**
- **是否有重复请求 / N+1 请求**

优化建议：

- 接口并发发送（Promise.all）
- 使用缓存（localStorage / SW）
- 后端合并接口、分页返回数据
- 使用 HTTP/2 多路复用

----



**🧮 六、渲染层排查（JS 执行慢）**

即使资源加载很快，渲染逻辑复杂也会导致页面卡顿。

观察方法：

打开 **Chrome → Performance 面板**
 录制页面加载过程。

重点关注：

- JS 执行时间是否过长（红色长条）
- 是否频繁重绘（Repaint）或回流（Reflow）
- React/Vue 是否反复渲染无关组件

优化方式：

- 减少不必要的 setState / watch
- 虚拟列表优化长列表（React Virtualized / Vue Virtual Scroll）
- 使用 memoization（useMemo / computed）
- 懒加载组件 / 路由分块

----



**🧰 七、辅助工具推荐**

| 工具                  | 用途                                             |
| --------------------- | ------------------------------------------------ |
| 🧩 Chrome DevTools     | 全能调试工具（Network + Performance + Coverage） |
| 🧱 Lighthouse（内置）  | 自动生成性能报告（含建议）                       |
| 🌎 WebPageTest         | 模拟不同地区、网络测速                           |
| 📈 GTmetrix            | 页面体积、加载顺序分析                           |
| 🔥 React Profiler      | 分析 React 渲染性能                              |
| 🐍 Wireshark / Fiddler | 深入分析请求链路                                 |

------



## 七、项目相关

> cookie当中的常见配置
>
> - httpOnly：
>
>   **作用**：禁止 JavaScript 通过 `document.cookie` 访问该 Cookie。
>
>   **意义**：防止 **XSS（跨站脚本攻击）** 获取登录凭证。
>
>   ```js
>   res.cookie('token', jwtToken, {
>     httpOnly: true, // 禁止前端JS访问
>   })
>   ```
>
>   
>
> - secure
>
>   **作用**：限制 Cookie 只能在 **HTTPS** 连接中传输。
>
>   **意义**：防止中间人通过 HTTP 抓包或嗅探窃取 Cookie。
>
>   ```js
>   res.cookie('token', jwtToken, {
>     secure: true, // 只在 HTTPS 下传输
>   })
>   ```
>
> 
>
> Session:是服务器在内存或数据库中为每个登录用户保存的一份**会话数据**。
>
> 例如：用户第一次登录：
>
> - 浏览器提交用户名密码；
>
> - 服务器验证成功后生成一份 `session`，比如：
>
>   ```json
>   {
>     sessionId: "abc123",
>     userId: 1,
>     name: "Liu",
>     role: "admin"
>   }
>   ```
>
> - 同时服务器返回响应头：
>
>   ```
>   Set-Cookie: sessionId=abc123; HttpOnly
>   ```
>
> 2️⃣ 浏览器保存这个 Cookie。
> 3️⃣ 下次请求时自动会带上：
>
> ```
> Cookie: sessionId=abc123
> ```

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




#### 1.3 **单点登录（SSO，Single Sign-On）**

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
  
  **🖥️ 实现思路**
  
  1. 有一个统一的 **认证中心**（`sso.company.com`），负责登录。
  2. 用户在认证中心登录成功后，**设置一个跨子域的 Cookie**：
     - `Domain=.company.com`
     - `SESSIONID=xxxxxx`
  3. 浏览器访问任意子系统时，都会自动携带这个 Cookie。
  4. 各个子系统拿到 `SESSIONID` → 去认证中心校验用户信息。
  
  **🛠️ 示例代码**
  
  这里用 Node.js + Express 来演示：
  
  1️⃣ SSO 登录中心（`sso.company.com`）
  
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
  
  2️⃣ 子系统（`oa.company.com`）
  
  ```js
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


----



2. **基于 Token（JWT）+ 网关校验**

- **适用场景**：前后端分离、跨域系统、移动端和 Web 混合环境。
- **原理**：
  1. 用户在 SSO 登录中心输入账号密码。
  2. 登录中心签发一个 Token（JWT）。
  3. 用户访问任一系统时，携带这个 Token（放在 Cookie 或 HTTP Header）。
  4. 各个子系统验证 Token 的合法性（解密签名或请求认证中心验证）。
- **优点**：支持跨域，移动端也能用。
- **缺点**：Token 一旦泄露，在有效期内可能被滥用。

**🛠️ 示例代码**

后端部分

```js
// server.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'my_secret_key'; // 建议用环境变量配置

//登陆接口，签发token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // 简单校验
  if (username === 'admin' && password === '123456') {
    const token = jwt.sign(
      { username, role: 'admin' },
      SECRET_KEY,
      { expiresIn: '2h' } // 过期时间
    );
    res.json({ code: 200, token });
  } else {
    res.status(401).json({ code: 401, msg: '用户名或密码错误' });
  }
});

//中间件校验token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ msg: '未携带 token' });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: 'token 无效或已过期' });
    }
    req.user = decoded; // 将用户信息注入请求对象
    next();
  });
}

//获得用户信息接口
app.get('/profile', verifyToken, (req, res) => {
  res.json({
    code: 200,
    data: {
      username: req.user.username,
      role: req.user.role,
    }
  });
});

```



**前端部分**

```js
<template>
  <div>
    <input v-model="username" placeholder="用户名" />
    <input v-model="password" placeholder="密码" type="password" />
    <button @click="login">登录</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

async function login() {
  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      credentials: 'include', // ✅ 带上 HttpOnly Cookie
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })
    const data = await res.json()
    if (res.ok) router.push('/home')
    else alert(data.msg)
  } catch (err) {
    console.error(err)
  }
}
</script>

// src/api/request.js
export async function request(url, options = {}) {
  const res = await fetch('http://localhost:3000' + url, {
    credentials: 'include', // 自动带 Cookie
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.msg || '请求失败')
  }
  return res.json()
}

async function getProfile() {
  const res = await request('/user/profile')
  console.log(res.data)
}

async function getOrders() {
  const res = await request('/order/list')
  console.log(res.data)
}

async function logout() {
  await fetch('http://localhost:3000/logout', {
    method: 'POST',
    credentials: 'include'
  })
  window.location.href = '/login'
}

```




🔐 五、安全与优化建议

1. **Token 存储位置**
   - 推荐使用 `HttpOnly + Secure` Cookie（防 XSS），如果方便可以先用 localStorage。
2. **Token 过期自动刷新**
   - 实现一个 `/refresh` 接口，用 Refresh Token 换新的 Access Token。
3. **退出登录**
   - 前端清除 Token；
   - 或在后端维护黑名单（可存在 Redis）。
4. **接口白名单**
   - 登录、注册等接口不需要校验 Token。



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

****

### 2. 跨域解决方案

**🧩 一、为什么会有跨域问题**

跨域的根本原因是浏览器的 **同源策略（Same-Origin Policy）**。

**同源策略要求：**
 两个 URL 的

- 协议（http / https）
- 域名（example.com / api.example.com）
- 端口号（80 / 3000）
   必须完全一致，才能互相访问资源。

**不同源就会被拦截：**

```js
// 前端在 http://localhost:3000
fetch('http://localhost:4000/api/data') // ❌ 浏览器拦截跨域请求
```

****

**🚀 二、常见的跨域解决方案**

✅ 1. 服务器端设置 CORS 响应头（推荐方式）

**原理**：让后端在响应头中显式告诉浏览器“允许跨域”。

**示例（Node + Express）：**

```js
import express from 'express'
import cors from 'cors'

const app = express()

// 方式1：使用 cors 中间件（最简单）
app.use(cors())

// 方式2：手动设置响应头
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*') // 或指定域名
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.get('/api/data', (req, res) => {
  res.json({ msg: '跨域成功！' })
})

app.listen(4000)
```

🟩 推荐使用 `cors` 包，它会自动处理 OPTIONS 预检请求。

****

✅ 2. 使用代理（在开发环境中常用）

这种方式**绕过浏览器的同源检查**，由本地开发服务器代为转发请求。

例如在 **Vue / Vite**：

```js
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // 目标服务器
        changeOrigin: true, // 修改请求头中的origin
        rewrite: path => path.replace(/^\/api/, '') // 可选：重写路径
      }
    }
  }
}
```

这样前端请求 `/api/data` 就会被 Vite 转发到 `http://localhost:4000/data`。

在 **Next.js**：

```js
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/:path*', // 代理到后端
      },
    ]
  },
}
```

****

✅ 3. Nginx 反向代理（生产环境常用）

**Nginx 配置示例：**

```js
server {
  listen 80;
  server_name myapp.com;

  location /api/ {
    proxy_pass http://127.0.0.1:4000/;  # 后端服务地址
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

这样，前端访问 `myapp.com/api/...` 实际会由 Nginx 转发给后端。

****

✅ 4. JSONP（仅支持 GET 请求，不推荐）

**原理**：利用 `<script>` 标签不受同源限制。

```html
<script src="http://api.example.com/getData?callback=handleData"></script>

<script>
  function handleData(data) {
    console.log(data)
  }
</script>
```

但仅支持 `GET`，不安全，现代项目已基本弃用。

****

✅ 5. 前后端同域部署（根本解决）

最彻底的方式：让前端与后端部署在同一个域名下。
 例如：

```
前端：http://example.com
后端：http://example.com/api
```

这就没有跨域问题了（通常通过 Nginx 路由或反代实现）。

****

🧠 三、进阶说明：预检请求（OPTIONS）

当浏览器检测到请求属于**复杂请求**（例如包含自定义 header，或使用 PUT/DELETE 等方法）时，会先自动发送一个 `OPTIONS` 请求来确认服务器是否允许。

解决方式：
 后端必须正确响应这个 `OPTIONS` 请求：

```js
app.options('*', cors()) // express + cors 包自动处理
```

****

✅ 总结对比

| 方式                             | 适用场景    | 是否推荐 | 备注                           |
| -------------------------------- | ----------- | -------- | ------------------------------ |
| CORS 响应头                      | 生产 & 开发 | ⭐⭐⭐⭐     | 最正统做法                     |
| 本地代理 (Vite / Next / Webpack) | 开发        | ⭐⭐⭐      | 快速方便                       |
| Nginx 反代                       | 生产        | ⭐⭐⭐⭐     | 性能好，可同时解决静态资源问题 |
| JSONP                            | 仅 GET      | ⭐        | 老旧方式                       |
| 同域部署                         | 生产        | ⭐⭐⭐⭐     | 根本上无跨域问题               |

****



### 3.请求详解

#### 3.1 **option请求**

🧩 一、什么是 `OPTIONS` 请求

`OPTIONS` 是一种 **HTTP 请求方法**，
 意思是：“我想了解这个服务器支持哪些请求方式和规则”。

换句话说：

> 它是浏览器在正式发送请求之前，先“打个招呼”，问问服务器：“我能不能这样请求？你允许我跨域吗？”
****

🚦 二、为什么会有 `OPTIONS` 请求

浏览器在执行跨域请求时，会进行 **安全检查**，
 如果它判断这个请求 **“可能有风险”**，
 它就不会直接发真正的请求，而是先发一个 **“预检请求（preflight request）”**。

这个预检请求的 **HTTP 方法** 就是 `OPTIONS`。

------

 🧠 三、浏览器判断“有风险”的规则

浏览器会把跨域请求分成两类：

| 类型                                | 条件                                                         | 是否触发 `OPTIONS` 预检 |
| ----------------------------------- | ------------------------------------------------------------ | ----------------------- |
| ✅ **简单请求 (Simple Request)**     | 满足以下条件全部成立： 1. 方法是 `GET`、`POST` 或 `HEAD` 2. 请求头中没有自定义 header（除了 Accept、Content-Type 等基本头） 3. Content-Type 仅限 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain` | ❌ 不触发                |
| ⚠️ **复杂请求 (Non-simple Request)** | 不满足上述条件，例如： - 使用了 `PUT`、`DELETE` 等方法 - 自定义了 header（如 Authorization） - Content-Type 是 `application/json` | ✅ 会先触发 `OPTIONS`    |

------

**举个例子：**

✅ 简单请求（不会发 OPTIONS）

```js
fetch('http://api.example.com/data', {
  method: 'GET',
})
```

 ⚠️ 复杂请求（会发 OPTIONS）

```js
fetch('http://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, // 不属于简单请求类型
  body: JSON.stringify({ name: 'Liu' })
})
```

在第二种情况下，浏览器会：

1. **先发送一条 OPTIONS 请求**
    询问服务器是否允许这个跨域访问。
2. **如果服务器回应允许跨域**，
    浏览器才会再发真正的 POST 请求。

------

🧩 四、OPTIONS 请求的内容是什么样的？

例如浏览器发的：

```yaml
OPTIONS /data HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

服务器应该回应：

```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

其中的意思是：

- ✅ `Access-Control-Allow-Origin` 告诉浏览器允许来自哪个源的请求；
- ✅ `Access-Control-Allow-Methods` 告诉浏览器允许哪些方法；
- ✅ `Access-Control-Allow-Headers` 告诉浏览器允许哪些自定义头；
- ✅ `Access-Control-Max-Age` 表示结果缓存多久（单位：秒），在这段时间内不用再发 OPTIONS。

------

🛠 五、在后端怎么处理 OPTIONS 请求

如果你的后端是 Node + Express：

```js
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors()) // 自动处理 OPTIONS 预检请求

// 或者手动写：
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.sendStatus(204)
})
```

这样浏览器的预检就能顺利通过。

#### 3.2 **get和post请求**

**🌍 一、基本区别**

| 对比项                   | GET                         | POST                                    |
| ------------------------ | --------------------------- | --------------------------------------- |
| **用途**                 | 从服务器获取数据            | 向服务器提交数据（如表单）              |
| **参数位置**             | 放在 URL 里（`?key=value`） | 放在请求体（body）中                    |
| **是否对服务器有副作用** | 理论上无副作用（幂等）      | 一般有副作用（非幂等）                  |
| **数据大小限制**         | 有限制（URL 长度约 2~8KB）  | 理论上无限制（取决于服务器配置）        |
| **是否可缓存**           | 可以被浏览器缓存            | 默认不缓存                              |
| **是否能被收藏或分享**   | 可以（参数在 URL 中）       | 不可以                                  |
| **是否安全**             | 参数暴露在 URL，不安全      | 参数在 body，相对更安全（但仍需 HTTPS） |

------

**⚙️ 二、底层传输区别**

🧩 1. GET

```
GET /api/user?id=1001 HTTP/1.1
Host: example.com
```

- 参数拼在 URL 中。
- 请求体（body）为空。
- 一般用于读取资源。

------

🧩 2. POST

```
POST /api/user HTTP/1.1
Host: example.com
Content-Type: application/json

{"id": 1001, "name": "Liu"}
```

- 参数放在请求体中。
- 常用于表单提交、创建资源等。

------

**🧠 三、语义区别（重点）**

| 概念                | 说明                                                  |
| ------------------- | ----------------------------------------------------- |
| **GET 是幂等的**    | 多次请求结果相同，不应改变资源状态。例：`GET /user/1` |
| **POST 是非幂等的** | 每次请求可能产生不同结果。例：`POST /user` 创建新用户 |

------

**🔐 四、安全性区别**

- GET 的参数会暴露在：
  - 浏览器地址栏；
  - 浏览器历史记录；
  - 服务器日志；
  - 代理缓存；
- POST 的参数在请求体中，相对安全，但如果使用 HTTP 明文传输，依旧可被窃听。
   👉 **真正的安全依赖于 HTTPS 加密，而不是 POST 本身。**

------

**💾 五、缓存与性能**

| 项                   | GET                      | POST           |
| -------------------- | ------------------------ | -------------- |
| 缓存策略             | 可被缓存                 | 默认不缓存     |
| 浏览器回退行为       | 不会重新请求（使用缓存） | 会重新提交表单 |
| 预取（prefetch）支持 | 支持                     | 一般不支持     |

所以浏览器在优化上对 **GET 更友好**。

------

**📦 六、示例对比**

GET 示例（查询）

```js
fetch('/api/user?id=1001')
  .then(res => res.json())
  .then(data => console.log(data))
```

POST 示例（提交）

```js
fetch('/api/user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: 1001, name: 'Liu' })
})
```

------

**🧭 七、一句总结**

> **GET 用于“获取”，POST 用于“提交”。**
> GET 参数在 URL 中，可缓存、易泄露；
> POST 参数在请求体中，可传大数据、更安全。
> 安全的关键不是 POST，而是 **HTTPS**。

----



### 4. 图片懒加载

**🌙 一、懒加载的核心原理**

**核心思想：**

> 只有当图片即将进入可视区域时，才去加载图片资源，避免一次性加载大量图片造成页面卡顿或白屏。
> 浏览器提供了高效的 API：IntersectionObserver,它能自动监测元素是否进入可视区域，不需要频繁监听滚动事件。

**简化流程：**

1. 页面初始加载时，不给 `<img>` 标签设置真实的 `src`；
2. 用一个占位图或空的 `data-src` 属性保存真实图片地址；
3. 当用户滚动页面时，检测图片是否进入视口；
4. 如果进入视口，再把 `data-src` 的值赋给 `src`，触发图片加载。

------

**⚙️ 二、实现方式**

✅ 方式 1：手动实现（基于 `IntersectionObserver`）

现代浏览器推荐的方式，性能好。

```html
<template>
  <div class="image-list">
    <img 
      v-for="(item, index) in images" 
      :key="index" 
      v-lazy="item.src" 
      :alt="item.alt"
    />
  </div>
</template>

<script setup>
const images = [
  { src: '/images/a.jpg', alt: '图片A' },
  { src: '/images/b.jpg', alt: '图片B' },
  // ...
]
</script>

<style>
img {
  width: 100%;
  height: auto;
  display: block;
  min-height: 200px;
  background: #eee; /* 占位背景 */
}
</style>
```

**自定义指令：`v-lazy`**

```js
// directives/lazy.js
export default {
  mounted(el, binding) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.src = binding.value
        observer.unobserve(el)
      }
    })
    observer.observe(el)
  }
}
```

**注册指令：**

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import lazy from './directives/lazy'

const app = createApp(App)
app.directive('lazy', lazy)
app.mount('#app')
```

------

**✅ 方式 2：使用第三方库（更省事）**

推荐库：`vue-lazyload`

```bash
npm install vue-lazyload
```

**使用：**

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import VueLazyLoad from 'vue-lazyload'

const app = createApp(App)

app.use(VueLazyLoad, {
  loading: '/images/loading.png', // 加载中占位
  error: '/images/error.png'     // 加载失败占位
})

app.mount('#app')
```

**模板中使用：**

```js
<img v-lazy="/images/photo.jpg" />
```

------

**🔍 三、性能与体验优化**

1. **预加载距离**：在进入视口前一定距离就加载，避免用户看到加载延迟；

   ```css
   rootMargin: '0px 0px 100px 0px'
   ```

2. **占位图优化**：先显示小图或模糊图，再替换高清图；

3. **结合 CDN 压缩**：不同分辨率加载不同清晰度图片；

4. **Skeleton（骨架屏）**：对大量图片场景体验更好。

------



## 八、浏览器

### 1. 浏览器本地存储

| 类型                               | 特点                     | 生命周期                    | 大小限制                | 是否随请求发送到服务器 |
| ---------------------------------- | ------------------------ | --------------------------- | ----------------------- | ---------------------- |
| **Cookie**                         | 早期方案，用于服务端通信 | 可自定义（Expires/Max-Age） | ~4KB                    | ✅ 会自动携带           |
| **localStorage**                   | 永久存储在本地           | 永久（除非手动删除）        | ~5MB                    | ❌ 不会                 |
| **sessionStorage**                 | 临时存储（仅当前标签页） | 关闭标签页即清除            | ~5MB                    | ❌ 不会                 |
| **IndexedDB**                      | 面向对象数据库           | 永久                        | 几百 MB（依浏览器而定） | ❌ 不会                 |
| **Cache Storage (Service Worker)** | 用于 PWA 缓存资源        | 永久                        | 视浏览器而定            | ❌ 不会                 |

#### **1.1 Cookie**

由浏览器自动携带到服务器，用于**会话管理、身份验证**。

```
// 设置 cookie
document.cookie = "user=Tom; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/";

// 读取 cookie
console.log(document.cookie); // "user=Tom"

// 删除 cookie（通过设置过期时间）
document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
```

⚠️ 缺点：

- 容量小（约 4KB）
- 每次请求都会被带上（浪费带宽）
- 操作不太方便（需要自己解析字符串）

----

#### **1.2 localStorage**

用于**长期保存数据**（除非用户手动清除缓存）。

```
// 保存数据
localStorage.setItem('theme', 'dark');

// 读取数据
const theme = localStorage.getItem('theme');

// 删除单个数据
localStorage.removeItem('theme');

// 清空所有
localStorage.clear();
```

✅ 优点：

- 永久保存（浏览器关闭也不会丢）
- 操作简单（key-value 形式）
- 大小限制较大（约 5MB）

❌ 缺点：

- 不能跨浏览器共享
- 不能被服务器端访问

----

#### **1.3 sessionStorage**

与 `localStorage` 类似，但只在当前标签页有效。

```js
sessionStorage.setItem('token', 'abc123');
sessionStorage.getItem('token'); // "abc123"
```

🧠 特点：

- 页面刷新仍然存在
- 关闭标签页后立即清除
- 不同标签页之间相互独立

适合：

- 临时状态保存（如分页位置、未提交表单）

----

#### 1.4 IndexedDB

**IndexedDB 是浏览器提供的一个本地数据库，用于在用户设备上存储大量结构化数据。**

特点总结：

- 是 **NoSQL 键值型数据库**（非关系型）
- 支持 **存储 JavaScript 对象、文件、二进制数据（Blob）**
- 支持 **索引（Index）查询**
- 支持 **事务（Transaction）** 保证操作原子性
- 操作是 **异步** 的，不阻塞主线程

📦 大小限制：通常可以达到几十 MB 甚至上百 MB，比 localStorage 的 5MB 大得多。



**🧩 核心概念介绍**

IndexedDB 由几个重要对象组成 👇

| 概念                         | 说明                          | 类比（SQL数据库）   |
| ---------------------------- | ----------------------------- | ------------------- |
| **Database（数据库）**       | 整个存储空间                  | 数据库              |
| **Object Store（对象仓库）** | 类似表（Table），存放某类数据 | 表                  |
| **Record（记录）**           | 存储的具体对象                | 行（Row）           |
| **Key Path / Key Generator** | 数据主键（唯一标识符）        | 主键（Primary Key） |
| **Index（索引）**            | 辅助搜索字段                  | 索引                |
| **Transaction（事务）**      | 一组原子化操作                | 事务                |
| **Cursor（游标）**           | 遍历数据的指针                | 游标查询            |



**⚙️ IndexedDB 的使用流程**

整个使用过程可以分为五步：

```
1️⃣ 打开或创建数据库
2️⃣ 建表（定义对象仓库和索引）
3️⃣ 向表中添加数据
4️⃣ 查询 / 修改 / 删除
5️⃣ 关闭数据库
```



**🧰 详细使用步骤**

1️⃣ 打开或创建数据库

```js
//使用 `indexedDB.open(name, version)` 创建或打开数据库。
const request = indexedDB.open("MyDB", 1); // 名称MyDB，版本1

// 第一次打开 / 版本号变化时触发，用于初始化数据库结构
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  console.log("数据库升级或创建中");

  // 创建对象仓库（类似于表）
  const store = db.createObjectStore("users", { keyPath: "id" }); 
  // 创建索引（可用于查询）
  store.createIndex("name", "name", { unique: false });
};

// 打开成功
request.onsuccess = (event) => {
  const db = event.target.result;
  console.log("数据库打开成功", db);
};

// 打开失败
request.onerror = (event) => {
  console.error("数据库打开失败", event);
};


//在上述代码当中db都作为一个局部变量存在，这是因为indexDB的打开是一个异步的操作。db可以使用promise的方式写在函数外，确保不为空
//我们在这里给出一个小的封装实例

function openDB(dbName, version = 1) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('users')) {
        const store = db.createObjectStore('users', { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
      }
    };

    request.onsuccess = event => {
      const db = event.target.result;
      console.log('✅ 数据库已打开');
      resolve(db); // <--- 这里返回数据库实例
    };

    request.onerror = event => {
      console.error('❌ 打开数据库失败', event.target.error);
      reject(event.target.error);
    };
  });
}

let dbInstance;

openDB('MyDB', 1).then(db => {
  dbInstance = db;
  console.log('数据库连接成功', dbInstance);
  addUser({ id: 1, name: 'Alice', age: 25 });
});
//之后我们就可以使用dbInstancc来访问IndexDB
```



2️⃣ 创建对象仓库（表）

对象仓库（Object Store）相当于表格，用来存放一类数据。

```js
// 仅在 onupgradeneeded 中创建
const store = db.createObjectStore("users", { keyPath: "id" });
// 或自动生成主键
// const store = db.createObjectStore("users", { autoIncrement: true });
```

为字段建立索引（方便按非主键字段查询）：

```js
store.createIndex("nameIndex", "name", { unique: false });
store.createIndex("emailIndex", "email", { unique: true });
```



3️⃣ 新增数据

```js
const tx = db.transaction("users", "readwrite");
const store = tx.objectStore("users");

store.add({ id: 1, name: "Alice", age: 25 });
store.add({ id: 2, name: "Bob", age: 30 });

tx.oncomplete = () => console.log("数据写入成功");
tx.onerror = () => console.error("写入失败");
```



4️⃣ 读取数据

（1）通过主键查询

```js
const tx = db.transaction("users", "readonly");
const store = tx.objectStore("users");

const req = store.get(1);
req.onsuccess = () => console.log(req.result);
```

（2）通过索引查询

```js
const index = store.index("nameIndex");
const req = index.get("Alice");
req.onsuccess = () => console.log(req.result);
```



5️⃣ 更新数据

更新其实就是再调用一次 `put()`（同键会覆盖）：

```js
const tx = db.transaction("users", "readwrite");
const store = tx.objectStore("users");
store.put({ id: 1, name: "Alice", age: 26 }); // 修改 age
```



6️⃣ 删除数据

```js
const tx = db.transaction("users", "readwrite");
const store = tx.objectStore("users");
store.delete(1);
```



7️⃣ 遍历所有数据（游标 Cursor）

```js
const tx = db.transaction("users", "readonly");
const store = tx.objectStore("users");

store.openCursor().onsuccess = (event) => {
  const cursor = event.target.result;
  if (cursor) {
    console.log(cursor.key, cursor.value);
    cursor.continue(); // 继续遍历下一个
  } else {
    console.log("遍历结束");
  }
};
```



📊 常用操作总结表

| 操作         | 方法                                  | 示例                          |
| ------------ | ------------------------------------- | ----------------------------- |
| 创建数据库   | `indexedDB.open(name, version)`       | `indexedDB.open('DB', 1)`     |
| 创建对象仓库 | `db.createObjectStore(name, options)` | `{ keyPath: 'id' }`           |
| 添加数据     | `store.add()`                         | `store.add({id:1, name:'A'})` |
| 更新数据     | `store.put()`                         | `store.put({id:1, name:'B'})` |
| 查询数据     | `store.get(key)`                      | `store.get(1)`                |
| 删除数据     | `store.delete(key)`                   | `store.delete(1)`             |
| 遍历数据     | `store.openCursor()`                  | 见上例                        |
| 清空仓库     | `store.clear()`                       | `store.clear()`               |



**💡 异步特性与 Promise 封装**

IndexedDB 原生基于事件回调风格，比较繁琐。
 可以通过 `idb` 库简化为 Promise 风格（推荐）👇

```bash
npm install idb
```

```js

import { openDB } from 'idb';

const db = await openDB('MyDB', 1, {
  upgrade(db) {
    db.createObjectStore('users', { keyPath: 'id' });
  },
});

// 写入
await db.put('users', { id: 1, name: 'Alice' });

// 读取
const user = await db.get('users', 1);
console.log(user);
```

🟢 `idb` 是最流行的 IndexedDB 封装库（被 Google 官方推荐）。



**🧩 IndexedDB 的生命周期与升级机制**

- **第一次打开数据库时** → 触发 `onupgradeneeded` → 创建表结构；
- **下次打开相同版本** → 直接进入 `onsuccess`；
- **版本号变更时** → `onupgradeneeded` 再次触发，可执行结构升级。

示例：

```js
const request = indexedDB.open("MyDB", 2); // 版本 2
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore("orders", { keyPath: "id" });
};
```



**📦 IndexedDB 的优缺点**

| 优点               | 缺点                             |
| ------------------ | -------------------------------- |
| 大容量（数百 MB）  | API 原生写法繁琐                 |
| 支持对象存储与索引 | 异步操作复杂                     |
| 事务安全           | 兼容性在旧浏览器较差（IE不支持） |
| 性能高、离线能力强 | 不适合存储简单 KV 数据           |



**🧭  应用场景总结**

| 场景                             | IndexedDB 作用                     |
| -------------------------------- | ---------------------------------- |
| 离线阅读类应用（新闻、博客）     | 缓存内容以支持离线                 |
| 聊天 / 消息系统                  | 缓存消息、历史记录                 |
| Web 办公应用（如 Notion、Figma） | 本地保存草稿、状态                 |
| 图片、地图类应用                 | 缓存二进制资源                     |
| 大数据前端缓存                   | 提升数据加载性能                   |
| PWA 应用                         | 与 Service Worker 结合实现离线访问 |

----



#### 1.5 Cache Storage

> 与 `Service Worker` 搭配，用于缓存静态资源（HTML、JS、CSS、图片等）。

```js
// 示例：在 Service Worker 中
caches.open('my-cache').then(cache => {
  cache.addAll([
    '/index.html',
    '/style.css',
    '/script.js'
  ]);
});
```

⚡️ 特点：

- 支持离线访问

- 用于构建 PWA（Progressive Web App）

- 不受 5MB 限制

  

**🧠 基础 API **

🧱 1️⃣打开或创建一个缓存

```
const cache = await caches.open('my-cache-v1');
```

- 若不存在该缓存，则会自动创建。
- 返回一个 `Cache` 对象。



🧱2️⃣ 缓存请求与响应

```
await cache.add('/index.html'); // 自动请求并缓存响应
await cache.addAll(['/index.html', '/main.js', '/style.css']);
```

或者手动存入响应：

```
const response = await fetch('/data.json');
await cache.put('/data.json', response);
```



🧱 3️⃣匹配并读取缓存

```
const cachedResponse = await cache.match('/data.json');
if (cachedResponse) {
  const data = await cachedResponse.json();
  console.log('来自缓存的数据:', data);
}
```



🧱 4️⃣. 删除缓存条目

```
await cache.delete('/old-file.js');
```



🧱 5️⃣. 删除整个缓存仓库

```
await caches.delete('my-cache-v1');
```



🧱 6️⃣ 获取所有缓存仓库名称

```
const keys = await caches.keys();
console.log(keys); // ["my-cache-v1", "my-cache-v2"]
```



#### 1.6 总结与对比

| 功能         | Cookie         | localStorage       | sessionStorage | IndexedDB | Cache Storage |
| ------------ | -------------- | ------------------ | -------------- | --------- | ------------- |
| 数据类型     | 字符串         | 字符串             | 字符串         | 对象      | 文件资源      |
| 持久性       | 可设置         | 永久               | 会话级         | 永久      | 永久          |
| 大小限制     | ~4KB           | ~5MB               | ~5MB           | 几百MB    | 几百MB        |
| 服务器可访问 | ✅              | ❌                  | ❌              | ❌         | ❌             |
| 操作难度     | 较高           | 简单               | 简单           | 中等      | 中等          |
| 场景         | 登录状态、会话 | 偏好设置、本地缓存 | 临时表单       | 离线数据  | 静态资源缓存  |

------

### 2. Web Worker

>**Web Worker** 是一种在浏览器后台运行 JavaScript 的机制，它允许你在不阻塞主线程（UI线程）的情况下执行计算密集型任务。
>
>✅ Web Worker = 浏览器里的“后台线程”。
>
>🧩 类比理解：
>
>| 角色                | 功能                                   |
>| ------------------- | -------------------------------------- |
>| **主线程**          | 负责渲染 UI、响应用户操作、执行普通 JS |
>| **Web Worker 线程** | 在后台运行 JS，不影响界面流畅度        |

#### 2.1 Web Worker 的基本用法

Web Worker 是一个独立的 JavaScript 文件，
 主线程通过消息机制与它通信。

------

**1️⃣ 主线程：创建 Worker**

```js
// main.js
const worker = new Worker('worker.js');

// 发送数据给 Worker
worker.postMessage({ num: 1000000000 });

// 接收 Worker 的消息
worker.onmessage = event => {
  console.log('来自 worker 的结果：', event.data);
};
```

------

**2️⃣ 子线程（worker.js）**

```js
// worker.js
self.onmessage = event => {
  const { num } = event.data;
  let sum = 0;
  for (let i = 0; i < num; i++) sum += i;
  // 把结果发回主线程
  self.postMessage(sum);
};
```

------

🧩 通信机制

主线程和 Worker 之间通过 `postMessage()` 和 `onmessage` 通信：

```
主线程 <──postMessage──> Worker
```

它们之间的数据是 **拷贝传输**（结构化克隆算法），
 不会共享同一个对象（除非使用 SharedArrayBuffer）。

------

#### 2.2 **Web Worker 的生命周期**

| 阶段   | 方法                          | 说明               |
| ------ | ----------------------------- | ------------------ |
| 创建   | `new Worker(url)`             | 创建后台线程       |
| 通信   | `postMessage()` / `onmessage` | 发送与接收数据     |
| 销毁   | `worker.terminate()`          | 主动结束线程       |
| 自销毁 | `self.close()`                | 子线程内部结束自己 |

------

**🧩 使用场景**

| 场景                 | 说明                                   |
| -------------------- | -------------------------------------- |
| ✅ **计算密集型任务** | 大量循环、数学计算、图像处理、加密解密 |
| ✅ **数据解析**       | JSON 大文件解析、数据压缩、日志分析    |
| ✅ **AI / ML**        | TensorFlow.js 模型推理、音频分析       |
| ✅ **图像与视频处理** | 图片滤镜、WebAssembly 图像渲染         |
| ✅ **地图与地理计算** | 地图路径规划、大量坐标计算             |

------

**Web Worker 的运行原理**

浏览器在创建 Worker 时，会：

1. 启动一个独立的线程；
2. 加载指定的 JS 文件；
3. 在沙箱环境中执行代码；
4. 提供独立的 `self` 全局对象；
5. 与主线程通过异步消息传递通信。

------

#### 2.3 类型与限制

**1️⃣ 普通 Worker**

> 用于运行独立 JS 脚本。

```js
new Worker('worker.js');
```

------

**2️⃣ Shared Worker**

> 多个页面或同源的 tab 可以共享同一个 Worker。

```js
const sharedWorker = new SharedWorker('shared.js');
sharedWorker.port.postMessage('hello');
sharedWorker.port.onmessage = e => console.log(e.data);
```

适合用于：

- 多页面共享状态；
- 跨标签通信；
- 长期后台运行的任务。

------


**Web Worker 的限制**

| 限制                                      | 原因                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| ❌ 不能访问 DOM                            | 防止多线程同时修改界面造成冲突                               |
| ❌ 不能访问 `window`、`document`、`parent` | Worker 运行在独立环境中                                      |
| ✅ 可以访问                                | `self`, `XMLHttpRequest`, `fetch`, `setTimeout`, `IndexedDB` |
| ❌ 同源限制                                | 只能加载同源脚本（除非 CORS 允许）                           |
| 💾 传输开销                                | 大对象通信需要拷贝，会占用内存与时间                         |					

----

#### 2.4 sharedWorker
>SharedWorker（共享工作线程）是一种特殊的 Web Worker，
可以在**同源**的多个浏览上下文（如多个页面、iframe、标签页）之间共享一个后台线程。
也就是说：
**普通的 Web Worker 是 页面级别 的；**
**SharedWorker 是 浏览器同源级别的**， 所以它可以被多个页面同时连接，共享数据或状态。

**sharedWorker解决的问题**
✅ 多页面通信
>多个同源页面（如 a.html、b.html）可以通过同一个 SharedWorker 实现互相通信。
>
>比如一个聊天室网站打开多个窗口时，它们之间仍能共享在线状态。

✅ 2. 数据共享

>多个页面共享同一个内存上下文（如 WebSocket 连接、计算状态等），节省资源。

✅ 3. 长连接共享

>在同源多个页面中共享一个 WebSocket 连接，而不是每个页面都新建一个连接

**工作原理**
启动一个共享线程 new SharedWorker("worker.js")；

各页面通过 worker.port 与该线程建立通信通道；

SharedWorker 脚本通过 onconnect 事件管理多个连接端口；

这些端口之间可以互相广播消息。

**一个使用实例**
假设我们有两个页面：a.html 和 b.html
它们都连接到同一个共享 worker 文件 shared.js。
```html
📄 a.html
<script>
  const worker = new SharedWorker('shared.js');

  // 通过 port 发送消息
  worker.port.postMessage('Hello from A');

  // 接收 SharedWorker 发来的消息
  worker.port.onmessage = (e) => {
    console.log('A 收到:', e.data);
  };
</script>

📄 b.html
<script>
  const worker = new SharedWorker('shared.js');

  worker.port.postMessage('Hi, I am B');

  worker.port.onmessage = (e) => {
    console.log('B 收到:', e.data);
  };
</script>
```

```js
//📄 shared.js（共享线程逻辑）
// 所有连接都会触发 onconnect
onconnect = (event) => {
  const port = event.ports[0];

  console.log('新的连接建立');
  port.postMessage('欢迎新客户端');

  // 监听消息
  port.onmessage = (e) => {
    console.log('SharedWorker 收到:', e.data);
    // 广播给所有连接的客户端
    broadcast(e.data);
  };

  // 保存端口以便广播
  ports.push(port);
};

const ports = [];

function broadcast(message) {
  for (const p of ports) {
    p.postMessage('广播消息: ' + message);
  }
}
```



**⚠️ sharedWorker的注意事项**

1. **Vite 打包时**
    由于 SharedWorker 是一个独立脚本，要用：

   ```js
   new URL('@/workers/sharedWorker.js', import.meta.url)
   ```

   来正确解析路径。

2. **同源限制**
    所有连接到同一个 SharedWorker 的页面必须是 **同协议 + 同域名 + 同端口**。

3. **Safari 不完全支持**
    Safari 和 iOS Safari 对 SharedWorker 支持不佳（截至 2025）。

----

#### 2.5 self

在 **Web Worker / Service Worker / SharedWorker** 环境中，
 `self` 就是代表当前“线程全局作用域”的对象。

⚠️**self**在其中并不需要声明或定义

简单来说：

| 环境           | 全局对象                              |
| -------------- | ------------------------------------- |
| 浏览器主线程   | `window`                              |
| Web Worker     | `self`（即 WorkerGlobalScope）        |
| Service Worker | `self`（即 ServiceWorkerGlobalScope） |
| Shared Worker  | `self`（即 SharedWorkerGlobalScope）  |

也就是说：

> 在 Worker 环境中没有 `window`，
>  所以浏览器提供了 `self` 来表示“当前 worker 的全局上下文”。



**🧠 为什么没有 `window`？**

因为：

- `window` 是浏览器主线程中的顶层对象；
- 而 Worker 运行在独立的线程中（独立于 UI 线程）；
- Worker 不能访问 DOM，也没有 `document`、`alert()`、`window.localStorage` 等；
- 但仍然需要一个“全局对象”来定义事件、方法、变量，于是引入了 `self`。



**⚙️ 不同场景下的 `self`**

| 类型               | 全称                         | 特征             | 常见事件                       |
| ------------------ | ---------------------------- | ---------------- | ------------------------------ |
| **Web Worker**     | `DedicatedWorkerGlobalScope` | 仅供一个页面使用 | `onmessage`, `postMessage`     |
| **Shared Worker**  | `SharedWorkerGlobalScope`    | 多页面共享       | `onconnect`                    |
| **Service Worker** | `ServiceWorkerGlobalScope`   | 充当浏览器代理   | `install`, `activate`, `fetch` |



----



### 3. Service Worker

> **Service Worker 是一种独立于网页运行的后台脚本**，它充当了网页与网络之间的“中间代理层”。
>  它可以拦截所有网页发出的网络请求，并决定：
>
> - 要不要去请求网络；
> - 是否直接返回缓存；
> - 是否在后台更新资源。

换句话说：

> 它让网页拥有「离线工作」的能力

#### 3.1 核心特性

| 特性           | 说明                                                      |
| -------------- | --------------------------------------------------------- |
| **独立线程**   | 不运行在主线程中，不会阻塞 UI                             |
| **可拦截请求** | 可以代理网页的所有网络请求（fetch）                       |
| **可缓存资源** | 可以将 HTML、CSS、JS、图片等静态资源缓存起来              |
| **可离线访问** | 即使用户离线，也能从缓存返回页面                          |
| **事件驱动**   | 通过生命周期事件（install、activate、fetch）控制逻辑      |
| **必须 HTTPS** | 为了安全，Service Worker 只能在 HTTPS 或 localhost 上运行 |
| **异步通信**   | 使用 `postMessage()` 与页面通信                           |



#### 3.2 serviceWorker的生命周期

```
注册 -> 安装 -> 激活 -> 拦截请求
```

**1️⃣ 注册（Register）**

在网页主线程注册一个 Service Worker：

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('✅ Service Worker 注册成功'))
    .catch(console.error);
}
```

👉 浏览器会异步加载 `/sw.js` 脚本，并进入安装阶段。



**2️⃣ 安装（Install）**

Service Worker 第一次安装时触发，用来缓存静态资源。

```js
// sw.js
self.addEventListener('install', (event) => {
  console.log('📦 installing...');
  event.waitUntil(
    caches.open('my-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/main.js'
      ]);
    })
  );
});
```

> ✅ `event.waitUntil()` 告诉浏览器：
>  “等我把缓存加完再算安装完成”。



**3️⃣ 激活（Activate）**

当新版本 Service Worker 替换旧版本时触发，用来清理旧缓存。

```js
self.addEventListener('activate', (event) => {
  console.log('🚀 activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== 'my-cache-v1').map(k => caches.delete(k))
      )
    )
  );
});
```



**4️⃣ 拦截请求（Fetch）**

一旦激活，所有页面的网络请求都会经过它。
 我们可以控制请求的去向：缓存优先 / 网络优先 / 离线回退。

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      // 如果缓存中有，直接返回
      if (cacheRes) return cacheRes;
      // 否则去网络请求并缓存
      return fetch(event.request).then(networkRes => {
        return caches.open('my-cache-v1').then(cache => {
          cache.put(event.request, networkRes.clone());
          return networkRes;
        });
      });
    })
  );
});
```



#### 3.4 Cache Storage API

Service Worker 通常搭配 `Cache Storage` 使用，用于持久化缓存资源。

常见操作：

```js
// 打开一个缓存仓库
const cache = await caches.open('my-cache');

// 添加资源
await cache.addAll(['/index.html', '/main.js']);

// 获取资源
const response = await cache.match('/main.js');

// 删除资源
await cache.delete('/main.js');

// 清理全部缓存
const keys = await caches.keys();
keys.forEach(key => caches.delete(key));
```



**🌐 典型缓存策略模式**

| 策略                       | 描述                         | 适用场景              |
| -------------------------- | ---------------------------- | --------------------- |
| **Cache First**            | 优先读取缓存，失败再请求网络 | 静态资源（图标、JS）  |
| **Network First**          | 优先请求网络，失败用缓存     | 动态内容（新闻、API） |
| **Stale-While-Revalidate** | 先返回缓存，同时异步更新缓存 | 性能优化型应用        |
| **Network Only**           | 总是请求网络                 | 登录验证等实时接口    |
| **Cache Only**             | 永远读缓存                   | 离线专用资源          |

📘 示例（Cache First）：

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(res => res || fetch(event.request))
  );
});
```



----

### 4 浏览器渲染过程

**1️⃣ 用户输入 URL 并发起请求**

- 用户在地址栏输入 URL（如 `https://example.com`）。
- 浏览器解析 URL：
  - 协议（scheme）：`https`
  - 主机名（host）：`example.com`
  - 端口（port）：默认 443（HTTPS）
  - 路径（path）：`/`
  - 查询参数、锚点等



**2️⃣ 浏览器检查缓存**

浏览器首先检查是否命中缓存（HTTP 缓存 / Service Worker 缓存）：

- **Memory Cache**：浏览器内存缓存
- **Disk Cache**：硬盘缓存
- **Service Worker Cache**：缓存的响应（PWA 场景）

如果缓存可用且有效：

- 直接使用缓存，不发网络请求
- 否则进入下一步



**3️⃣ DNS 解析（域名解析）**

- 浏览器先检查本地 DNS 缓存
- 如果没有缓存，向本地 DNS 服务器发送请求
- 得到域名对应的 IP 地址



**4️⃣ TCP 连接**

- 浏览器使用 IP 地址与服务器建立 **TCP 连接**
- 三次握手完成

⚡ HTTPS 场景

- 建立 **TLS/SSL 连接**：
  - 客户端验证服务器证书
  - 协商加密算法
  - 完成安全通道



**5️⃣ 发送 HTTP 请求**

- 浏览器发起 **HTTP GET/POST 请求**
- 包含：
  - 请求头（User-Agent, Cookie, Accept 等）
  - 请求体（POST 时）
- 服务器返回响应：
  - 状态码（200、301、404、500 等）
  - 响应头（Content-Type, Cache-Control 等）
  - 响应体（HTML / JSON / 图片等）



**6️⃣ 浏览器接收 HTML 并开始解析**

- 浏览器创建 **DOM 树（Document Object Model）**
  - HTML 标签 → DOM 节点
- 同时解析 **CSS** → 生成 **CSSOM（CSS Object Model）**
- JS 脚本遇到 `<script>` 标签：
  - 默认阻塞 HTML 解析，下载并执行 JS（可通过 async / defer 优化）
- 构建 **Render Tree（渲染树）**
  - DOM + CSSOM → render tree
  - Render tree 包含可见节点信息（布局 + 样式）



**7️⃣ JS 执行与渲染阻塞**

- JS 会影响 DOM 或 CSSOM（如 `document.write()`、修改样式）
- 因此浏览器必须暂停渲染，直到 JS 执行完（阻塞渲染）
- **优化策略**：
  - `<script defer>`：延迟 JS 执行，HTML 解析完再执行
  - `<script async>`：异步加载，下载完成立即执行，不阻塞 HTML 解析



**8️⃣ 布局（Layout / Reflow）**

- 浏览器计算每个节点的 **位置和尺寸**
- Render Tree 节点 → 页面坐标（x, y, width, height）



**9️⃣ 绘制（Paint / Rasterize）**

- 将每个节点绘制成像素（分层渲染）
- GPU 加速：
  - Chrome 会将部分层（Layers）交给 GPU 进行合成
- Paint 后生成 **位图（Bitmap）**
- 最终输出到屏幕



**🔟 用户看到页面**

- 浏览器完成首次渲染（First Paint / First Contentful Paint）
- 随后可能执行：
  - JS 动态修改 DOM（动态内容）
  - 图片异步加载
  - 懒加载等



**💡 浏览器渲染优化点**

1. **资源并行下载**：
   - HTML 解析同时下载 CSS、JS、图片
2. **渲染流水线**：
   - HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite
3. **缓存利用**：
   - Service Worker、HTTP 缓存、Memory Cache
4. **异步加载**：
   - JS defer/async、懒加载图片
5. **GPU 合成**：
   - CSS transform、opacity 直接用 GPU，不触发重绘



**📌 简单流程图**

```
用户输入 URL
      ↓
浏览器检查缓存（Memory / Disk / SW）
      ↓
DNS 解析 → 获取 IP
      ↓
TCP / TLS 建立连接
      ↓
发送 HTTP 请求 → 服务器响应
      ↓
解析 HTML → 构建 DOM
      ↓
解析 CSS → 构建 CSSOM
      ↓
DOM + CSSOM → Render Tree
      ↓
执行 JS → 可能修改 DOM / CSSOM
      ↓
Layout / Reflow → 计算节点位置尺寸
      ↓
Paint / Composite → 绘制像素到屏幕
      ↓
用户看到页面
```

## 九、网络

### 1. Http缓存

> 浏览器在访问一个资源（如 `index.js`、`style.css` 或图片）时，会先检查本地是否有缓存副本，
>  如果有，就可能直接使用，以**减少网络请求**、**加快页面加载**。

HTTP 缓存主要分为两种机制：

| 类型                            | 是否向服务器发请求 | 是否使用本地缓存           | 主要字段                   |
| ------------------------------- | ------------------ | -------------------------- | -------------------------- |
| **强缓存 (Strong Cache)**       | ❌ 不发请求         | ✅ 直接用本地缓存           | `Expires`、`Cache-Control` |
| **协商缓存 (Negotiated Cache)** | ✅ 发请求           | ✅ 服务器返回 304，不传数据 | `ETag`、`Last-Modified`    |

**1️⃣ 强缓存（Strong Cache）**

🧠 实现原理

浏览器在加载资源时，先根据响应头判断是否命中强缓存：

- **命中** → 直接使用本地缓存，不发送请求；
- **未命中** → 发送网络请求。

📦 关键响应头字段

----

➡️`Expires`（HTTP/1.0）

```
Expires: Wed, 04 Nov 2025 12:00:00 GMT
```

表示缓存到期的**绝对时间**。
 ⚠️ 缺点：依赖客户端时间，如果用户系统时间不准会出问题。

----

- `Cache-Control`（HTTP/1.1）

```
Cache-Control: max-age=3600, public
```

表示缓存有效期（相对时间，单位秒）。
 常见取值：

`max-age=3600` → 缓存 1 小时；

`no-cache` → 不使用强缓存，但仍可协商缓存；

`no-store` → 不使用任何缓存；

`public` → 可以被代理服务器缓存；

`private` → 只能被浏览器缓存。

👉 若两者同时存在，`Cache-Control` 优先。当请求资源时：

1. 查找缓存；
2. 如果未过期（`now < response_time + max-age`），则命中强缓存；
3. 直接从本地取资源，状态码为 **200 (from disk cache / memory cache)**。



**2️⃣ 协商缓存（Negotiated Cache）**

当强缓存失效后，浏览器会发起请求，但会带上**缓存标识字段**，让服务器判断资源是否有变化。

📦 关键请求/响应头字段

**`Last-Modified` / `If-Modified-Since`**

- 服务器响应：

  ```
  Last-Modified: Wed, 03 Nov 2025 10:00:00 GMT
  ```

- 浏览器下次请求时带上：

  ```
  If-Modified-Since: Wed, 03 Nov 2025 10:00:00 GMT
  ```

服务器对比文件的最后修改时间：

- 若未修改 → 返回 `304 Not Modified`；
- 若修改 → 返回新的资源内容（200）。

⚠️ 缺点：时间精度不高（秒级），文件即使内容未变但时间变化也会被认为不同。



**`ETag` / `If-None-Match`**

- 服务器响应：

  ```
  ETag: "abc123"
  ```

  这是文件内容的唯一标识（hash 值）。

- 浏览器下次请求时带上：

  ```
  If-None-Match: "abc123"
  ```

服务器比较：

- 若一致 → 返回 `304 Not Modified`
- 若不一致 → 返回新内容。

⚙️ `ETag` 优先级高于 `Last-Modified`。



3️⃣完整的缓存判断流程图

```
        ┌───────────────────────────────┐
        │        请求资源               │
        └─────────────┬─────────────────┘
                      ↓
         是否命中强缓存？(Cache-Control / Expires)
                      │
            ┌─────────┴─────────┐
            │                   │
           是                   否
            │                   │
 使用本地缓存(200 from cache)   发送请求
                                │
                                ↓
             是否命中协商缓存？(ETag / Last-Modified)
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
                 是                           否
                  │                           │
          返回304使用缓存              返回200新资源
```



区别总结

| 对比项         | 强缓存                      | 协商缓存                 |
| -------------- | --------------------------- | ------------------------ |
| 是否发请求     | ❌ 否                        | ✅ 是                     |
| 服务端是否参与 | 否                          | 是                       |
| 状态码         | 200 (from cache)            | 304                      |
| 关键字段       | `Expires`, `Cache-Control`  | `Last-Modified`, `ETag`  |
| 优先级         | `Cache-Control` > `Expires` | `ETag` > `Last-Modified` |



开发实践建议

✅ **推荐设置：**

```yaml
Cache-Control: max-age=31536000, immutable
ETag: "hash-value"
```

✅ **构建时配合文件指纹（hash）**
 前端打包时生成：

```
app.abc123.js
app.abc123.css
```

----



### 2. Http1/2/3

#### 2.1 HTTP 协议演化背景

HTTP（HyperText Transfer Protocol）是浏览器和服务器之间通信的协议。
 它并非独立存在，而是依赖底层传输层协议：

| HTTP 版本     | 底层传输协议         |
| ------------- | -------------------- |
| HTTP/1.0、1.1 | TCP                  |
| HTTP/2        | TCP                  |
| HTTP/3        | **QUIC（基于 UDP）** |



#### 2.2 HTTP/1.x：性能瓶颈的起点

1️⃣ 特点

- **基于 TCP + 请求-响应模型**
- **短连接（HTTP/1.0）**：每次请求都要重新建立 TCP 连接。
- **长连接（HTTP/1.1）**：`Connection: keep-alive`，可以复用 TCP 连接。
- **管线化（pipelining）**：允许多个请求同时发送，但仍存在队头阻塞（Head-of-Line Blocking）。

2️⃣ 核心问题

| 问题             | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| **队头阻塞**     | 同一个 TCP 连接内，请求是按顺序响应的，一个慢响应会阻塞后续响应。 |
| **连接资源浪费** | 浏览器为并发加载资源通常会开 6~8 个 TCP 连接（同域）。       |
| **头部冗余**     | 每次请求都会携带重复的 HTTP Header（如 Cookie、User-Agent）。 |
| **文本协议**     | 报文无法被压缩，浪费带宽。                                   |

⚠️ 例子

一个网页包含 100 张图片，HTTP/1.1 可能会：

- 同时打开多个 TCP 连接；
- 每个连接只能排队串行返回响应；
- 导致网络资源浪费、加载慢。



#### 2.3 HTTP/2：多路复用的时代

HTTP/2 仍然基于 TCP，但对传输层以上的部分进行了**二进制分帧重构**。

1️⃣ 核心改进

| 特性                          | 作用                                                         | 类比说明                                   |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| **二进制分帧**                | HTTP/2 将请求与响应拆分成二进制帧（Frame），数据结构化、可压缩。 | 类似把文本换成更高效的二进制协议。         |
| **多路复用（Multiplexing）**  | 多个请求共用一个 TCP 连接，每个流（Stream）有独立 ID，不互相阻塞。 | 类似一条高速公路多车道行驶。               |
| **头部压缩（HPACK）**         | 利用静态表与动态表存储头字段，减少重复 Header 传输。         | 类似只传变化的部分。                       |
| **服务器推送（Server Push）** | 服务器可在客户端请求前推送资源。                             | 比如请求 HTML 时，服务器提前推送 CSS、JS。 |

2️⃣ 解决的问题

✅ 解决了 HTTP/1 的**队头阻塞（应用层）**
 ✅ 降低了请求头重复传输的成本
 ✅ 显著减少 TCP 连接数量

⚠️ 但仍存在问题

HTTP/2 依旧基于 TCP，因此：

- 若一个 TCP 包丢失，会导致**整个连接内的所有请求阻塞（TCP 层队头阻塞）**。
- TCP 握手 + TLS 握手仍需多次往返（RTT）。



#### 2.4 HTTP/3：基于 QUIC 的新时代

1️⃣ 基础：QUIC 协议（Quick UDP Internet Connections）

- 由 Google 开发；
- 基于 **UDP**；
- 集成了 **TLS 1.3**；
- 目标：解决 TCP 无法彻底解决的性能瓶颈。

2️⃣ 核心特性

| 特性                                | 说明                                                    |
| ----------------------------------- | ------------------------------------------------------- |
| **基于 UDP，用户态实现可靠传输**    | 不再受 TCP 队头阻塞影响；每个流独立传输。               |
| **0-RTT/1-RTT 握手**                | TLS 1.3 集成，首次连接仅需 1 次往返，后续连接可 0-RTT。 |
| **多路复用更彻底**                  | 丢包只影响单个流，不影响整个连接。                      |
| **连接迁移 (Connection Migration)** | 支持网络切换（如从 Wi-Fi → 4G）保持连接不断。           |
| **内建加密**                        | 所有连接强制加密（不再分明文/HTTPS）。                  |

3️⃣ 优势总结

| 对比项   | HTTP/2 (TCP) | HTTP/3 (QUIC/UDP)    |
| -------- | ------------ | -------------------- |
| 队头阻塞 | TCP 层仍存在 | 无（每个流独立）     |
| 握手延迟 | 多个 RTT     | 0-RTT/1-RTT          |
| 连接迁移 | 不支持       | ✅ 支持               |
| 加密     | 可选（TLS）  | 内置（强制加密）     |
| 性能     | 较高         | 更高（移动网络友好） |



#### 2.5 三代协议核心区别总表

| 对比维度   | HTTP/1.1    | HTTP/2         | HTTP/3         |
| ---------- | ----------- | -------------- | -------------- |
| 传输协议   | TCP         | TCP            | UDP (QUIC)     |
| 连接复用   | 多连接      | 单连接多路复用 | 单连接多路复用 |
| 队头阻塞   | 应用层      | TCP 层         | 无             |
| 报文格式   | 文本        | 二进制帧       | 二进制帧       |
| 头部压缩   | 无          | HPACK          | QPACK          |
| 加密       | 可选（TLS） | 可选（TLS）    | 默认加密       |
| 连接建立   | 多次握手    | 多次握手       | 0-RTT / 1-RTT  |
| 服务器推送 | ❌           | ✅              | ✅              |
| 连接迁移   | ❌           | ❌              | ✅              |
| 性能表现   | 低          | 高             | 更高           |



💡 形象比喻总结

| 协议         | 类比场景                                               |
| ------------ | ------------------------------------------------------ |
| **HTTP/1.1** | 多条单车道公路（每辆车排队堵车）                       |
| **HTTP/2**   | 一条多车道高速公路（同一连接内多车并行，但遇事故全堵） |
| **HTTP/3**   | 多条独立车道的悬空轨道（某条轨道出问题不影响其他）     |



✅ 实际应用情况（截至 2025）

| 协议     | 支持情况                                                     |
| -------- | ------------------------------------------------------------ |
| HTTP/1.1 | 仍是最广泛支持（几乎所有服务器）                             |
| HTTP/2   | 主流浏览器、CDN、Nginx、Node.js 均支持                       |
| HTTP/3   | Chrome、Edge、Safari 均默认启用；Cloudflare、Google、AWS 等已普遍支持 |
