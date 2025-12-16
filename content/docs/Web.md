---
title: 前端
date:  2025/12/16
description: 前端学习指南
image: /blogs-img/web.png
alt: froent study
ogImage: /blogs-img/web.png
tags: ['promethues']
published: true
---

# 一、JS相关

## 1. 数据类型

### 1.1 JavaScript 基本数据类型

**1️⃣ `Number`**

表示所有数字（包括整数、浮点数、NaN、Infinity）。

```
let a = 10;
let b = 3.14;
let c = NaN;        // 不是一个数字
let d = Infinity;   // 无穷大
```



**2️⃣ `String`（字符串类型）**

表示一段文本字符，使用 `'...'`、`"..."`、``...``。

```
let s = "hello";
let name = `Liu`;   // 模板字符串
```

字符串是**不可变**的，每次修改都会产生新字符串。



**3️⃣ `Boolean`（布尔类型）**

只有两个值：

```
true
false
```

用于逻辑判断。



**4️⃣ `Undefined`**

表示声明了变量但**没有赋值**。

```
let x;
console.log(x);  // undefined
```



**5️⃣ `Null`**

表示**空值**、刻意清空或不存在的对象。

```
let obj = null;
```

`typeof null === "object"` 是 JavaScript 的历史遗留 bug。



**6️⃣ `Symbol`（ES6 新增）**

表示**唯一且不可重复**的值，常用于对象的私有属性。

```
const id = Symbol("id");
const obj = {
  [id]: 123
};
```

每个 Symbol 都是独一无二的。



**7️⃣`BigInt`（大整数类型，ES2020）**

用于表示超过 `Number` 安全范围的整数。

```
let big = 123456789012345678901234567890n;
```

BigInt 必须带 `n` 后缀。

----

### 1.2 引用数据类型

JavaScript 中除 **基本类型（Primitive Types）** 之外，其余的都是 **引用类型**。常见的引用类型包括：

1️⃣ **Object（对象）**

最常用的引用类型，所有非基本类型都基于 Object。

```
const obj = { a: 1, b: 2 };
```

对象内部以 **键值对结构** 存储，可动态添加、删除属性。



2️⃣**Array（数组）**

数组本质上也是对象，但更适用于有序数据。

```
const arr = [1, 2, 3];
```

它是一个带有特殊属性（如 length）的对象，并且提供大量方法如 `map`、`filter` 等。



3️⃣ **Function（函数）**

JavaScript 中函数也是一种对象，称为 *可调用对象*。

```
function foo() {}
const bar = () => {};
```

函数对象不仅能被调用，还有自己的属性（如 `name`、`length`）。



4️⃣ **Date（日期）**

用于操作日期和时间。

```
const today = new Date();
```



5️⃣ **RegExp（正则表达式）**

```
const reg = /abc/gi;
```



6️⃣ **Map / Set**

ES6 引入的新集合类型：

**Map**

键值对结构，但 key 可以是任何类型（包括对象）。

```
const map = new Map();
map.set({ id: 1 }, "value");
```

**Set**

不重复值集合。

```
const set = new Set([1, 2, 2]);
```



7️⃣ **WeakMap / WeakSet**

与 Map/Set 类似，但 key 必须是对象，并且是弱引用，不会阻止垃圾回收。



**📌 引用类型的关键特点**

1. **存储方式不同（堆 vs 栈）**

基本类型：

➡️ 直接存储在 **栈内存** 中
➡️ 变量保存的是 *值本身*

引用类型：

➡️ 数据存储在 **堆内存** 中

➡️ 变量保存的是 *指向对象的引用地址*（指针）



2. **复制方式不同（深浅拷贝问题）**

```
const a = { name: "Liu" };
const b = a;
b.name = "Alan";

console.log(a.name);  // "Alan"
```

因为 a 与 b 指向同一个堆地址。



3. **比较方式不同**

引用类型使用 **引用地址** 比较，而不是结构内容。

```
{} === {}   // false
[] === []   // false
```



### 1.3 类型判断方式

JavaScript 类型判断方式主要包含：`typeof`、`instanceof`、`Object.prototype.toString`
 以及它们各自的优缺点、使用场景、底层原理。

1️⃣ **typeof：判断基本类型（但有缺陷）**

语法：

```
typeof value
```

✔ 能正确判断的类型：

```
typeof 1 === "number"
typeof "abc" === "string"
typeof true === "boolean"
typeof undefined === "undefined"
typeof Symbol() === "symbol"
typeof 123n === "bigint"
typeof function(){} === "function"
```

❌ 不能正确判断的地方：

```
typeof null === "object"   // ❌ bug，历史遗留问题
typeof [] === "object"     // ❌ 判不出数组
typeof {} === "object"     // ✔ 但和数组分不清
typeof new Date() === "object"
typeof /a/g === "object"
```

⭐ 使用场景：

- 判断**基本类型**（string/number/boolean...）
- 判断是否是 function



2️⃣ **instanceof：判断对象类型（基于原型链）**

语法：

```
value instanceof Constructor
```

✔ 能正确判断：

```
[] instanceof Array        // true
{} instanceof Object       // true
new Date() instanceof Date // true
```

⭐ instanceof 的原理

> 判断 `value.__proto__` 是否能在构造函数的 `prototype` 链上找到。

源码解释（等价逻辑）：

```
value instanceof Constructor
// roughly equals
Constructor.prototype.isPrototypeOf(value)
```

❌ 不能用于判断基本类型：

```
1 instanceof Number       // false
"abc" instanceof String   // false
```

❌ 跨 iframe / 多全局环境会失效

```
value instanceof Array // false（跨 window 环境）
```

⭐ 使用场景：

- 判断对象的具体构造函数类型
- 用在 class / 自定义对象类型判断



3️⃣ **Object.prototype.toString.call(): 最准确的类型判断方式**

最常用于深度判断类型：

语法：

```js
Object.prototype.toString.call(value)
```

示例：

```js
Object.prototype.toString.call(1)            // "[object Number]"
Object.prototype.toString.call("a")          // "[object String]"
Object.prototype.toString.call(null)         // "[object Null]"
Object.prototype.toString.call(undefined)    // "[object Undefined]"
Object.prototype.toString.call([])           // "[object Array]"
Object.prototype.toString.call({})           // "[object Object]"
Object.prototype.toString.call(new Date())   // "[object Date]"
Object.prototype.toString.call(/a/)          // "[object RegExp]"
Object.prototype.toString.call(() => {})     // "[object Function]"
Object.prototype.toString.call(new Map())    // "[object Map]"
Object.prototype.toString.call(new Set())    // "[object Set]"
```

✔ 为什么它是最准的？

因为这是 JS 内部 `[[Class]]` 属性的官方展示方式，不会受原型链、跨 iframe 影响。

⭐ 使用场景：

- 判断所有类型（尤其是数组、null、Date、RegExp）
- 完全准确 → 面试官最喜欢



🔥 三者对比总结表（最重要面试知识点）

| 方法                          | 能判断的类型           | 是否准确              | 场景                               |
| ----------------------------- | ---------------------- | --------------------- | ---------------------------------- |
| **typeof**                    | 基本类型 + function    | ❌ 无法识别 null/array | 快速判断基本类型、function         |
| **instanceof**                | 对象类型（基于原型链） | ❌ 跨 iframe 失效      | 判断构造函数类型（Array、Date 等） |
| **Object.prototype.toString** | 所有类型               | ✔ 最准确              | 最通用、最可靠                     |



**🔥 实际开发中怎么用？（公式）**

🚀 判断数组（最经典）

✔ 推荐：

```js
Array.isArray(value)
```

✔ 或：

```js
Object.prototype.toString.call(value) === "[object Array]"
```

🚀 判断 null

```js
Object.prototype.toString.call(value) === "[object Null]"
```

🚀 判断对象（纯对象）

```js
Object.prototype.toString.call(value) === "[object Object]"
```

🚀 判断日期

```js
value instanceof Date
Object.prototype.toString.call(value) === "[object Date]"
```

🚀 判断函数

```js
typeof value === "function"
```



🔥 一句话带你记住：

- **typeof**：判断 **基本类型**
- **instanceof**：判断 **对象是否由某构造函数创建**
- **toString.call**：判断 **所有类型，最准确**

## 2. 隐式转换

### 2.1 JS 转换规则

JavaScript 的隐式转换主要涉及三种方向：

**1️⃣ 转换为 Boolean（布尔值）**

以下 7 种值会被转为 `false`，其他全部为 `true`：

| 假值（Falsy） | 说明           |
| ------------- | -------------- |
| `false`       | 本身就是 false |
| `0`           | 数字零         |
| `-0`          | 负零           |
| `""`          | 空字符串       |
| `null`        | 空             |
| `undefined`   | 未定义         |
| `NaN`         | 不是数字       |

**示例：**

```
if ("") console.log("不会执行");
if ("hello") console.log("会执行");
```



**2️⃣ 转换为 Number**

常见场景：

**（1）字符串 → 数字**

```
Number("123")  // 123
Number("")     // 0
Number("   ")  // 0（注意，这点容易忽略）
Number("123px") // NaN
```

**（2）布尔 → 数字**

```
Number(true)  // 1
Number(false) // 0
```

**（3）null / undefined**

```
Number(null)      // 0
Number(undefined) // NaN
```

**（4）对象 → 数字**

对象先执行：

```
valueOf() → primitive
toString() → primitive
再转为 number
Number([])   // 0
Number([1])  // 1
Number({})   // NaN
```



**3️⃣转换为 String（字符串）**

```
String(123)   // "123"
String(true)  // "true"
String(null)  // "null"
String([])    // ""
String([1,2]) // "1,2"
```



✅ 常见隐式转换场景（重点）

**1. 加号运算（+）**

规则非常重要：

**如果其中一个是字符串 → 字符串拼接**

```
1 + "2"   // "12"
true + "1" // "true1"
```

**如果都是数字 → 数字相加**

```
1 + 2 // 3
```

**对象参与 + 运算 → 转为原始类型**

```
[] + []       // "" + "" → ""
[] + {}       // "" + "[object Object]"
{} + []       // 0
[] + 1				//"1"
{} + 1				//1 这是因为js语法解析到{}时，将其作为了一个空代码块
( {} + 1 )		//'[object Object]1'
```



**2. 减号（-）、乘号（\*）、除号（/）始终转为数字**

```
"3" - 1   // 2
"3" * 2   // 6
"3" / 2   // 1.5
"3px" - 1 // NaN
```

也就是说，只有 `+` 会触发字符串拼接，其他都转数字。



**3. 比较运算 ==（宽松相等）**

JS 中最混乱的部分之一。

**（1）数字 == 字符串 → 字符串转数字**

```
1 == "1"  // true
```

**（2）布尔 == 数字 → 布尔转数字**

```
true == 1  // true
false == 0 // true
```

**（3）null 只与 undefined 相等**

```js
null == undefined // true
null == 0         // false
undefined == 0    // false
```

**（4）对象 == 原始值：对象先转换为原始值**

```js
[] == ""  // true
[] == 0   // true
[1] == 1  // true
```

**（5）特例：**

```js
[] == ![] // true

// 分析流程：
![] → false
[] == false
false → 0
[] → 0
0 == 0 → true
```



**⚠️ Falsy（假值）只有 7 个**

```js
false
0
-0
""
null
undefined
NaN
```

----

### 2.2 原始值转换

> JavaScript 共有 **7 种原始类型**：
>
> | 类型          | 示例           | 说明   |
> | ------------- | -------------- | ------ |
> | **number**    | `1, 3.14`      | 数字   |
> | **string**    | `"hello"`      | 字符串 |
> | **boolean**   | `true / false` | 布尔   |
> | **null**      | `null`         | 空值   |
> | **undefined** | `undefined`    | 未定义 |
> | **symbol**    | `Symbol()`     | 唯一值 |
> | **bigint**    | `10n`          | 大整数 |



**1️⃣ 为什么对象要执行 ValueOf / toString？**

当对象参与运算，例如：

```js
{} + 1
[1,2] + 3
```

JS 需要把对象变成 **原始值（number/string）** 才能计算。

这个转换过程叫：

> **ToPrimitive（对象 → 原始类型）**

执行顺序如下：

```
如果对象自定义了 Symbol.toPrimitive：
    直接调用它
否则：
    如果是数字运算 → 调用 valueOf() → 再调用 toString()
    如果是字符串运算 → 调用 toString() → 再调用 valueOf()
```



**2️⃣ 完整优先级（最重要！）**

🥇 1. **Symbol.toPrimitive**

对象有 `Symbol.toPrimitive` 时，**最高优先级**，直接用它的返回值。

```js
const obj = {
  [Symbol.toPrimitive](hint) {
    console.log(hint)
    return 10;
  }
}

console.log(obj + 1); // 输出 hint: "default" → 11
```

hint 有三种：

- `number`    → 数字运算
- `string`    → 字符串上下文
- `default`   → 加号 + 等不明确情况



**🥈 2. 没有 Symbol.toPrimitive → 执行 valueOf()**

valueOf 只能返回：

- 原始值（如 1、"abc"）
- 或者对象（继续下一步）

常见例子：

```js
const obj = {
  valueOf() {
    return 20;
  }
}

console.log(obj + 1) // 21（直接用 valueOf 结果）
```



**🥉 3. valueOf 不行 → 调用 toString()**

如果 valueOf 返回对象，那么继续执行 toString。

```js
const obj = {
  valueOf() {
    return {}; // 无效
  },
  toString() {
    return "100";
  }
}

console.log(obj + 1) // "1001"（字符串拼接）
```



**🟦 不同运算符的 ToPrimitive 顺序**

JS 根据运算类型决定 ToPrimitive 的 hint：

| 运算类型            | hint      | 调用顺序                             |
| ------------------- | --------- | ------------------------------------ |
| 数字运算（-, *, /） | "number"  | valueOf → toString                   |
| 字符串运算          | "string"  | toString → valueOf                   |
| + 加号（特殊）      | "default" | 类似 number，一般 valueOf → toString |

特别注意：

加号不是纯数字运算，所以 hint 是 `"default"`。



**🧪 经典例子**

❗例 1：对象相加

```
{} + {}
```

不同解释器下结果会不同，但通常：

```
"[object Object][object Object]"
```

原因：

1. 对象没有 valueOf 结果（返回原对象）
2. 调用 toString → "[object Object]"
3. 拼接成字符串



❗例 2：数组的 valueOf 和 toString

数组的 valueOf 返回 **自身（对象）**，无效。

所以数组只能用 toString 转换：

```
[] + 1        // "" + 1 → "1"
[1,2] + 3     // "1,2" + 3 → "1,23"
```



❗例 3：对象控制自身的运算结果

```js
let obj = {
  value: 0,
  valueOf() {
    return ++this.value;
  }
}

console.log(obj == 1); // true
console.log(obj == 2); // true
console.log(obj == 3); // true
```

利用 valueOf 可以让对象“变魔术”。



❗例 4：更现代的方式：Symbol.toPrimitive

```js
let obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return 100;
    if (hint === "string") return "Hello";
    return 50; // default
  }
}

console.log(+obj);     // 100
console.log(String(obj)); // "Hello"
console.log(obj + 1);  // 51
```

## 3. 继承

JS 的“继承”**不是一套，而是多套历史叠加的机制**。如果你只记住一句话：

> **JavaScript 的继承本质是：对象通过「原型链」复用属性和方法。**

⚠️ 先搞清楚：JS 和 Java 的继承“完全不是一回事”

| 语言       | 继承方式              |
| ---------- | --------------------- |
| Java / C++ | 类 → 类（编译期）     |
| JavaScript | 对象 → 对象（运行期） |

JS 中：

- 没有“真正的类”（ES6 之前）
- **一切继承都靠对象的 `[[Prototype]]`**

----

### 3.1 原型与原型链

**1️⃣ 三个你必须分清的东西**

```js
function Person() {}
const p = new Person()
```

（1）`Person.prototype`

- 构造函数的 **原型对象**
- 所有实例共享的方法放这里

（2）`p.__proto__`

- 实例内部的隐藏指针
- 指向 `Person.prototype`

（3）`constructor`

- 指回构造函数

关系图：

```
child
  └── __proto__ → Parent.prototype
                        └── constructor → Parent
                        └── __proto__ → Object.prototype
```

------

**2️⃣ 原型链查找规则**

```js
p.say()
```

查找顺序：

1. p 自身
2. p.**proto**
3. p.**proto**.**proto**
4. ...直到 null

👉 **这条链就是“继承链”**

------

### 3.2 ES5 时代的继承方式

**1️⃣ 原型链继承**

```js
function Parent() {
  this.name = 'parent'
}

Parent.prototype.say = function () {
  console.log(this.name)
}

function Child() {}

Child.prototype = new Parent()
```

优点

- 简单
- 方法复用

缺点（致命）

- 引用类型共享
- 无法传参

------

**2️⃣ 构造函数继承（借用构造函数）**

```js
function Parent(name) {
  this.name = name
}

function Child(name) {
  Parent.call(this, name)
}
```

优点

- 可以传参
- 不共享引用属性

缺点

- **方法不能复用**
- 每个实例一份方法

------

**3️⃣ 组合继承**

```js
function Parent(name) {
  this.name = name
}

Parent.prototype.say = function () {}

function Child(name) {
  Parent.call(this, name)
}

Child.prototype = new Parent()
```

问题

- Parent 构造函数 **调用两次**
- 多余属性

------

**4️⃣ 寄生组合继承（最优 ES5 方案）**

```js
// ====== 父类构造函数 ======
function Parent(name) {
  this.name = name          // 实例属性，每个对象独立
  this.colors = ['red', 'blue'] // 引用类型属性
}

// 父类原型方法
Parent.prototype.sayName = function() {
  console.log('My name is ' + this.name)
}

// ====== 子类构造函数 ======
function Child(name, age) {
  // 借用构造函数：解决引用类型属性共享问题
  Parent.call(this, name)
  this.age = age
}

// ====== 寄生组合继承核心 ======
// 创建一个父类原型的副本，并赋给子类原型
Child.prototype = Object.create(Parent.prototype)

// 修正 constructor 指向
Child.prototype.constructor = Child

// 给子类原型添加方法
Child.prototype.sayAge = function() {
  console.log('My age is ' + this.age)
}

// ====== 测试 ======
const child1 = new Child('Alice', 10)
const child2 = new Child('Bob', 12)

// 测试实例属性独立性
child1.colors.push('green')
console.log(child1.colors) // ['red', 'blue', 'green']
console.log(child2.colors) // ['red', 'blue']

// 测试原型方法继承
child1.sayName() // My name is Alice
child2.sayName() // My name is Bob
child1.sayAge()  // My age is 10
child2.sayAge()  // My age is 12

// 测试原型链关系
console.log(child1 instanceof Child)  // true
console.log(child1 instanceof Parent) // true

```

✅ `Object.create` 是 ES5 引入的一个方法，本质上就是**创建一个新对象，并指定它的原型**。

1️⃣ 语法

```
const obj = Object.create(proto, [propertiesObject])
```

- `proto`：新对象的原型对象
- `propertiesObject`（可选）：类似 `Object.defineProperties` 的属性描述符对象

2️⃣ 简单例子

```
const parent = { name: 'parent' }
const child = Object.create(parent)

console.log(child.name) // 'parent'
console.log(child.__proto__ === parent) // true
```

原理：

1. `child.__proto__` 指向 `parent`
2. 访问不存在的属性 → 浏览器沿原型链查找
3. 原型链就是“继承”的本质

------

### 3.3 ES6 class 继承

**1️⃣** 基本用法

```js
class Parent {
  constructor(name) {
    this.name = name
  }

  say() {
    console.log(this.name)
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}
```

------

**2️⃣ `extends` 做了什么？**

```text
Child.__proto__ === Parent        // true（静态继承）
Child.prototype.__proto__ === Parent.prototype // true（实例继承）
```

👉 **双重原型链**

------

**3️⃣ 为什么必须先 `super()`？**

```js
constructor() {
  super()
  this.x = 1
}
```

原因：

- `super()` 本质是 `Parent.call(this)`
- 不调用就没有 `this`

### 3.4 多继承

在 JavaScript 中，**严格意义上是不支持多继承的**。也就是说，一个对象或类**只能有一个直接原型**（一个 `[[Prototype]]`），所以无法像 Java 或 C++ 那样直接继承多个父类。

但 JS 有多种方式可以**实现“类似多继承”的效果**，尤其在 ES6 之后更加优雅。我们从底层原理和实际方案来看。

**⚠️ 为什么 JS 不支持多继承？**

JS 的继承本质是**原型链继承**：

```text
child.__proto__ → Parent.prototype → Object.prototype → null
```

- `__proto__` 是一个指针
- 一条对象只能指向**一个原型**
- 所以无法有两个父类直接被继承

------

**常见解决方案**

**1️⃣ 混入（Mixin）**

**思想**：把其他对象的方法“拷贝”到子类原型上

```js
const canEat = {
  eat() { console.log('Eating') }
}

const canWalk = {
  walk() { console.log('Walking') }
}

class Person {
  constructor(name) {
    this.name = name
  }
}

// 混入方法
Object.assign(Person.prototype, canEat, canWalk)

const p = new Person('Alice')
p.eat()  // Eating
p.walk() // Walking
```

- ✅ 可以模拟多继承行为
- ✅ 简单，企业项目常用
- ❌ 不能继承父类构造函数属性，需要手动初始化

------

**2️⃣ 高阶函数式继承（Mixin 函数）**

```js
const Eater = (Base) => class extends Base {
  eat() { console.log('Eating') }
}

const Walker = (Base) => class extends Base {
  walk() { console.log('Walking') }
}

// 基础类
class Person {
  constructor(name) { this.name = name }
}

// 多继承组合
class SuperPerson extends Eater(Walker(Person)) {}

const sp = new SuperPerson('Bob')
sp.eat()  // Eating
sp.walk() // Walking
```

- ✅ 保留了构造函数链
- ✅ ES6 风格
- ✅ 企业中很多库（如 React 高阶组件 HOC）就是这种思想
- ❌ 构造函数初始化顺序需要注意

------

**3️⃣ 组合优先于继承（推荐）**

- 面向对象设计里 **“组合优于继承”**
- 通过对象属性引用其他对象来复用功能，而不是继承

```js
function createPerson(name) {
  return {
    name,
    eater: { eat() { console.log('Eating') } },
    walker: { walk() { console.log('Walking') } }
  }
}

const p = createPerson('Alice')
p.eater.eat()
p.walker.walk()
```

- ✅ 非常灵活
- ✅ 避免深层原型链复杂性
- ✅ React / Vue / MobX 代码里很常见

------

**总结**

| 方式               | 支持“多继承”？ | 优缺点                         |
| ------------------ | -------------- | ------------------------------ |
| 原型链继承         | ❌              | 单一原型链，简单               |
| 混入 Object.assign | ✅（方法层面）  | 不继承构造函数属性             |
| 高阶函数式 Mixin   | ✅              | 可以继承构造函数，但需注意顺序 |
| 组合对象           | ✅              | 更灵活，推荐现代 JS            |

------

## 4. 函数柯里化

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

```js
const add = a => b => a + b;

console.log(add(2)(3)); // 5
```

> 箭头函数写法更加简洁，每一层都是一个返回函数。



3️⃣ 多参数函数柯里化

```js
const multiply = a => b => c => a * b * c;

console.log(multiply(2)(3)(4)); // 24
```

- 这里函数 `multiply` 一次只能接收一个参数，但可以链式调用。
- 柯里化的好处：**可以灵活复用参数**。



4️⃣ 实际应用场景

**a. 参数复用**

```js
const add10 = add(10);
console.log(add10(5)); // 15
console.log(add10(20)); // 30
```

- 先固定一个参数 `10` → 得到一个新的函数 `add10`，可以多次调用。

**b. 函数组合 & 高阶函数**

```js
const log = prefix => message => console.log(`${prefix}: ${message}`);

const info = log("INFO");
const warn = log("WARN");

info("This is info"); // INFO: This is info
warn("This is warning"); // WARN: This is warning
```

- 柯里化让我们更容易**封装功能、固定参数**。



5️⃣ 通用柯里化工具函数

```js
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

    ```js
    function add(a) { return function(b) { return a + b; } }
    ```

  - 箭头函数：

    ```js
    const add = a => b => a + b;
    ```

- **优势**：

  1. 参数复用（partial application）
  2. 高阶函数组合
  3. 更灵活、函数式编程风格

----



## 1. 设计模式

### 1.1 创建型设计模式

**1️⃣ 工厂模式（Factory Pattern）**

👉 **用于封装创建对象的逻辑，让创建对象更灵活。**

示例：创建不同类型的用户

```js
class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
}

class UserFactory {
  static createUser(name, role) {
    switch (role) {
      case 'admin':
        return new User(name, 'admin');
      case 'editor':
        return new User(name, 'editor');
      default:
        return new User(name, 'guest');
    }
  }
}

const u1 = UserFactory.createUser('Tom', 'admin');
const u2 = UserFactory.createUser('Jerry', 'guest');
```

📌 **什么时候用？**
 角色、类型不确定，未来可能扩展时。



**2️⃣ 单例模式（Singleton Pattern）**

👉 **全局只有一个实例。常用于全局状态管理。**

示例：全局缓存管理

```js
class Cache {
  constructor() {
    if (Cache.instance) return Cache.instance;
    this.store = {};
    Cache.instance = this;
  }
  set(key, value) {
    this.store[key] = value;
  }
  get(key) {
    return this.store[key];
  }
}

const c1 = new Cache();
const c2 = new Cache();
console.log(c1 === c2); // true
```

📌 **什么时候用？**
 全局配置、Vuex Store、EventBus、全局缓存。



**3️⃣  原型模式（Prototype）**

👉 **通过对象克隆创建新对象，性能好。**

示例：创建多个相似对象

```js
const personPrototype = {
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

const person = Object.create(personPrototype);
person.name = 'Tom';
person.greet();
```



### 1.2 结构型设计模式

**1️⃣ 适配器模式（Adapter）**

👉 **把一个类的接口转换成另一个期望的接口。**

示例：适配旧接口数据结构

```js
const oldApiData = { username: 'Tom', age: 19 };

function adapter(data) {
  return {
    name: data.username,
    age: data.age
  };
}

const user = adapter(oldApiData);
```

📌 常用于：**接入不同 API、兼容老系统、改造后端数据格式**



**2️⃣ 装饰器模式（Decorator）**

👉 **在不修改原对象的情况下扩展功能。**

示例：增强函数行为

```js
function logDecorator(fn) {
  return function (...args) {
    console.log('调用前: ', args);
    const result = fn.apply(this, args);
    console.log('调用后: ', result);
    return result;
  }
}

function sum(a, b) {
  return a + b;
}

const loggedSum = logDecorator(sum);
loggedSum(1, 2);
```

📌 实际用途：

- Vue/React 中的高阶组件 HOC
- 权限检查
- 节流/防抖增强



**3️⃣代理模式（Proxy）**

👉 **控制对对象的访问**，例如性能优化、懒加载、数据校验。

示例：ES6 Proxy 实现数据校验

```js
const user = {
  name: '',
  age: 0
};

const userProxy = new Proxy(user, {
  set(target, key, value) {
    if (key === 'age' && value < 0) {
      throw new Error('年龄不能为负数');
    }
    target[key] = value;
    return true;
  }
});
```

📌 Vue3 就基于 Proxy。



**4️⃣ 外观模式（Facade Pattern）**

👉 **对复杂系统提供简单接口。**

示例：封装复杂 DOM 操作

```js
const DOMHelper = {
  create(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    document.body.appendChild(el);
  }
};

DOMHelper.create('p', 'Hello World');
```



**5️⃣ 组合模式（Composite）**

👉 **用于树形结构。**

示例：前端菜单结构

```js
class MenuItem {
  constructor(name) {
    this.name = name;
  }
  display() {
    console.log(this.name);
  }
}

class Menu {
  constructor(name) {
    this.name = name;
    this.children = [];
  }
  add(child) {
    this.children.push(child);
  }
  display() {
    console.log(this.name);
    this.children.forEach(c => c.display());
  }
}
```



### 1.3 行为型设计模式

**1️⃣ 观察者模式（Observer）**

👉 **对象之间一对多通知，经典：事件监听、发布订阅。**

示例：简单事件系统

```js
class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, fn) {
    (this.events[event] = this.events[event] || []).push(fn);
  }

  emit(event, data) {
    (this.events[event] || []).forEach(fn => fn(data));
  }
}

const bus = new EventBus();
bus.on('login', user => console.log('用户登录', user));
bus.emit('login', { name: 'Tom' });
```

📌 Vue2 就是基于它（$on / $emit）



**2️⃣ 发布订阅模式（Pub/Sub）**

👉 **与 Observer 的区别：有事件中心，发布者与订阅者不直接关联。**

EventBus 更像 Pub/Sub。



**3️⃣ 策略模式（Strategy Pattern）**

👉 **将多个策略独立封装起来，让调用者自动选择策略。**

示例：表单校验

```js
const strategies = {
  required(value) {
    return value ? '' : '必填';
  },
  minLength(value, length) {
    return value.length >= length ? '' : `最少 ${length} 位`;
  }
};

function validate(value, rules) {
  for (const rule of rules) {
    const [name, ...params] = rule;
    const msg = strategies[name](value, ...params);
    if (msg) return msg;
  }
}
```

📌 用于：**表单校验、算法切换、不同渲染策略**



**4️⃣ 命令模式（Command）**

👉 **把行为封装为对象，可撤销/重做。**

示例：富文本编辑器撤销功能

```js
class CommandManager {
  constructor() {
    this.history = [];
  }
  execute(cmd) {
    cmd.execute();
    this.history.push(cmd);
  }
  undo() {
    const last = this.history.pop();
    last.undo();
  }
}
```

----



## 2.闭包

### 2.1 闭包概述

**1️⃣ 什么是闭包？**

**闭包（Closure）** 是指： **函数 + 它能够访问的词法作用域** 形成的整体。

换句话说，当一个函数被定义时，它会“记住”自己所在的作用域，即使这个函数在作用域外执行，它依然能访问当初作用域中的变量。

**2️⃣ 为什么会有闭包？**

在 JavaScript（还有 Python 等语言）中，作用域是**词法作用域（Lexical Scope）**，也就是函数在**定义时**决定了能访问哪些变量，而不是在**调用时**决定。

闭包就是这种机制的自然结果：
 即使外层函数执行结束，它的变量本应被销毁，但只要有内部函数“引用”了这些变量，那么它们就会被保留下来。

**一个例子**

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



**3️⃣ 闭包的常见用途**

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

### 2.2 闭包的内存泄露

>**🔍  闭包为什么会导致内存问题？**
>
>闭包会出现内存问题，通常满足三个条件：
>
>1. 你创建了闭包
>2. 闭包持有大量数据（数组、DOM、对象等）
>3. 你长期持有这个闭包的引用 → 外层变量一直无法释放

✔ 举个导致内存泄漏的例子：

```js
function createBigClosure() {
  const arr = new Array(10 * 1024 * 1024).fill("*"); // 占用大量内存

  return function() {
    console.log(arr[0]);
  }
}

const leak = createBigClosure(); // arr 即使不用，也永远不会被释放
```

这里因为你把内部函数（闭包）赋值给 `leak`，导致外层的大数组 `arr` 一直在内存里。

**即使你不再用它，它也不会释放。**



**🔥 闭包 vs 普通函数的内存行为**

❌ 普通函数执行完就释放：

```js
function foo() {
  let a = 1;
}
foo();
// a 被回收
```

❗ 闭包保留变量：

```js
function foo() {
  let a = 1;
  return function() { console.log(a); }
}

const bar = foo();
// a 不会被回收
```



**💡 闭包什么时候会真正引发“内存泄漏”？**

闭包本身不是泄漏，泄漏必须满足：

- 变量本应该释放，但没有释放
- 且永远无法访问到（或不再被需要）

一些常见场景：

🧨 情况一：闭包引用了 DOM 节点，却忘记解除绑定

```js
function bind() {
  const bigDom = document.getElementById('big');
  bigDom.addEventListener('click', function() {
    console.log(bigDom);
  });
}
```

如果 bigDom 被删除：

- 事件监听器依然保持引用链
- GC 无法释放

→ 这是前端最常见的闭包泄漏场景之一。

----

🧨 情况二：计时器中的闭包未清除

```js
function start() {
  let data = { big: new Array(10000000) };
  setInterval(() => {
    console.log(data.big.length);
  }, 1000);
}
start();
```

因为 `setInterval` 永远存在，所以闭包变量 `data` 永远不会被释放。

----

🧨 情况三：长生命周期对象（如全局变量）引用了闭包

```js
let cache;

function create() {
  const data = new Array(10000000);
  cache = function() { console.log(data); };
}

create(); // data 永远无法释放
```



⭐ 如何避免闭包造成的内存问题？

✔ 1. 不再使用的闭包置空

```js
cache = null;
```

这样 GC 会自动清理其引用的外层变量。



✔ 2. 在大型应用中谨慎使用 setInterval，记得 clearInterval

```js
const timer = setInterval(() => {}, 1000);
// ...
clearInterval(timer);
```



✔ 3. 事件监听记得解绑（尤其是大型 DOM）

```
bigDom.removeEventListener('click', handler);
```



✔ 4. 不要在闭包中保存大型对象，尽量保存必要数据

```
// bad
function foo(bigObj) {
  return () => console.log(bigObj);
}

// good
function foo({ id }) {
  return () => console.log(id);
}
```



✔ 5. 使用弱引用（WeakMap / WeakSet）避免引用链阻止 GC

例如缓存对象：

```
const wm = new WeakMap();

function cache(obj) {
  wm.set(obj, "cached");
}
```

WeakMap 的 key 不影响对象垃圾回收。





## 5. 原型链

![原型链](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9afcd1172d340508d25c095b1103fac~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)





****



## 6. this

> **`this` 的指向由“调用方式（call site）”决定，而不是定义位置（除了箭头函数）**。
>  常见的规则：**默认绑定 → 隐式/对象绑定 → 显式绑定（call/apply/bind） → new 绑定**。箭头函数例外：它没有自己的 `this`，使用定义时的词法 `this`（lexical this）。

**1️⃣ 默认绑定（Default binding）**

- **规则**：普通函数直接调用时，非严格模式下 `this` 指向全局对象（浏览器中是 `window`）；严格模式下 `this` 为 `undefined`。
- **示例**：

```js
function foo() {
  console.log(this);
}
foo(); // non-strict: window (浏览器)；strict: undefined
```

- **注意**：在 ES module、CommonJS 模块、类方法中默认处于严格模式，所以 `this` 多为 `undefined`。



**2️⃣ 隐式绑定（Implicit / Object binding）**

- **规则**：通过 `obj.method()` 调用时，`this` 指向调用点左边的对象 `obj`。
- **示例**：

```js
const obj = {
  x: 1,
  getX() { return this.x; }
};
console.log(obj.getX()); // 1
```

- **常见坑（丢失绑定）**：把方法赋给变量再调用，`this` 会丢失（变为默认绑定）。

```js
const fn = obj.getX;
fn(); // 非严格下 window；严格下 undefined
```

- **解决**：`bind`、箭头函数或在调用时通过对象访问。



**3️⃣ 显式绑定（call / apply / bind）**

- **规则**：`call` / `apply` / `bind` 可以显式设置 `this`。
  - `func.call(thisArg, arg1, arg2...)`
  - `func.apply(thisArg, [args])`
  - `func.bind(thisArg[, ...args])` 返回绑定后的新函数（不会立即调用）
- **示例**：

```js
function greet(g) { return g + ', ' + this.name; }
const person = { name: 'Alice' };

console.log(greet.call(person, 'Hi')); // "Hi, Alice"
const bound = greet.bind(person);
bound('Hello'); // "Hello, Alice"
```

- **注意**：`bind` 绑定后的函数对于 `new` 有特殊行为（如果用 `new` 调用 bound function，`new` 绑定优先且 `thisArg` 被忽略；但先 bind 再 new 会创建继承绑定的构造函数 — 复杂，通常避免这样用）。



**4️⃣  `new` 绑定（构造函数）**

- **规则**：使用 `new Func()` 时：
  1. 创建一个新对象并将其 `[[Prototype]]` 指向 `Func.prototype`
  2. 新对象绑定为 `this`
  3. 执行构造函数体；如果返回的是对象则返回该对象，否则返回 `this`
- **示例**：

```js
function Person(name) {
  this.name = name;
}
const p = new Person('Bob');
console.log(p.name); // "Bob"
```

- **与显式绑定的优先级**：`new` 绑定优先于 `call`/`apply`/`bind`（如果用 `new f.call(obj)` 之类写法，`new` 会决定最终 this）。



5️⃣  箭头函数（Arrow functions）——重要例外

- **核心**：箭头函数没有自己的 `this`，它的 `this` 是 **定义时（词法环境）** 的 `this`（闭包式继承）。
- **示例**：

```js
const obj = {
  id: 42,
  fn() {
    const arrow = () => console.log(this.id);
    arrow();
  }
};
obj.fn(); // 42
```

这里 `arrow` 使用的是 `fn` 的 `this`（即 `obj`），不是调用它的方式决定。

- **常见用法**：在回调中保留外层 `this`（例如 setTimeout、promise、DOM 回调）。
- **坑**：不能作为构造函数，也不能给箭头函数 `bind` 改变 `this`（`bind` 不会改变箭头函数的词法 `this`）。

----

**6️⃣ 严格模式、模块与默认 this**

- 在 **严格模式**（`'use strict'` 或 ES modules、class 方法默认严格）中：
  - 直接调用普通函数时 `this === undefined`（不会退化为 global）
- 在浏览器全局脚本（非模块、非严格）中：
  - 直接调用函数 `this === window`
- **因此**：在模块/类中，默认 `this` 不会自动变成全局对象。

----

**7️⃣ setTimeout当中的this **

>总结 — setTimeout 中 this 的最终规则表
>
>| 回调类型                | this 指向（浏览器） | 原因                  |
>| ----------------------- | ------------------- | --------------------- |
>| 普通函数 function()     | window / undefined  | 默认绑定              |
>| 箭头函数 () => {}       | 外层 this           | 词法作用域            |
>| fn.bind(obj)            | obj                 | 显式绑定              |
>| obj.method 传进去       | 丢失绑定 → 默认绑定 | call site 和 obj 无关 |
>| 设置到 DOM 事件里再触发 | element             | 事件系统修改          |

**📍情况 1：普通函数作为回调（最常见）**

```js
const obj = {
  x: 1,
  print() {
    setTimeout(function () {
      console.log(this.x);
    }, 0);
  }
};

obj.print();
```

👉 输出

```
undefined（或 window.x）
```

👉 原因

- 定时器回调 **不是由 obj 调用**
- 回调是由 **setTimeout 内部异步调度系统调用的**
- 因此 this → **默认绑定**
  - 非严格模式：this = window
  - 严格模式 / ES Module：this = undefined



**📍情况 2：使用箭头函数作为回调**

```js
const obj = {
  x: 1,
  print() {
    setTimeout(() => {
      console.log(this.x);
    }, 0);
  }
};

obj.print();
```

👉 输出

```
1
```

👉 原因

箭头函数没有自己的 this
 → 使用定义时外层作用域的 this
 → print() 由 obj 调用
 → this = obj
 → 因此打印 1



**⚠️ 如何在 setTimeout 中保持正确的 this？（三种方案）**

✔ 方法 1：使用箭头函数（最推荐）

```
setTimeout(() => {
  console.log(this);
}, 0);
```

✔ 方法 2：使用 bind

```
setTimeout(function () {
  console.log(this);
}.bind(this), 0);
```

✔ 方法 3：保存 this 到变量（老写法）

```js
const self = this;
setTimeout(function () {
  console.log(self);
}, 0);
```

----



**8️⃣ 事件回调中的 this**

```
button.addEventListener("click", function () {
  console.log(this); // 指向触发事件的元素
});
```

为什么这里的 this 是 DOM 元素？

→ 因为浏览器主动在事件回调时 **使用 element 作为 this** 调用回调。

而 setTimeout 不会这样做。



**⚠️ 常见陷阱与解决办法（实用贴士）**

1. **方法丢失绑定**
   - 场景：`const fn = obj.method; fn();` → 丢失 `this`
   - 解决：`obj.method.bind(obj)`、在构造器中 `this.method = this.method.bind(this)`、或在调用时 `obj.method()`。
2. **回调中丢失 `this`**
   - 如 `setTimeout(obj.method, 100)` → `this` 丢失
   - 解决：`setTimeout(obj.method.bind(obj), 100)` 或 `setTimeout(() => obj.method(), 100)`。
3. **DOM 事件处理器**
   - 直接函数作为 `element.onclick = function () { console.log(this); }` → `this` 是元素
   - 箭头函数则继承外层 `this`（通常不是元素），所以绑定事件时应慎用箭头函数：
     - 推荐用普通函数以获得 `this === element`，或明确使用 `event.target`。
4. **React class 组件**
   - 类方法默认未绑定，需要在 constructor 中 `this.handle = this.handle.bind(this)` 或使用 class fields/箭头函数写法：`handle = () => {}`
5. **丢失上下文导致 bug（经常面试问点）**
   - 如果把对象方法作为变量传入第三方库（如事件库、map callback），注意绑定。

----

**✨ 调用优先级总结（从高到低）**

1. **`new` 调用**（构造函数） — `this` 指向新对象
2. **显式绑定**（`call` / `apply` / `bind`） — `this` 指向绑定对象（`new` 优先于显式？`new` 高于 bind）
3. **隐式绑定**（`obj.method()`） — `this` 指向对象（最常见）
4. **默认绑定**（直接函数调用） — 非严格模式指向全局，严格模式为 `undefined`

> 箭头函数：无论上述哪种规则都不会影响箭头函数的 `this`，它是词法继承的。

----

- 

----

## 8. 模块化

> 在早期浏览器时代（ES6 之前），所有 JS 代码写在全局作用域：
>
> - 没有作用域隔离 → 全局变量污染
> - 依赖顺序混乱 → 必须按 script 标签顺序
> - 工程规模变大后难以维护

因此 JS 社区逐步发展出模块化方案。



### 8.1  JS 模块化的发展历程

1️⃣ **IIFE（立即执行函数）时代**

最原始的“模块化”，通过闭包隔离作用域。

```js
var moduleA = (function () {
  const a = 1;
  function add(x) {
    return x + a;
  }

  return { add };
})();
```

- ✔ 可以避免全局污染
- ✘ 无依赖管理
- ✘ 无自动加载机制

----

2️⃣ **CommonJS（Node.js 模块化）**

Node.js 默认使用 CommonJS。

写法：

```js
// 导出
module.exports = { add }

// 导入
const { add } = require('./utils')
```

特点

- **同步加载**（require 是同步调用）
- 适合 **服务器端（文件在本地）**
- 模块是一个对象 `{}`，require 返回的是值的 **拷贝**（导出值被缓存）

CommonJS 加载流程

1. 读取文件
2. 包裹成函数（Node 会自动封装）

```js
(function (exports, require, module, __filename, __dirname) {
   // 模块源代码
});
```

1. 执行函数并缓存 module.exports
2. 下次 require 直接从缓存读

----

3️⃣ **AMD（RequireJS）浏览器时代主流方案**

浏览器不能同步加载文件，所以 AMD 提出 **异步加载模块**：

```js
define(['moduleA'], function (A) {
  A.doSomething();
});
```

特点：

- **异步加载**
- 依赖前置（数组声明）
- 需要引入 require.js

----

4️⃣ **UMD（通用模块定义）**

兼容 CommonJS + AMD + 全局变量。

```js
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(); // Node
  } else if (typeof define === 'function' && define.amd) {
    define(factory); // AMD
  } else {
    root.myLib = factory(); // 浏览器全局
  }
})(this, function () {
  return {};
});
```

在库中常见，例如 lodash、moment 等早期版本。



### 8.2 ES Module（ES6 正统模块化）

浏览器和 Node 新规范都支持的标准模块格式。

**写法：**

导出

```js
export const x = 1;
export function add() {}
export default App;
```

导入

```js
import { x, add } from './utils.js'
import App from './App.js'
```



**ESM 的核心特点（面试重点🔥）**

① **静态分析（最重要）**

ESM 在编译阶段就能确定依赖关系，因此：

- 可以做 **tree-shaking**
- 不能放在 if、循环等动态语句里

```js
import a from './a.js' // 必须写在顶层
```



② **按需导出：引用绑定（Live Binding）**

导出的值不是拷贝，而是引用：

```js
// a.js
export let count = 0;
export function inc() {
  count++;
}

// b.js
import { count, inc } from './a.js';
inc();
console.log(count); // 1 —— 自动更新！
```



③ **默认异步加载（浏览器端）**

浏览器加载 ES module：

```html
<script type="module" src="main.js"></script>
```

- 会自动并行加载依赖
- 但执行顺序根据依赖拓扑决定（先依赖再执行入口）
- 模块天然使用 strict mode



**🧩 CommonJS 与 ESM 的对比（面试高频）**

| 项目                | CommonJS               | ES Module           |
| ------------------- | ---------------------- | ------------------- |
| 加载方式            | 同步                   | 异步                |
| 用于环境            | Node                   | 浏览器 & Node       |
| 导出内容            | 值拷贝                 | live binding        |
| 是否可 Tree-shaking | ❌ 不支持               | ✔ 静态分析          |
| 是否可动态导入      | ✔ require 可在任何地方 | ❌ import 必须在顶层 |
| 是否缓存            | ✔ 是                   | ✔ 是                |



**🧩 Node 中 ESM 与 CommonJS 混用的问题**

**⚠️ 不能 mix：**

```js
import x from 'x';
const y = require('y'); // ❌ 报错（ESM 模式中）
```

Node 需要：

- 使用 `"type": "module"`
- 或 `.mjs` 后缀

同时解决互操作要用：



CommonJS → ESM

```js
import pkg from './lib.cjs';
```

ESM → CommonJS

```js
const pkg = await import('./lib.mjs');
```



**🧩 动态模块加载（import()）**

用于懒加载/按需加载（异步）：

```js
import('./chart.js').then(mod => {
  mod.renderChart();
});
```

React、Vue router 都大量使用它做异步组件。



🧩 可能进一步追问的点

**1. 为什么 ESM 能 tree-shaking，CJS 不行？**

因为 ESM 是 **静态结构**，依赖是编译期可确定的。

CJS 的 require 是运行时行为：

```js
require(dynamicPath) // 编译时无法确定
```

**2. 为什么 ESM 会使用 live binding？**

为了保证依赖图一致性，避免值快照导致状态不同步。

**3. 浏览器加载 ESM 的执行顺序如何？**

- 下载并行
- 先执行依赖，再执行入口



**🧩 总结**

> JS 模块化体系从 IIFE → CommonJS → AMD → UMD → ES Module 演进。
>  ES Module 是现代前端唯一的标准模块系统，支持静态分析、tree-shaking、live binding，并已被浏览器与 Node 全面支持。
>  工程化构建工具（webpack、Vite）最终也基于 ESM 构建语法来做依赖图与优化。

----

## Promise

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

## call apply bind

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

## 事件中心

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

## 防抖节流

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



## 继承







## 经典手撕

###  1. 订阅发布

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



### 2. 手写promise

```js
//promise.all
Promise.myAll=function(promises){
  return new Promise((resolve,reject)=>{
    if(!Array.isArray(promises))return reject("传入参数错误")
    if(!promises.length)return resolve([])
    
    let results=[]
    let count=0;
    
    promises.forEach((p,index)=>{
      Promise.resolve(p).then(value=>{//Promise.resolve(p)其中p为Promise对象。则此处的value，将是p成功之后的返回值
        results[index]=value;
        count++;
        
        if(count===promises.length)resolve(results)
      }).catch(err=>reject(err))
    })
  })
}

//promise.race
Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    promises.forEach(p => {
      Promise.resolve(p).then(resolve).catch(reject);
    });
  });
};

//promise.allsettled
Promise.myAllSettled = function (promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    const results = [];
    let count = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(value => {
          results[index] = { status: "fulfilled", value };
        })
        .catch(reason => {
          results[index] = { status: "rejected", reason };
        })
        .finally(() => {
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        });
    });
  });
};

//promise.any
Promise.myAny = function (promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    let errors = [];
    let count = 0;

    if (promises.length === 0) {
      return reject(new AggregateError([], "All promises were rejected"));
    }

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(resolve)
        .catch(err => {
          errors[index] = err;
          count++;

          if (count === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
};



```



### 3. bind/call/apply

```js
Function.prototype.myBind = function (context, ...args) {
  const fn = this;

  function boundFn(...newArgs) {
    // 如果作为构造函数调用 (new)
    if (this instanceof boundFn) {
      return fn.apply(this, [...args, ...newArgs]);
    }
    // 普通调用
    return fn.apply(context, [...args, ...newArgs]);
  }

  // 保持原型链
  boundFn.prototype = Object.create(fn.prototype);

  return boundFn;
};


Function.prototype.myCall = function (context, ...args) {
  context = context || globalThis; // 处理 null/undefined

  // 创建唯一属性避免覆盖
  const fnKey = Symbol();

  context[fnKey] = this;  // this 就是要执行的函数

  const result = context[fnKey](...args); // 执行函数

  delete context[fnKey]; // 清理

  return result; // 返回函数执行结果
};




Function.prototype.myApply = function (context, args) {
  context = context || window;

  const fnKey = Symbol();
  context[fnKey] = this;

  let result;

  if (Array.isArray(args)) {
    result = context[fnKey](...args);
  } else {
    result = context[fnKey]();  
  }

  delete context[fnKey];

  return result;
};



```



## 浅拷贝和深拷贝

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

  

# 二、CSS

## 1. position

1️⃣ `static`（默认值）

- 默认值，元素按照文档流正常排列。
- **top / left / right / bottom** 无效。

```css
div {
  position: static;
  top: 10px; /* 无效 */
}
```

2️⃣`relative`（相对定位）

- 元素仍占据原本文档流位置，但可以通过 `top/left/right/bottom` **相对自身原位置**进行偏移。
- 其他元素的位置不会改变。

```css
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

```css
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

```css
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

```css
div {
  position: sticky;
  top: 0; /* 滚动到0px时固定 */
}
```

✅ 常用场景：表头固定、吸顶导航。



二、`position` 属性结合 `z-index`

- 只有 `position` 值为 **relative/absolute/fixed/sticky** 的元素，`z-index` 才有效。
- `z-index` 控制元素堆叠顺序，值越大越靠前。

```css
div {
  position: absolute;
  z-index: 10;
}
```

## 2. 移动端适配

### 2.1 媒体查询（Media Queries）

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

### 2.2 REM/EM 布局（相对单位）

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

### 2.3 百分比 / 弹性盒子（Flex）

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

### 2.4 栅格系统（Grid / UI 框架）

- 常用的移动端 UI 框架如 **Vant**, **Ant Design Mobile**, **WeUI**, **Bootstrap（响应式栅格）**
- 栅格可以快速实现多列布局、间距自适应、隐藏显示元素等功能。

```html
<div class="row">
  <div class="col-6">左侧</div>
  <div class="col-6">右侧</div>
</div>
```

------

### 2.5. 图片 / 字体自适应

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

### 2.6 视口（Viewport）设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

- **width=device-width** → 宽度与设备宽度一致
- **initial-scale=1.0** → 初始缩放比例
- **user-scalable=no** → 禁止用户缩放

------

### 2.7 移动端适配工具

- **PostCSS + px2rem**：自动将 px 转为 rem
- **Lib-flexible**：阿里出品，动态计算根字体大小
- **vw/vh**：CSS 单位，根据视口宽高适配

------

### 2.8移动端适配的思路

1. **先设计移动端**：先做移动端页面，再做平板和 PC（Mobile First）
2. **使用相对单位**：避免绝对像素，布局和字体尽量用 `rem`, `%`, `vw`
3. **合理断点**：常见断点 375px（小手机）、768px（平板）、1024px（PC）
4. **测试真机**：浏览器模拟器无法完全覆盖真实机型，需要在 iOS/Android 真机上测试



## 3. CSS选择器

✅ CSS 选择器分类（从常用到高级）

**1. 基础选择器**

| 选择器     | 示例            | 含义                  |
| ---------- | --------------- | --------------------- |
| 标签选择器 | `div`           | 选中所有 div          |
| 类选择器   | `.box`          | class="box"           |
| ID 选择器  | `#app`          | id="app"              |
| 通用选择器 | `*`             | 任意元素              |
| 属性选择器 | `[type="text"]` | 选 type="text" 的元素 |

**2. 组合器（关系选择器）**

| 选择器     | 示例      | 含义                     |
| ---------- | --------- | ------------------------ |
| 后代选择器 | `div p`   | div 内所有 p（任意层级） |
| 子代选择器 | `div > p` | div 的直接子元素 p       |
| 相邻兄弟   | `h2 + p`  | h2 后紧邻的第一个 p      |
| 通用兄弟   | `h2 ~ p`  | h2 后所有同级 p          |

**3. 伪类选择器（状态）**

| 类别       | 示例                                           | 含义           |
| ---------- | ---------------------------------------------- | -------------- |
| 状态伪类   | `:hover`, `:active`, `:focus`                  | 鼠标或焦点状态 |
| 结构伪类   | `:first-child`, `:last-child`, `:nth-child(2)` | DOM 结构       |
| 表单伪类   | `:checked`, `:disabled`                        | 选中、禁用     |
| 否定选择器 | `:not(.a)`                                     | 非 .a          |

**4. 伪元素选择器（生成内容）**

| 示例             | 区别             |
| ---------------- | ---------------- |
| `::before`       | 元素之前插入内容 |
| `::after`        | 元素之后插入内容 |
| `::first-line`   | 第一行           |
| `::first-letter` | 首字母           |



🔥 **CSS 优先级（最重要）**

CSS 优先级计算是由 **四位数规则** 决定的：

```css
!important > 内联样式 > ID > 类/伪类/属性选择器 > 标签/伪元素 > 通配符
```

我们用（A, B, C, D）表示四段权重：

| 选择器类型           | 权重      | 例子                              |
| -------------------- | --------- | --------------------------------- |
| inline 内联样式      | (1,0,0,0) | `<div style="">`                  |
| ID                   | (0,1,0,0) | `#app`                            |
| 类、属性选择器、伪类 | (0,0,1,0) | `.box`、`[type="text"]`、`:hover` |
| 标签、伪元素         | (0,0,0,1) | `div`、`::before`                 |
| 通用选择器、继承     | (0,0,0,0) | `*`、继承样式                     |



🧮 **优先级计算示例**

示例 1：

```css
#header .nav li a:hover
```

计算：

- `#header` → 1 个 ID → (0,1,0,0)
- `.nav` → 1 个类 → (0,0,1,0)
- `li a` → 2 个标签 → (0,0,0,2)
- `:hover` → 1 个伪类 → (0,0,1,0)

最终权重：

```
(0,1,2,2)
```



示例 2：

```
div ul li .item
```

权重：

- 标签 3 个 → (0,0,0,3)
- 类 1 个 → (0,0,1,0)

总权重：

```
(0,0,1,3)
```



示例 3：重要性最高

```css
.box {
  color: red !important;
}
```

`!important` 可以覆盖所有普通规则。



⚠️ 注意：层级深不增加权重！

例如：

```css
div ul li a  // 4层
```

权重仍然只是：

```css
(0,0,0,4)
```

深度多不代表高优先级。



🧨 优先级比较口诀（超好记）

> **！内联 ID 类 标签
>  从左到右逐一比
>  大的赢 直到分出胜负**



🔥 面试必考问题及答案（你可以直接背）

**❓ 1. `#id .class` 和 `.class1 .class2`，哪个优先级更高？**

计算：

- `#id .class` → (0,1,1,0)
- `.class1 .class2` → (0,0,2,0)

**ID 胜出 → 前者权重更高**



**❓ 2. `!important` 能覆盖掉内联样式吗？**

**能。**
 但 **内联 + important** > 单独 important。



**❓ 3. 怎样强制覆盖第三方库样式？**

方法：

1. 加 `!important`
2. 增加选择器权重（如加 ID）
3. 放在 CSS 最后



## 4. BFC

**1️⃣ 什么是 BFC？**

BFC 是 **CSS 布局中的一个独立渲染区域**，它有自己的一套规则来约束盒子（元素）如何排列，不会影响到外部元素，也不受外部元素影响。

可以理解为：

> **BFC 是浏览器渲染过程中生成的一个独立容器，容器里的元素布局与容器外部互不干扰。**



**2️⃣ 触发 BFC 的条件**

一个元素要变成 BFC 容器，需要满足以下任意一个条件：

- 根元素（`<html>`）
- 浮动元素：`float !== none`
- 绝对定位 / 固定定位：`position: absolute | fixed`
- `display: inline-block | table-cell | table-caption | flex | inline-flex | grid | inline-grid`
- `overflow: hidden | auto | scroll`（不是 `visible`）
- 多列容器：`column-count` 或 `column-span: all`



**3️⃣ BFC 的布局规则**

触发 BFC 后，元素的布局会遵循以下规则：

1. **内部盒子垂直方向排列**（类似普通文档流的块级布局）。
2. **BFC 区域不会与浮动元素重叠**，会在旁边环绕。
3. **BFC 内部的 margin 不会和外部元素的 margin 发生折叠**。
4. **BFC 可以包含浮动元素**（高度塌陷问题的解决方案）。
5. BFC 是一个**独立区域**，内部布局不会影响外部。



**4️⃣ BFC 的常见应用场景**

✅ 1. 阻止 **margin 重叠**

两个相邻的块级元素，上下 `margin` 会发生合并：

```html
<div class="a"></div>
<div class="b"></div>
.a, .b {
  width: 100px;
  height: 100px;
  margin: 20px;
  background: lightblue;
}
```

两个元素之间的间距并不是 `20 + 20 = 40px`，而是只取一个 `20px`。
 👉 解决办法：给其中一个元素触发 BFC，比如：

```css
.b {
  overflow: hidden; /* 触发 BFC */
}
```

这样 `a` 和 `b` 的 margin 就不会合并了。



✅ 2. 清除浮动（解决高度塌陷）

当子元素都浮动时，父元素会高度塌陷：

```html
<div class="parent">
  <div class="child">浮动</div>
</div>
.parent {
  background: lightyellow;
}
.child {
  float: left;
  width: 100px;
  height: 100px;
  background: lightgreen;
}
```

此时 `.parent` 的高度为 0。
 👉 解决办法：让 `.parent` 形成 BFC：

```css
.parent {
  overflow: hidden; /* 触发 BFC */
}
```

这样父元素就能包含浮动子元素了。



**✅ 3. 避免文字环绕浮动元素**

如果有浮动元素，文字会环绕：

```html
<div class="float"></div>
<div class="text">这里是一段文字...</div>
.float {
  float: left;
  width: 100px;
  height: 100px;
  background: red;
}
```

👉 想让文字不环绕浮动，可以给 `.text` 触发 BFC：

```css
.text {
  overflow: hidden; /* 触发 BFC，避免环绕 */
}
```



**✅ 4. 创建独立布局区域**

例如：侧边栏（float:left）+ 主体部分（BFC 避免被挤压）。



5️⃣ 总结口诀

你可以记住一句话来快速理解 BFC：

👉 **BFC 是一个独立的布局环境：内部元素不会影响外部布局，外部布局也不会“侵入”进来。**



## 5.flex



## 6. 盒模型

**1️⃣ CSS 盒模型基础概念**

在 CSS 中，每个元素都可以看作一个盒子（Box），它由 **四层组成**：

```
          Margin
   ---------------------
          Border
   ---------------------
          Padding
   ---------------------
          Content
```

- **Content（内容）**：文本或图片占据的区域，宽高由 `width` 和 `height` 控制
- **Padding（内边距）**：内容与边框的距离
- **Border（边框）**：包裹内容和 padding 的线条
- **Margin（外边距）**：盒子与外部元素的距离



**2️⃣ 盒模型类型**

🔹 1. `content-box`（默认）

- `width` / `height` 只算内容区域，不包括 padding 和 border
- **总宽度公式**：

```
总宽度 = margin-left + border-left + padding-left + width + padding-right + border-right + margin-right
总高度 = margin-top + border-top + padding-top + height + padding-bottom + border-bottom + margin-bottom
```

示例：

```css
div {
  width: 200px;
  height: 100px;
  padding: 10px;
  border: 5px solid black;
  margin: 20px;
}
```

计算：

- 内容区：200 × 100
- padding：左右各 10 → +20px，内高 +20px
- border：左右各 5 → +10px，内高 +10px
- 总宽度 = 200 + 20 + 10 + margin 20*2 → 200+30+40=270px（只计算 content+padding+border，不包括 margin）
- 总高度同理



**🔹 2. `border-box`**

- `width` / `height` **包括 content + padding + border**
- 更适合布局计算

示例：

```css
div {
  width: 200px;
  height: 100px;
  padding: 10px;
  border: 5px solid black;
  box-sizing: border-box;
}
```

- 总宽度 = 200px（padding + border 已包含）
- 总高度 = 100px
- 外部 margin 不算在 width/height 内



**3️⃣ Margin 的特性**

🔹 1. Margin 折叠（垂直方向）

- 相邻两个块级元素的 **垂直 margin** 会折叠，取较大值，而不是相加

```html
<div style="margin-bottom:20px;"></div>
<div style="margin-top:30px;"></div>
```

- 两个 div 之间间距 = 30px（取较大值）

🔹 2. 水平方向不折叠

- margin-left / margin-right 正常相加

🔹 3. 自动水平居中

- 当 `margin-left: auto; margin-right: auto;`，块元素宽度固定时，会水平居中



**4️⃣ Padding 的特性**

- padding **增加内容区和边框之间的距离**
- 会影响盒子实际占用空间（`content-box` 里）
- 不会折叠
- 支持百分比，相对于 **父元素内容宽度**



**5️⃣ 总结公式**

| 盒模型类型  | 总宽度                                                       | 总高度 |
| ----------- | ------------------------------------------------------------ | ------ |
| content-box | `margin-left + border-left + padding-left + width + padding-right + border-right + margin-right` | 同理   |
| border-box  | `margin-left + width + margin-right`（width 已含 padding & border） | 同理   |



6️⃣ 举个完整示例

```html
<div class="box">Hello</div>

<style>
.box {
  width: 200px; 
  height: 100px;
  padding: 10px;
  border: 5px solid black;
  margin: 20px;
  box-sizing: content-box;
}
</style>
```

- **内容区**：200×100
- **padding**：+10px 左右/上下
- **border**：+5px 左右/上下
- **margin**：外部间距 20px
- **总占用空间**：
  - 宽度 = 200 + 10+10 + 5+5 = 230px
  - 高度 = 100 + 10+10 + 5+5 = 130px
  - 外边距额外加 20px → 占用 270×170px

# 三、 框架 & 工具 & 理念

## 1. SPA和MPA

## 2. CSR & SSR

SSR 指的是 **Server-Side Rendering（服务端渲染）**，是 Web 前端的一种渲染方式。它和常见的前端渲染（CSR, Client-Side Rendering）有本质区别。

- **SSR（服务端渲染）**：页面的 HTML 在 **服务器端生成** 后直接发送给浏览器。
- **CSR（客户端渲染）**：页面的 HTML 是一个空壳（通常只有 `<div id="app"></div>`），浏览器下载 JS 后再渲染完整页面。

------

### 2.1 工作流程

**1️⃣ CSR（客户端渲染）**

```
浏览器请求 → 服务器返回空 HTML + JS
浏览器解析 JS → 调用框架渲染页面 → 显示完整内容
```

特点：

- 页面渲染依赖浏览器 JS
- 首屏可能白屏（FCP / LCP 较慢）
- SEO 不友好（搜索引擎爬虫可能抓不到内容）
- SPA（单页应用）模式

------

**2️⃣ SSR（服务端渲染）**

```
浏览器请求 → 服务器渲染 HTML → 浏览器直接显示页面
然后再挂载 JS，实现交互（Hydration）
```

特点：

- 首屏渲染快
- SEO 更友好
- JS 加载后可以变成 SPA

------

### 2.2 工作原理

#### 2.2.1 CSR

以一个典型的 SPA（单页应用）为例：

1. 浏览器请求页面：
   - 服务器返回一个空壳 HTML（通常只有 `<div id="app"></div>`）
   - 同时返回 JS 文件（比如 `bundle.js`）
2. 浏览器下载并执行 JS：
   - JS 创建虚拟 DOM
   - 渲染成真实 DOM，挂载到页面上
3. 页面完成渲染并可交互

```
Browser → Server: GET /
Server → Browser: index.html + bundle.js
Browser: execute JS → render UI → attach events
```

**✅ 优点**

1. **减轻服务器压力**
   - 服务器只需提供静态文件，不用渲染 HTML
2. **前端开发灵活**
   - SPA 应用，路由和状态管理完全在前端
3. **交互体验好**
   - 页面跳转不刷新，用户体验流畅

**❌ 缺点**

1. **首屏加载慢**
   - 需要下载并执行 JS 才能显示页面
2. **SEO 不友好**
   - 搜索引擎抓取 JS 内容有限
3. **首次渲染白屏明显**
   - FCP（First Contentful Paint）较慢



**🧱 典型 CSR 框架**

| 框架     | 特点                |
| -------- | ------------------- |
| React    | SPA，虚拟 DOM       |
| Vue.js   | SPA，组件化         |
| Angular  | SPA，MVVM 风格      |
| Ember.js | SPA，路由和状态集成 |

这些框架都是典型 CSR 实现：**JS 控制页面渲染**。

-----

#### 2.2.2 SSR

以 Nuxt为例：

1. **服务器端执行组件渲染逻辑**
2. **生成 HTML 字符串**
3. **返回给浏览器**
4. **浏览器下载 JS 包**
5. **Hydration：把 HTML 和 JS 状态挂钩，实现交互**

```text
Server: renderToString(<App />) → "<div>...</div>"
Browser: receive HTML → mount JS → attach event listeners
```

**✅ 优点**

1. **首屏快**
   - 用户看到页面内容速度快
2. **SEO 友好**
   - 搜索引擎直接抓到 HTML
3. **社交分享**
   - 链接预览直接显示内容

**❌ 缺点**

1. **服务器压力大**
   - 每次请求都要渲染 HTML
2. **开发复杂**
   - 需要处理前后端同构（isomorphic / universal）
3. **状态管理复杂**
   - 服务端渲染时要序列化数据给浏览器



**🧱 常见 SSR 框架**

| 框架                      | 语言/生态 | 说明                    |
| ------------------------- | --------- | ----------------------- |
| Next.js                   | React     | 最流行的 React SSR 框架 |
| Nuxt.js                   | Vue       | Vue 官方 SSR 框架       |
| Angular Universal         | Angular   | Angular 官方 SSR        |
| Express + template engine | Node.js   | 自己手写 SSR            |



**SSR vs CSR 总结**

| 特性       | CSR                    | SSR                            |
| ---------- | ---------------------- | ------------------------------ |
| 首屏渲染   | 慢                     | 快                             |
| SEO        | 差                     | 好                             |
| 服务器压力 | 小                     | 大                             |
| 用户体验   | 初次白屏明显           | 用户感知更快                   |
| 适合场景   | 内部系统、交互复杂 SPA | 公共网站、新闻、电商、SEO 重要 |



**💡 面试/实战总结**

> **SSR 的核心思想就是：把页面渲染提前到服务器端，浏览器直接拿到 HTML。
> CSR 更轻量但首屏慢，SSR 更适合 SEO 和首屏优化，但服务器压力更大。**

----

## 3. SEO

**SEO（Search Engine Optimization）**就是优化网站，让搜索引擎（Google、Bing、Baidu 等）更容易抓取、理解和索引你的内容，从而在搜索结果中获得更高的排名。

> 核心目标：
>
> 1. **提高可抓取性**：搜索引擎能看到你的内容
> 2. **提高索引率**：搜索引擎收录你的内容
> 3. **提高排名**：内容和结构符合搜索引擎算法，提高展示位置

------

### 3.1 SEO 的工作原理

1. **爬虫抓取页面**
   - 搜索引擎爬虫（Spider / Bot）访问网页
   - 获取 HTML、CSS、JS 内容
2. **渲染与索引**
   - 抓取到的 HTML 内容用于构建索引
   - 如果页面依赖 JS 才渲染内容，爬虫可能抓不到（尤其是 CSR）
3. **排名算法**
   - 根据页面质量、内容相关性、权威度、用户体验等评分
   - 决定搜索结果的排序



❕**前端影响 SEO 的关键因素**

**1️⃣ 页面内容可抓取**

- **CSR 风格 SPA**：
  - 页面内容靠 JS 渲染
  - 爬虫抓取时可能是空 HTML → SEO 差
- **解决方法**：
  1. **SSR（Server-Side Rendering）**：服务器直接返回完整 HTML
  2. **静态生成（SSG）**：构建时生成静态 HTML
  3. **预渲染（Prerender）**：生成爬虫可见 HTML

------

**2️⃣ HTML 元信息**

- `<title>`：页面标题，SEO 权重高
- `<meta name="description">`：描述信息，搜索结果摘要
- `<meta name="robots">`：告诉爬虫是否抓取或索引
- `<link rel="canonical">`：避免重复内容惩罚

------

**3️⃣ URL 结构**

- 简洁、有语义
- 包含关键词
- 避免动态参数过多（`?id=123&cat=4`）

✅ 示例：

```text
www.example.com/products/shoes
比
www.example.com/index.php?cat=4&id=123
更利于 SEO
```

------

**4️⃣ 内容质量与关键词**

- **关键内容放在 HTML 前面**，利于爬虫抓取
- 使用 H1~H6 标签分层次
- 内部链接合理，形成良好网站结构

------

**5️⃣ 页面性能与用户体验（间接影响 SEO）**

- 页面加载速度快 → 提高排名（Google Core Web Vitals）
- 首屏渲染速度快 → 减少跳出率
- 移动端友好 → 移动端排名加权

------

**6️⃣ 结构化数据（Schema）**

- 使用 JSON-LD 标记结构化信息
- 帮助搜索引擎理解页面语义（如产品、文章、FAQ、事件）
- 提高搜索结果展示效果（富文本/知识图谱）

------

### 3.2 前端实战优化策略

#### 3.2.1 前端可抓取性优化

**1️⃣ SSR / SSG / Prerender**

- **CSR（纯客户端渲染）**会导致搜索引擎抓取不到内容
- **解决方案**：
  1. **SSR（Server-Side Rendering）**：动态页面在服务端生成完整 HTML
     - 框架：Next.js (React)、Nuxt.js (Vue)
  2. **SSG（Static Site Generation）**：构建时生成静态 HTML
     - 优势：首屏快，易缓存
  3. **Prerender**：针对爬虫生成静态 HTML，而用户访问仍是 CSR

------

**2️⃣ URL 规范化**

- URL 应简洁、有语义
- 使用关键词，不要带太多参数
  - ✅ `/products/shoes`
  - ❌ `/index.php?id=123&cat=4`
- 配合 `<link rel="canonical">` 避免重复内容惩罚

------

**3️⃣ 路由优化**

- 避免 hash 路由（`/#/home`）影响抓取
- SPA 页面应通过 SSR 或预渲染支持搜索引擎

------

#### 3.2.2 HTML 元信息优化

1. **标题（<title>）**：
   - 每个页面唯一，包含核心关键词
2. **描述（<meta name="description">）**：
   - 搜索结果摘要，提升点击率
3. **Robots 标签（<meta name="robots">）**：
   - 控制页面抓取和索引
4. **H1~H6 层级**：
   - 内容层次清晰，利于爬虫理解结构
5. **Alt 属性**：
   - 图片替代文本，搜索引擎抓取图片内容

------

#### 3.2.3 内容优化策略

1. **关键词优化**
   - 页面核心关键词出现在标题、描述、H1、正文中
2. **内容质量**
   - 原创、有深度、结构清晰
3. **内部链接**
   - 合理的站内链接提高爬虫抓取效率
4. **结构化数据（Schema.org）**
   - JSON-LD 标记文章、产品、FAQ、事件等
   - 搜索结果可显示富文本，提高点击率

------

#### 3.2.4 性能优化（间接 SEO）

1. **首屏渲染快**
   - SSR / SSG / Code Splitting
2. **页面加载速度快**
   - 压缩 JS/CSS/HTML
   - 图片压缩、WebP、LazyLoad
   - HTTP/2/3 多路复用
3. **移动端友好**
   - 响应式设计
   - 移动端页面速度优化
4. **Core Web Vitals**
   - FCP、LCP、CLS 指标良好

------

#### 3.2.5 外部优化（Off-page SEO）

1. **高质量外链**
   - 其他高权重网站指向你的网站
2. **社交分享优化**
   - Open Graph、Twitter Card 标签
3. **站外信任度**
   - HTTPS、备案、权威内容

------

#### 3.2.6 企业级 SEO 实践策略

1. **自动化 SEO**：
   - CMS 或 API 构建时自动生成 `<title>`、`<meta>`、结构化数据
2. **站点地图（sitemap.xml）**：
   - 告诉爬虫哪些页面需要抓取
3. **robots.txt 配置**：
   - 控制抓取频率和敏感页面
4. **监控与分析**：
   - Google Search Console / Baidu Webmaster Tools
   - 监控抓取错误、索引量、关键词排名
5. **性能监控**：
   - Lighthouse / PageSpeed Insights
   - 核心 Web Vitals 实时优化



**⚠️ 总结**

> **SEO 优化策略体系化思路**：

1. **前端渲染策略**：SSR/SSG/Prerender，确保内容可抓取
2. **HTML 与内容优化**：标题、描述、H1、关键词、结构化数据
3. **性能优化**：首屏快、移动端友好、Core Web Vitals
4. **站内站外优化**：URL、内部链接、外链、社交分享
5. **企业级自动化与监控**：sitemap、robots、搜索控制台、性能监控

## 4. CI/CD

# 四、Vue

## 1. 生命周期

**🚀 一、Vue 生命周期示意图（通俗版）**

Vue 的生命周期就是：
 **创建 → 渲染 → 更新 → 销毁**

按顺序是：

```yaml
beforeCreate
created
beforeMount
mounted
beforeUpdate
updated
beforeUnmount (Vue3) / beforeDestroy (Vue2)
unmounted (Vue3) / destroyed (Vue2)
```



**⭐ 二、Vue2 与 Vue3 生命周期对照表**

| 阶段   | Vue2          | Vue3                               |
| ------ | ------------- | ---------------------------------- |
| 创建前 | beforeCreate  | setup（取代 beforeCreate/created） |
| 创建后 | created       | setup                              |
| 挂载前 | beforeMount   | onBeforeMount                      |
| 挂载后 | mounted       | onMounted                          |
| 更新前 | beforeUpdate  | onBeforeUpdate                     |
| 更新后 | updated       | onUpdated                          |
| 卸载前 | beforeDestroy | onBeforeUnmount                    |
| 卸载后 | destroyed     | onUnmounted                        |



**🍀 三、Vue2 生命周期（传统写法）**

```js
export default {
  data() {
    return { count: 0 }
  },
  
  beforeCreate() {
    console.log("实例创建前，data 和 methods 都还没初始化");
  },

  created() {
    console.log("实例创建后，可以访问 data、methods");
  },

  beforeMount() {
    console.log("挂载前");
  },

  mounted() {
    console.log("挂载后（DOM 元素已经渲染完成）");
  },

  beforeUpdate() {
    console.log("数据更新前");
  },

  updated() {
    console.log("数据更新后");
  },

  beforeDestroy() {
    console.log("实例销毁前");
  },

  destroyed() {
    console.log("实例销毁后");
  }
}
```



**🍀 四、Vue3（Composition API）的等价写法**

取代 beforeCreate + created：

使用 `setup()`：

```js
export default {
  setup() {
    console.log("setup：数据初始化阶段");
  }
}
```



其余生命周期（Vue3 使用 onXXX）：

```js
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from "vue";

export default {
  setup() {
    onBeforeMount(() => {
      console.log("挂载前");
    });

    onMounted(() => {
      console.log("挂载后（DOM 已渲染）");
    });

    onBeforeUpdate(() => {
      console.log("更新前");
    });

    onUpdated(() => {
      console.log("更新后");
    });

    onBeforeUnmount(() => {
      console.log("卸载前");
    });

    onUnmounted(() => {
      console.log("卸载后");
    });
  }
}
```

------

🎯 五、哪个生命周期最常用？

**Vue2：**

- `created`：发请求（不依赖 DOM）
- `mounted`：操作 DOM、获取 ref
- `beforeDestroy`：清除定时器、事件监听器

**Vue3：**

- `setup`：初始化逻辑
- `onMounted`：DOM 初始化后逻辑
- `onBeforeUnmount`：清理逻辑

------

**🌟 六、最通俗易懂的记忆方法**

✔️ 创建：

- beforeCreate：啥都还没好
- created：数据 OK 了

✔️ 挂载：

- beforeMount：渲染前
- mounted：DOM 已经出现

✔️ 更新：

- beforeUpdate：准备更新
- updated：更新完了

 ✔️ 销毁

- beforeUnmount：清理
- unmounted：销毁结束

----



## 2. Diff算法

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

```html
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

```js
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

----



## 3. 组件通信方式

### **3.1 父子组件通信（最常用）**

1. **父 → 子：props**

父组件通过 props 向子组件传值。

**父组件：**

```html
<Child :msg="message" />
```

**子组件：**

```js
props: ["msg"]
```

----



2. **子 → 父：$emit（事件传值）**

**子组件：**

```html
<button @click="$emit('update', 100)">点击</button>
```

**父组件：**

```html
<Child @update="receiveData" />

<script>
export default {
  methods: {
    receiveData(v) {
      console.log("子组件值：", v);
    }
  }
}
</script>
```



### 3.2 兄弟组件通信（同一层级）

3. **EventBus（Vue2 被大量使用）**

创建 bus：

```js
// bus.js
import Vue from "vue";
export default new Vue();
```

发送：

```js
bus.$emit("add", num);
```

接收：

```js
bus.$on("add", val => {
  console.log(val);
});
```

⚠️ Vue3 已不推荐（因为不再有 new Vue()）。

----



4. **父级中转（常见但啰嗦）**

兄弟组件 A → 父 → 兄弟组件 B：

```
A $emit → 父 → 通过 props 传给 B
```

适合小项目。



### **3.3 跨层级通信（父孙 / 祖代组件）**

5. **provide / inject（Vue2 & Vue3）**

**祖先组件：**

```js
provide() {
  return {
    theme: 'dark'
  };
}
```

**子孙组件：**

```js
inject: ['theme']
```

Vue3 Composition API 写法：

```js
provide("theme", "dark");
const theme = inject("theme");
```

适合：

- 跨级传值
- 插件、UI 组件库内部状态
- 不想在多层 props 传递时使用

----



### 3.4 全局状态管理（多组件共享）

6. **Vuex（Vue2）、Pinia（Vue3）**

Vue2 - Vuex：

```
this.$store.state.count
this.$store.commit('increment')
```

Vue3 - Pinia：

```
const store = useStore();
store.count++
```

适合大中型应用、多个页面共享状态。



### 3.5 Ref 绑定通信（Vue3）

7. **父组件使用 ref 获取子组件实例**

Vue3 可以直接获取子组件的方法：

子组件：

```js
export default {
  methods: {
    sayHi() {
      console.log("hi");
    }
  }
}
```

父组件：

```js
<Child ref="childRef" />

<script setup>
import { ref, onMounted } from "vue";
const childRef = ref(null);

onMounted(() => {
  childRef.value.sayHi();
});
</script>
```

Vue2 中的 `$refs` 也可以，但有限。

----



### 3.6 附加但常见的通信方式

8. **v-model（父子双向绑定）**

Vue3 中的组件 v-model：

子组件：

```
<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<script>
export default {
  props: ['modelValue']
}
</script>
```

父组件：

```
<MyInput v-model="username" />
```

适合做表单组件。



🏆 总结（最实用版本）

| 场景         | 最佳方案                               |
| ------------ | -------------------------------------- |
| 父 → 子      | props                                  |
| 子 → 父      | $emit                                  |
| 兄弟组件     | EventBus（Vue2）、或父级中转、或 Pinia |
| 跨多层       | provide / inject                       |
| 多个页面共享 | Vuex / Pinia                           |
| 父访问子方法 | ref                                    |
| 双向绑定     | v-model                                |



## 4. 响应式

### 4.1 defineProperty

`Object.defineProperty()` 这个在 JavaScript 中非常基础且强大的 API。理解它对于理解 **Vue 2.x 的响应式原理**以及 ES5 中属性的底层控制至关重要。它允许你**精确地添加或修改**对象上现有的属性，并对该属性的**行为**进行细粒度的控制。

**语法结构**

```javascript
Object.defineProperty(obj, prop, descriptor)
```

| **参数**         | **描述**                                                     |
| ---------------- | ------------------------------------------------------------ |
| **`obj`**        | **必需。** 目标对象，即属性将被定义或修改的对象。            |
| **`prop`**       | **必需。** 一个字符串或 Symbol，表示要定义或修改的属性名。   |
| **`descriptor`** | **必需。** 属性描述符 (Property Descriptor) 对象。它定义了该属性的各种特性。 |

`descriptor` 对象有两种主要类型：**数据描述符 (Data Descriptor)** 和 **存取描述符 (Accessor Descriptor)**。一个描述符**不能同时**包含数据描述符的键 (`value` 或 `writable`) 和存取描述符的键 (`get` 或 `set`)。

1️⃣ **数据描述符 (Data Descriptor)** 

**核心键值**

| **键 (Key)**   | **默认值**  | **描述**                                                     |
| -------------- | ----------- | ------------------------------------------------------------ |
| **`value`**    | `undefined` | 属性的实际值。                                               |
| **`writable`** | `false`     | 决定属性是否可以被赋值操作修改。如果为 `false`，该属性为**只读**。 |

**配置项键值 **

| **键 (Key)**       | **默认值** | **描述**                                                     |
| ------------------ | ---------- | ------------------------------------------------------------ |
| **`enumerable`**   | `false`    | 决定属性是否可以被 `for...in` 循环或 `Object.keys()` 枚举。  |
| **`configurable`** | `false`    | 决定属性描述符本身是否可以被**修改**，以及属性是否可以从对象中**删除**。 |

**💡 示例：定义一个常量属性**

```js
const user = {};

Object.defineProperty(user, 'ID', {
    value: 'A12345',
    writable: false,     // 确保 ID 不可修改
    configurable: false, // 确保 ID 属性本身不可重新定义或删除
    enumerable: true     // ID 可以被枚举（for...in）
});

console.log(user.ID); // 输出: A12345

user.ID = 'B999'; // 尝试修改
console.log(user.ID); // 输出: A12345 (修改失败，因为 writable: false)
```



**2️⃣ 存取描述符 (Accessor Descriptor)**

用于描述由一对 `getter` 和 `setter` 函数控制的属性。**这是 Vue 2 响应式的核心。**

**核心键值**

| **键 (Key)** | **默认值**  | **描述**                                                     |
| ------------ | ----------- | ------------------------------------------------------------ |
| **`get`**    | `undefined` | **Getter 函数。** 当访问属性时，该函数被调用，其返回值即为属性的值。 |
| **`set`**    | `undefined` | **Setter 函数。** 当属性被赋值时，该函数被调用，接收新值作为参数，负责处理赋值逻辑。 |

**配置项键值**

与数据描述符相同：`enumerable` 和 `configurable`。



**💡 示例：Vue 2 响应式简化原理**

下面的例子展示了如何使用 `get` 和 `set` 来拦截属性的读写操作，并实现数据与视图的联动（简化版）：

JavaScript

```js
let priceValue = 100; // 私有变量，用于存储实际值

const product = {};

Object.defineProperty(product, 'price', {
    enumerable: true,
    configurable: true,
    
    // 拦截读取操作
    get() {
        console.log('【GET 拦截】属性被读取了！');
        // ----------------------------------------------------
        // 🌟 Vue 2 原理：在这里执行“依赖收集”（把需要更新的视图函数存储起来）
        // ----------------------------------------------------
        return priceValue;
    },
    
    // 拦截写入操作
    set(newValue) {
        console.log(`【SET 拦截】属性被设置为新值: ${newValue}`);
        if (newValue !== priceValue) {
            priceValue = newValue;
            // ----------------------------------------------------
            // 🌟 Vue 2 原理：在这里执行“派发更新”（执行之前收集到的视图更新函数）
            // ----------------------------------------------------
            console.log('>>> 视图已更新 <<<');
        }
    }
});

console.log(product.price); // 触发 GET 拦截，输出 100
product.price = 150;        // 触发 SET 拦截，输出 “视图已更新”
console.log(product.price); // 触发 GET 拦截，输出 150
```



**⚠️ Object.defineProperty() 的局限性**

1. **无法拦截新增或删除的属性：** 必须在对象**初始化时**遍历所有属性并为其定义 `getter/setter`。对于后续动态添加的属性（如 `obj.newProp = 'value'`），必须使用 `Vue.$set` 等方法手动使其响应式。
2. **无法完美拦截数组操作：** 它只能通过索引访问（如 `arr[0] = 10`）来拦截。但对于数组的原型方法（如 `arr.push(1)`、`arr.splice(...)`），它**无能为力**。Vue 2 必须通过**重写**这些数组的原型方法来解决。
3. **需要递归遍历：** 在初始化时，如果对象的属性值仍是一个对象，必须递归调用 `Object.defineProperty()` 来保证深层属性也是响应式的，这带来了较大的启动性能开销。

----

### 4.2 Proxy

`Proxy` 是 Vue 3 响应式系统的基石，它不仅解决了 Vue 2 中 `Object.defineProperty` 的所有痛点，更在整个 JavaScript 语言中提供了一种强大的**元编程 (Metaprogramming)** 能力。

**🔬 Proxy 核心机制：拦截器**

`Proxy` 的核心思想是**创建一个代理对象**，这个代理对象完全封装了目标对象。所有对代理对象的操作（如读取属性、设置属性、删除属性、调用函数等），都会被一个定制化的**处理器 (Handler)** 所拦截和处理。



**🌟 语法结构**

```js
const proxy = new Proxy(target, handler);
```

| **参数**      | **描述**                                                     |
| ------------- | ------------------------------------------------------------ |
| **`target`**  | **目标对象 (Target Object)。** 即被代理的原始对象。可以是任何对象，包括函数、数组等。 |
| **`handler`** | **处理器对象 (Handler Object)。** 包含了一系列被称为**陷阱 (Traps)** 的方法。这些陷阱定义了当操作发生时，代理对象应该如何响应。 |
| **`proxy`**   | **代理对象 (Proxy Object)。** 外部代码不应再直接操作 `target`，而是操作这个 `proxy` 对象。 |



**‼️ 陷阱 (Traps)**

陷阱是 `handler` 对象中的方法，它们与各种底层操作一一对应。`Proxy` 提供了多达 13 种陷阱，可以拦截几乎所有的对象操作。

| **常见陷阱**                                | **拦截的操作**                               | **对应 Vue 3 响应式原理**                                    |
| ------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| **`get(target, key, receiver)`**            | **拦截属性的读取操作。**                     | **依赖收集：** 确保当属性被读取时，能够记录下哪些视图依赖于它。 |
| **`set(target, key, value, receiver)`**     | **拦截属性的设置（赋值）操作。**             | **派发更新：** 确保当属性被修改时，能够通知所有依赖它的视图进行更新。 |
| **`has(target, key)`**                      | 拦截 `in` 操作符（如 `key in obj`）。        |                                                              |
| **`deleteProperty(target, key)`**           | **拦截 `delete` 操作。**                     | **派发更新：** 解决了 `Object.defineProperty` 无法拦截属性删除的问题。 |
| **`ownKeys(target)`**                       | **拦截 `Object.keys()`、`for...in` 循环。**  | **派发更新：** 解决了 `Object.defineProperty` 对属性枚举的控制不足。 |
| **`apply(target, thisArg, argumentsList)`** | 拦截函数的调用（如果 `target` 是一个函数）。 |                                                              |



**💡 Vue 3 如何利用 Proxy 解决 Vue 2 的痛点**

`Proxy` 的强大之处在于它的**非侵入性**和**全覆盖拦截**。

**1. 解决新增/删除属性的问题 (核心痛点)**

- **`Object.defineProperty` 缺陷：** 只能监听已存在的属性。
- **Proxy 解决方案：** `Proxy` 拦截的是整个对象的底层操作。
  - 当你执行 `proxy.newProp = value` 时，`set` 陷阱会被触发。Vue 可以在 `set` 陷阱内得知这是一个新增属性，并立即执行派发更新，**无需** `Vue.$set` 手动干预。
  - 当你执行 `delete proxy.prop` 时，`deleteProperty` 陷阱会被触发，视图可以立即得到通知。



2. **解决数组操作的问题 (核心痛点)**

- **`Object.defineProperty` 缺陷：** 无法监听数组的 `push`, `pop`, `splice` 等方法。
- **Proxy 解决方案：** `Proxy` 可以直接拦截数组的这些变异方法（Mutator Methods）。
  - 当你调用 `proxyArr.push(1)` 时，这个操作本质上是对 `proxyArr` 的一个 `set` 操作（修改了 `length` 属性），`Proxy` 可以捕获到 `set(length)`，从而执行更新。
  - 此外，Vue 3 对数组索引操作的响应式也更加完善和高效。



**3. 惰性响应式 (Lazy & Deep Reactivity)**

- `Proxy` 在创建时只会代理**最外层对象**。当访问到嵌套的对象属性时，**`get` 陷阱**才会被触发。
- 在 `get` 陷阱内部，Vue 才会递归地创建并返回该嵌套对象的 `Proxy` 代理。
- **结果：** 只有数据被实际访问时才会被转换成响应式，这带来了显著的性能提升，尤其对于大型复杂数据结构。

----

**🥬 实际应用场景**

`Proxy` 是一个强大的工具，在前端开发中还有很多应用：

1. **数据校验和过滤：**
   - 在 `set` 陷阱中加入逻辑，对传入的值进行类型检查或范围限制，不符合要求则抛出错误或拒绝修改。
2. **日志记录和监控：**
   - 在 `get` 和 `set` 陷阱中记录属性的访问和修改时间、次数和调用栈，用于调试和性能分析。
3. **负索引支持：**
   - 通过 `get` 陷阱，可以拦截负数索引，实现类似于 Python 数组的负索引访问。
4. **接口兼容性层 (Compatibility Layer)：**
   - 为旧接口或第三方 API 创建代理，在不修改原始 API 代码的情况下，添加新的方法或属性，实现向后兼容。



### 4.3 ref 和 reactive

Vue 3 响应式系统基于 ES6 的 **Proxy** 实现，提供了两种主要的 API 来创建响应式数据。

#### 4.3.1 reactive

- **作用：** 创建一个**响应式的对象或数组**（深层响应式）。
- **输入：** 接受一个 **对象 (Object)** 或 **数组 (Array)** 作为参数。
- **原理：** `reactive` 返回一个原始对象的 Proxy 代理。只要访问或修改对象内部的属性，都会触发响应式。**默认是深层转换**，即对象内部嵌套的对象也会被 Proxy 代理。
- **使用方式：** **无需 `.value` 访问**，直接像普通对象一样访问和修改属性。

```js
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  user: {
    name: 'Alice' // user 也是响应式的
  }
});

// 访问和修改：
state.count++;
state.user.name = 'Bob'; // 嵌套属性的修改也是响应式的
```

----

#### 4.3.2 ref

- **作用：** 创建一个**响应式的引用**，通常用于包装**基本数据类型**（如 `number`, `string`, `boolean`）。
- **输入：** 接受**任何类型**的值作为参数。
- **原理：** `ref` 返回一个具有单一属性 `.value` 的特殊对象。响应式是通过对 `.value` 属性的 `getter/setter` 拦截来实现的。
- **使用方式：**
  - 在 JavaScript/TypeScript 代码中访问或修改时，**必须使用 `.value` 访问**。
  - 在 Vue **模板 (Template)** 中访问时，**Vue 会自动解包 (Unwrap)**，无需 `.value`。

```js
import { ref } from 'vue';

const count = ref(0);
const isActive = ref(true);

// 在 JS/TS 中访问和修改：
count.value++; 
console.log(isActive.value); // true

// 在模板中：
// <template>{{ count }}</template> // 自动解包为 1
```



#### 4.3.3 常见问题与使用陷阱

**⚠️ 陷阱一：ref 在 JS 中忘记 `.value`**

**问题：** 开发者经常忘记在 `<script setup>` 块或 methods 中使用 `.value` 访问或修改 `ref` 创建的值。

**示例：**

```js
// ❌ 错误做法
const count = ref(0);
function increment() {
    count++; // ❌ 错误！count 仍然是 { value: 0 } 那个对象，不是数字。
}
// ✅ 正确做法
function increment() {
    count.value++; // ✅ 必须访问 .value 才能修改实际值
}
```



**⚠️ 陷阱二：解构 (Destructuring) reactive 对象导致的响应式丢失**

**问题：** 当你对 `reactive` 对象进行解构时，解构出来的属性会失去响应式连接，变成普通的非响应式变量。

**示例：**

JavaScript

```js
const state = reactive({ count: 0 });

// ❌ 错误做法：解构后，count 只是一个数字 0，与 state.count 不再关联
let { count } = state; 
count++; // state.count 仍然是 0，视图不会更新

// ✅ 解决方案一：始终通过原始对象引用
state.count++; 

// ✅ 解决方案二：使用 toRefs() / toRef()
// toRefs 将 reactive 对象的所有属性转换为 ref 对象的集合
const { count: countRef } = toRefs(state);
countRef.value++; // ✅ 此时 countRef 是一个 ref，可以正确触发响应式
```



**⚠️ 陷阱三：用 ref 包装 reactive 对象（或反之）**

虽然你可以用 `ref` 包裹 `reactive` 对象，或者用 `reactive` 对象包含 `ref` 属性，但这会造成混淆。

- **`reactive` 包含 `ref`：**

  JavaScript

  ```js
  const myRef = ref(10);
  const state = reactive({ count: myRef }); // 内部会自动解包
  console.log(state.count); // 10 (无需 .value)
  state.count = 20;         // 此时 myRef.value 也会变成 20
  ```

  - **问题：** 导致在 `reactive` 内部访问 `ref` 时行为不一致（在 `reactive` 中无需 `.value`，在外部需要）。

- **用 `ref` 包裹普通值 vs. 对象：**

  - 当 `ref` 包裹一个**对象**时，Vue 会自动通过 `reactive()` 处理该对象。这意味着：

    JavaScript

    ```js
    const objRef = ref({ a: 1 });
    console.log(objRef.value.a); // 正常
    // ❌ 但 objRef.value 现在也是一个 Proxy，容易让人混淆
    ```

  - **最佳实践：**

    - 基本类型用 `ref()`。
    - 对象/数组用 `reactive()`。



**最佳实践：如何选择？**

| **场景**                                         | **推荐 API**              | **理由**                                                     |
| ------------------------------------------------ | ------------------------- | ------------------------------------------------------------ |
| **基本数据类型** (`string`, `number`, `boolean`) | `ref()`                   | `reactive()` 无法直接作用于基本类型。                        |
| **需要解构的复杂对象**                           | `reactive()` + `toRefs()` | 使用 `reactive` 定义结构，再用 `toRefs` 导出，解决响应式丢失问题。 |
| **作为 Hook (Composable) 的返回值**              | 尽量使用 `ref()`          | Composable 返回 `ref` 更灵活，因为它能在模板中自动解包，且能方便地作为 `reactive` 对象的属性被访问。 |
| **模板中使用的单个响应式变量**                   | `ref()`                   | 模板中无需 `.value`，代码更简洁。                            |
| **表示一个整体的状态对象**                       | `reactive()`              | 结构清晰，逻辑上更像是一个“状态机”。                         |

----



## 5. Vue路由

### 5.1 路由模式

Vue 有两种常见路由模式：

1. **Hash 模式**（#/xxx）
2. **History 模式**（/xxx）

两者的差异主要体现在：

| 特点             | Hash 模式         | History 模式             |
| ---------------- | ----------------- | ------------------------ |
| URL 显示         | `/#/home`         | `/home`                  |
| 是否需要后端支持 | ❌ 不需要          | ✔️ 需要                   |
| 刷新是否会 404   | ❌ 不会            | ✔️ 会（若无后端处理）     |
| 底层依赖         | `hashchange` 事件 | `pushState` + `popstate` |
| SEO              | 支持差            | 更好                     |
| 实现复杂度       | 简单              | 稍复杂                   |
| 常见场景         | 后端不配合的 SPA  | 正式生产环境、SSR        |

#### 5.1.1 Hash 路由

**📌 URL 示例**

```
https://domain.com/#/home
```



**📌 工作原理（重点）**

- 浏览器 URL `#` 后面的内容叫 **hash**
- 改变 hash **不会触发页面刷新**
- 浏览器提供：

```js
window.onhashchange = () => { ... }
```

Vue Router 就监听这个事件：

- 当 hash 变了 → 触发回调
- 根据 "#/xxx" 匹配路由表 → 渲染组件



**📌 Hash 模式实现原理（简化版）**

```js
window.addEventListener("hashchange", () => {
  const path = location.hash.slice(1); // "#/home" → "/home"
  router.updateRoute(path);
});
```

改变路由：

```js
location.hash = "/about";
```



📌 优点

- 不需要服务器配置
- 刷新不会 404
- 简单易用

📌 缺点

- URL 不美观
- SEO 差
- 不符合真实 URL 标准



#### 5.1.2 History 路由

**📌 URL 示例**

```
https://domain.com/home
```



**📌 工作原理（核心）**

依赖 HTML5 的两个 API：

1. `history.pushState()` —— 改变 URL 不刷新页面

```
history.pushState({}, "", "/home");
```

浏览器地址栏改变，但页面 **不刷新**。

2. `popstate` 事件 —— 监听浏览器前进/后退

```
window.addEventListener("popstate", () => {
  router.updateRoute(location.pathname);
});
```

Vue Router 就是靠：

- pushState 改地址
- popstate 监听回退
- 权限 Vue 进行页面更新



**📌 History 模式实现原理（简化版）**

```
// 用户点击路由
router.push = function(path) {
  history.pushState({}, "", path);
  router.updateRoute(path);
};

// 用户前进/后退
window.addEventListener("popstate", () => {
  router.updateRoute(location.pathname);
});
```

📌 优点

- URL 规范，真实路径
- SEO 好
- 更现代

📌 缺点（⚠️ 重要）

**刷新会 404！**

因为用户打开：

```
domain.com/home
```

服务器会尝试查找 `/home` 文件，不存在 → 404



解决方式（Nginx/Node）：

```
try_files $uri $uri/ /index.html;
```

所有未匹配的路径都返回 index.html 交给前端。



**🧨 为什么 History 模式需要后端支持？**

总结一句：

> **History 模式的 URL 看起来像真实路径，所以后端必须兜底把所有路径重定向到 index.html，否则刷新时服务器找不到文件。**



**🌟 那 Vue 用的是哪个？**

Vue Router 初始化时：

```js
const router = createRouter({
  history: createWebHashHistory(),  // hash 模式
  // history: createWebHistory(),   // history 模式
  routes
});
```

用哪个完全取决于你配置的 history。



**🎁手写一个极简 Vue 路由（很能帮助理解）**

1. 手写 Hash 路由版：

```js
class MyRouter {
  constructor(options) {
    this.routes = options.routes;

    window.addEventListener("hashchange", () => {
      this.onHashChange();
    });

    this.onHashChange(); // 初始化
  }

  onHashChange() {
    const path = location.hash.slice(1) || '/';
    const route = this.routes.find(r => r.path === path);
    document.getElementById("app").innerHTML = route.component;
  }
}

const router = new MyRouter({
  routes: [
    { path: "/", component: "<h1>Home</h1>" },
    { path: "/about", component: "<h1>About</h1>" }
  ]
});
```

2. 手写 History 路由版

```js
class MyRouter {
  constructor(options) {
    this.routes = options.routes;

    window.addEventListener("popstate", () => {
      this.loadRoute();
    });

    this.loadRoute(); // 初始化
  }

  push(path) {
    history.pushState({}, "", path);
    this.loadRoute();
  }

  loadRoute() {
    const path = location.pathname;
    const route = this.routes.find(r => r.path === path);
    document.getElementById("app").innerHTML = route.component;
  }
}

const router = new MyRouter({
  routes: [
    { path: "/", component: "<h1>Home</h1>" },
    { path: "/about", component: "<h1>About</h1>" }
  ]
});

// 调用
router.push("/about");
```



**🚀 最终总结**

| 方式        | 原理                 | 刷新问题 | 服务端支持 | 优点             |
| ----------- | -------------------- | -------- | ---------- | ---------------- |
| **Hash**    | hashchange           | ❌ 不会   | 不需要     | 简单、兼容性好   |
| **History** | pushState + popstate | ✔️ 会     | 需要       | URL 美观、SEO 好 |



### 5.2 Vue Router

>Vue Router 是 Vue 的官方路由系统，可实现：
>
>- 单页应用（SPA）页面切换
>- URL 和页面状态同步
>- 动态路由
>- 路由钩子（权限）
>- 路由懒加载（优化性能）



#### 5.2.1 基础使用 

1. **安装**

```
npm install vue-router
```



2. **创建 router 实例**

📌 router/index.js

```js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/about", name: "About", component: About }
];

const router = createRouter({
  history: createWebHistory(), // history 模式（推荐）
  // history: createWebHashHistory(), // hash 模式
  routes
});

export default router;
```



3. **挂载路由**

📌 main.js

```js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
```



4. **页面中使用路由视图**

📌 App.vue

```
<template>
  <nav>
    <router-link to="/">首页</router-link>
    <router-link to="/about">关于</router-link>
  </nav>

  <router-view></router-view>
</template>
```

`<router-view>` 会根据当前 URL 放置对应的组件。

------



#### 5.2.2 动态路由

**1️⃣ 动态路由（非常常用）**

定义：

```js
{
  path: "/user/:id",
  name: "User",
  component: () => import("@/views/User.vue")
}
```

访问方式：

```
/user/123
```

在组件中获取 id

```js
import { useRoute } from "vue-router";

const route = useRoute();
console.log(route.params.id); // 123
```



**2️⃣ 嵌套路由（children）**

route/index.js

```
{
  path: "/user/:id",
  component: User,
  children: [
    { path: "profile", component: UserProfile },
    { path: "posts", component: UserPosts }
  ]
}
```

User.vue

```
<template>
  <h2>User Page</h2>
  <router-view></router-view>
</template>
```

访问：

- `/user/1/profile`
- `/user/1/posts`



**3️⃣ 编程式导航（JS 跳转路由）**

你不一定要用 `<router-link>`，也可以在 JS 中跳转。

```
import { useRouter } from "vue-router";

const router = useRouter();
router.push("/about");
router.replace("/login"); // 不可返回
```



#### 5.2.3 路由传参

**1. params —— 路径参数**

定义路由

```
{ path: "/user/:id", component: User }
```

跳转

```
router.push({ name: "User", params: { id: 100 } });
```

URL：

```
/user/100
```



2. **query —— URL 查询参数**

跳转：

```
router.push({
  path: "/search",
  query: { keyword: "vue" }
});
```

URL：

```
/search?keyword=vue
```

在组件获取：

```
const route = useRoute();
console.log(route.query.keyword);
```



#### 5.2.4 路由守卫

**1️⃣ 全局前置守卫**

你可以使用 `router.beforeEach` 注册一个全局前置守卫：



```js
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  return false
})
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于**等待中**。

每个守卫方法接收两个参数：

- **`to`**: 即将要进入的目标 [用一种标准化的方式](https://router.vuejs.org/zh/api/#routelocationnormalized)
- **`from`**: 当前导航正要离开的路由 [用一种标准化的方式](https://router.vuejs.org/zh/api/#routelocationnormalized)

可以返回的值如下:

- `false`: 取消当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
- 一个[路由地址](https://router.vuejs.org/zh/api/#Type-Aliases-RouteLocationRaw): 通过一个路由地址重定向到一个不同的地址，如同调用 `router.push()`，且可以传入诸如 `replace: true` 或 `name: 'home'` 之类的选项。它会中断当前的导航，同时用相同的 `from` 创建一个新导航。

```
 router.beforeEach(async (to, from) => {
   if (
     // 检查用户是否已登录
     !isAuthenticated &&
     // ❗️ 避免无限重定向
     to.name !== 'Login'
   ) {
     // 将用户重定向到登录页面
     return { name: 'Login' }
   }
 })
```

如果遇到了意料之外的情况，可能会抛出一个 `Error`。这会取消导航并且调用 [`router.onError()`](https://router.vuejs.org/zh/api/interfaces/Router.html#onError) 注册过的回调。

如果什么都没有，`undefined` 或返回 `true`，**则导航是有效的**，并调用下一个导航守卫

以上所有都同 **`async` 函数** 和 Promise 工作方式一样：



**2️⃣ 全局解析守卫**

你可以用 `router.beforeResolve` 注册一个全局守卫。这和 `router.beforeEach` 类似，因为它在**每次导航**时都会触发，不同的是，解析守卫刚好会在导航被确认之前、**所有组件内守卫和异步路由组件被解析之后**调用。这里有一个例子，根据路由在[元信息](https://router.vuejs.org/zh/guide/advanced/meta.html)中的 `requiresCamera` 属性确保用户访问摄像头的权限：

```js
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error
      }
    }
  }
})
```

`router.beforeResolve` 是获取数据或执行任何其他操作（如果用户无法进入页面时你希望避免执行的操作）的理想位置。



**3️⃣ 全局后置钩子**

你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身：

```js
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

它们对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用。

它们也反映了 [navigation failures](https://router.vuejs.org/zh/guide/advanced/navigation-failures.html) 作为第三个参数：

```js
router.afterEach((to, from, failure) => {
  if (!failure) sendToAnalytics(to.fullPath)
})
```

了解更多关于 navigation failures 的信息在[它的指南](https://router.vuejs.org/zh/guide/advanced/navigation-failures.html)中。



**💡 在守卫内的全局注入**

从 Vue 3.3 开始，你可以在导航守卫内使用 `inject()` 方法。这在注入像 [pinia stores](https://pinia.vuejs.org/) 这样的全局属性时很有用。在 `app.provide()` 中提供的所有内容都可以在 `router.beforeEach()`、`router.beforeResolve()`、`router.afterEach()` 内获取到：

main.ts

```js
const app = createApp(App)
app.provide('global', 'hello injections')

// router.ts or main.ts
router.beforeEach((to, from) => {
  const global = inject('global') // 'hello injections'
  // a pinia store
  const userStore = useAuthStore()
  // ...
})
```



**4️⃣ 路由独享的守卫**

你可以直接在路由配置上定义 `beforeEnter` 守卫：

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

`beforeEnter` 守卫 **只在进入路由时触发**，不会在 `params`、`query` 或 `hash` 改变时触发。例如，从 `/users/2` 进入到 `/users/3` 或者从 `/users/2#info` 进入到 `/users/2#projects`。它们只有在 **从一个不同的** 路由导航时，才会被触发。

你也可以将一个函数数组传递给 `beforeEnter`，这在为不同的路由重用守卫时很有用：



```js
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
]
```

当配合[嵌套路由](https://router.vuejs.org/zh/guide/essentials/nested-routes.html)使用时，父路由和子路由都可以使用 `beforeEnter`。如果放在父级路由上，路由在具有相同父级的子路由之间移动时，它不会被触发。例如：

```
const routes = [
  {
    path: '/user',
    beforeEnter() {
      // ...
    },
    children: [
      { path: 'list', component: UserList },
      { path: 'details', component: UserDetails },
    ],
  },
]
```

示例中的 `beforeEnter` 在 `/user/list` 和 `/user/details` 之间移动时不会被调用，因为它们共享相同的父级路由。如果我们直接将 `beforeEnter` 守卫放在 `details` 路由上，那么在这两个路由之间移动时就会被调用。

TIP

你也可以通过使用[路由元信息字段](https://router.vuejs.org/zh/guide/advanced/meta.html)和全局导航守卫来实现类似的行为。



**5️⃣ 组件内的守卫**

最后，你可以在路由组件内直接定义路由导航守卫(传递给路由配置的)



可用的配置 API

你可以为路由组件添加以下配置：

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`



```html
<script>
export default {
  beforeRouteEnter(to, from) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this` ！
    // 因为当守卫执行时，组件实例还没被创建！
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
    // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
  },
}
</script>
```

`beforeRouteEnter` 守卫 **不能** 访问 `this`，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建。

不过，你可以通过传一个回调给 `next` 来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数：



```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```

注意 `beforeRouteEnter` 是支持给 `next` 传递回调的唯一守卫。对于 `beforeRouteUpdate` 和 `beforeRouteLeave` 来说，`this` 已经可用了，所以*不支持* 传递回调，因为没有必要了：



```js
beforeRouteUpdate (to, from) {
  // just use `this`
  this.name = to.params.name
}
```

这个 **离开守卫** 通常用来预防用户在还未保存修改前突然离开。该导航可以通过返回 `false` 来取消。



```js
beforeRouteLeave (to, from) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (!answer) return false
}
```



**💡 完整的导航解析流程**

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

常用于：判断是否登录，没有登录跳到 /login。

router/index.js

```js
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});
```

在路由定义中标记：

```json
{
  path: "/center",
  component: Center,
  meta: { requiresAuth: true }
}
```



#### 5.2.5 滚动行为控制（切换页面时回到顶部）

```js
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});
```



#### 5.2.6 路由懒加载（性能优化最关键）

不一次性加载所有页面组件，而是按需加载。

比如：

```js
const routes = [
  {
    path: "/about",
    component: () => import("@/views/About.vue")
  }
];
```

Vue 会把这个文件打成独立的 chunk，只有访问 /about 时才加载。



**🔥 最后给你一张超级好理解的总结表**

| 功能         | 使用方式                        | 常见场景          |
| ------------ | ------------------------------- | ----------------- |
| 路由跳转     | `<router-link>` / `router.push` | 导航              |
| 动态路由     | `/user/:id`                     | 用户详情、文章页  |
| 嵌套路由     | children                        | 多级页面          |
| 路由守卫     | beforeEach                      | 登录权限          |
| 懒加载       | `() => import()`                | 优化性能          |
| 获取路由参数 | useRoute()                      | 获取 params/query |
| 控制导航     | useRouter()                     | push/replace/back |



# 四、React

## 1.生命周期

**🚀 一、函数组件生命周期（Hooks）**

函数组件其实没有“生命周期函数”，但 **通过 Hooks 模拟生命周期的时机**。

核心是：
 `useEffect(() => { ... }, deps)`



**📌 1. 组件挂载（Mount）**

对应 class：

```jsx
componentDidMount
```

对应 Hooks 写法：

```jsx
useEffect(() => {
  console.log("组件已挂载");
}, []);
```

**执行时机：**

- 首次渲染之后执行
- 类似 “onLoad”



**📌 2. 组件更新（Update）**

对应 class：

```js
componentDidUpdate
```

对应 Hooks：

```js
useEffect(() => {
  console.log("组件更新了");
});
```

但更常用：

```js
useEffect(() => {
  console.log("依赖更新了");
}, [count, name]);
```

**执行时机：**

- 依赖数组内的变量变化时执行



**📌 3. 组件卸载（Unmount）**

对应 class：

```js
componentWillUnmount
```

Hooks 写法：

```js
useEffect(() => {
  return () => {
    console.log("组件卸载");
  };
}, []);
```

**常见用途：**

- 清除定时器
- 移除监听
- 断开 WebSocket



**📌 4. 组件渲染前（Before Render）**

函数组件**没有**专门的 "before render"，因为它就是一个普通函数，**执行组件函数本身就相当于渲染前**。

如果你要做「渲染前的计算」：

```js
console.log("组件 render 过程执行了");
```



**📌 5. 组件渲染后（After Render）**

同样通过 `useEffect`

```js
useEffect(() => {
  console.log("渲染后执行");
});
```



🧠 总结（函数组件生命周期对照表）

| 生命周期 | Hooks 写法               |
| -------- | ------------------------ |
| 挂载     | `useEffect(..., [])`     |
| 更新     | `useEffect(..., [deps])` |
| 卸载     | `return () => {}`        |
| 渲染前   | 组件函数本身执行         |
| 渲染后   | 无 deps 的 useEffect     |



🧱 二、类组件生命周期（旧）

⚠️ 虽然现代 React 已不推荐，但面试常问。

1. 挂载阶段

按执行顺序：

```yaml
constructor
↓
static getDerivedStateFromProps
↓
render
↓
componentDidMount
```



2. 更新阶段

```yaml
getDerivedStateFromProps
↓
shouldComponentUpdate
↓
render
↓
componentDidUpdate
```



3. 卸载阶段

```yaml
componentWillUnmount
```



🔥 最简单的记忆方法

⭐ 函数组件生命周期核心只有 3 句：

1. 初次渲染

```js
useEffect(() => {}, [])
```

2. 数据更新

```js
useEffect(() => {}, [deps])
```

3. 组件卸载

```js
useEffect(() => { return () => {}; }, [])
```

----



## 2. 常见的Hook

### 2.1 **状态管理类 Hook**

**1️⃣ `useState`**

**作用：** 定义一个组件内部的响应式状态变量。
 **语法：**

```js
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

⚠️**下面这段代码最终打印的内容是什么？为什么？**

```js
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}

handleClick();
console.log(count);
```

**参考答案**

打印 `0`。

原因：

- 每次的 `count` 都使用 **初始值 0**
- 三次 setCount(0 + 1)

最终下一次渲染 count = 1。

**解决方案**

```setCount(prev => prev + 1)```
依赖的是 React 在批处理队列中的 “最新值”，不是闭包里的旧值

----

2️⃣ `useReducer`

**作用：** 管理复杂状态逻辑（类似 Redux 思想）
 **语法：**

```js
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



### 2.2 副作用类 Hook

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

```js
useEffect(() => {
  console.log("每次渲染都会执行")
})
```

> ✅ 执行时机：**组件初次挂载** + **每次更新后**。
>  常用于：调试日志、监听 props/state 的变化。

---

🌟**空依赖数组 `[]`**

```js
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

```js
useEffect(() => {
  console.log("当 a 或 b 变化时执行")
}, [a, b])
```

> ✅ 执行时机：当依赖项变化时重新执行。
>  常用于：

- 根据依赖变化重新请求或更新数据

----

🌟**带返回函数（清理副作用）**

```js
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



### 2.3 引用与缓存类 Hook

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

### 2.4 上下文与引用

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

```js
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



### 2.5 自定义与高级 Hook

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



### 2.6 总结表格

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





## 3. 组件通信方式

在 **React** 当中，**组件之间的信息（数据）传递** 是整个框架的核心逻辑之一。
 React 遵循 **单向数据流（one-way data flow）** 原则：

> 数据只能从父组件传到子组件，子组件不能直接修改父组件的数据。

不过 React 提供了多种机制来实现灵活的 **组件通信**。下面我会系统地讲解每种方式及其适用场景👇

### 3.1 父传子（Props 传递）

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



### 3.2 子传父（回调函数传递）

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



### 3.3 兄弟组件通信

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



### 3.4 跨层级通信（Context）

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



### 3.5 全局状态管理（Redux、Zustand、Recoil、Jotai）

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



### 3.6 Refs（父访问子实例）

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



### 3.7 事件总线（不推荐，但可用）

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

### 3.8 总结对比

| 通信方式      | 方向        | 适用场景     | 特点           |
| ------------- | ----------- | ------------ | -------------- |
| Props         | 父 → 子     | 基本传值     | 简单直观       |
| 回调函数      | 子 → 父     | 子上报事件   | 单向可控       |
| 状态提升      | 兄弟间      | 局部通信     | 中小项目       |
| Context       | 跨层级      | 主题/用户    | 无需层层传     |
| Redux/Zustand | 全局        | 大型项目     | 全局可控       |
| Ref           | 父 → 子实例 | 操作方法/DOM | 不建议用于状态 |
| 事件总线      | 任意        | 临时通信     | 破坏单向流     |



## 4.Diff算法

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



## 5. 状态管理工具

### 5.1 Redux

#### 5.1.1 Redux 与 React Context 的区别

**1️⃣ 设计目标不同（核心差异）**

**Context 的目标：解决 props drilling（跨层级传递）**

Context 本质是：
 **一个跨组件的依赖注入工具（DI）**
 用来传一些不会频繁变化的全局配置，例如：

- 主题（theme）
- 语言（i18n）
- 用户登录信息
- 表单实例（如 antd Form）

它不是状态管理工具。

**Redux 的目标：可预测、可回溯的全局状态管理**

Redux 专注于：

- 复杂状态管理
- 可预测数据流
- 动作日志化
- 可回溯（时间旅行调试）
- 中间件体系（异步控制）

这是 Context 完全做不到的。

----

**2️⃣ 数据更新机制不同（非常重要）**

**Context 更新会导致 Provider 下所有消费组件重新渲染**

即使子组件只取 context 的一个字段，也会统一重新渲染。

这是 Context 最大的痛点。

**Redux 使用了“订阅选择器” + “比较更新”**

只有使用 `useSelector` 并且选中的切片发生变化的组件才更新。

这是 Redux 性能极高的核心原因。

----

 **3️⃣ 性能模型不同**

| 特性     | Context                  | Redux                |
| -------- | ------------------------ | -------------------- |
| 更新范围 | Provider 下全部 consumer | 精准更新（selector） |
| 优化难度 | 较难，需要手写 memo      | 简单，天然优化       |
| 性能     | 大量状态时性能会崩       | 大量状态时仍稳定     |

----

**功能能力比较**

| 能力               | Context | Redux                       |
| ------------------ | ------- | --------------------------- |
| 中央状态           | ✔       | ✔                           |
| 跨层级传递         | ✔       | ✔                           |
| 撤销/回放/时间旅行 | ❌       | ✔                           |
| 中间件体系         | ❌       | ✔（thunk/saga/logger）      |
| devtools 调试      | ❌       | ✔                           |
| 异步流管理         | ❌       | ✔                           |
| store 拆分         | ❌       | ✔（combineReducers, slice） |

------

**React 官方不推荐用 Context 替代 Redux。**
 官方 FAQ 说 Context：

- 不是状态管理工具
- 更新代价非常大
- 容易引发性能问题

而 Redux 官方现代建议使用：

- RTK + React-Redux
- Context 只作为 store 注入通道



#### 5.1.2 Redux 的数据是如何更新到 UI 的？

当你写：

```js
const value = useSelector(state => state.count);
```

`useSelector` 会：

1. 订阅 store（store.subscribe）
2. 每当 store 改变，执行 selector
3. 对比上次 selector 结果是否相同（shallowEqual）
   - 不同 → 触发组件重新渲染
   - 相同 → 不渲染

所以 Redux 的 UI 更新是 **粒度级别的**。



**🟦 store.dispatch 内部做了什么？**

dispatch 的内部逻辑如下（简化）：

```js
dispatch(action) {
  currentState = reducer(currentState, action);

  for (let listener of listeners) {
    listener();  // 通知所有订阅者
  }
}
```

也就是说：

- dispatch → 触发 reducer 生成新 state
- 再触发 listener（useSelector 注册的回调）
- listener 内部决定组件要不要渲染（通过比较 state 切片）

----

**🟦 React-Redux 如何“让某个组件重新渲染”？**

关键点：
 **不是 Redux 让你渲染，而是 React-Redux 让你渲染。**

`useSelector` 内部实现相当于：

```js
const [, forceRender] = useReducer(x => x + 1, 0);
```

当 state 切片变化：

- useSelector 的订阅收到通知
- selector 比较前后值，如果变化
- 调用 forceRender() → 触发组件刷新

这就是 “组件级别更新” 的本质。

----

**🟦 为什么 Redux 不会导致整个 App 重新渲染？**

因为每个组件的渲染与否由下面两部分控制：

1️⃣ selector 是否选中了变化的数据

例如：

```js
useSelector(state => state.user.name)
```

只有 `user.name` 改变才会触发 UI。

2️⃣ React-Redux 使用浅比较（shallowEqual）

只有值真的改变时才会触发更新。

这就是 Redux 性能优秀的根本原因。

----

**🟦 完整流程总结图**

```
UI → dispatch(action)
        ↓
     reducer
        ↓
  生成新 state（immutable）
        ↓
store.subscribe → 通知所有 selector
        ↓
selector(oldSlice, newSlice) 比较
        ↓
变化 → forceRender → UI 更新
不变 → 不更新
```

----

#### 5.1.3 基本使用
##### 5.1.3.1 Redux 的三个核心概念
**1️⃣ Action（动作）**
描述 “发生了什么”。

```js
const addTodo = {
  type: 'todo/add',
  payload: '学习 Redux'
}
```
约定：

- `type` 字段必须有（通常使用字符串）
- `payload` 表示数据

------

**2️⃣ Reducer（纯函数）**

接收旧 state、action，返回新 state。

```js
function todoReducer(state = [], action) {
  switch (action.type) {
    case 'todo/add':
      return [...state, action.payload]
    default:
      return state
  }
}
```

要求：

- 必须纯函数（相同输入 → 相同输出）
- 不允许修改原 state（要返回新对象）

------

**3️⃣ Store（状态容器）**

包含：

- `getState()` 读取
- `dispatch()` 派发 action
- `subscribe()` 订阅更新

```js
import { createStore } from 'redux'

const store = createStore(todoReducer)

store.dispatch({ type: 'todo/add', payload: '学习 Redux' })

console.log(store.getState())
```



##### 5.1.3.2 结合 React 使用 Redux（原生方式）

**1️⃣创建 reducer 与 store**

```js
// store.js
import { createStore } from 'redux'

function counterReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case 'increment':
      return { value: state.value + 1 }
    default:
      return state
  }
}

export const store = createStore(counterReducer)
```

**2️⃣ 使用 <Provider> 注入 store**

```js
import { Provider } from 'react-redux'
import { store } from './store'

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

**3️⃣使用 useSelector / useDispatch**

获取 state：

```js
import { useSelector } from 'react-redux'

const count = useSelector((state) => state.value)
```

派发 action：

```js
import { useDispatch } from 'react-redux'

const dispatch = useDispatch()
dispatch({ type: 'increment' })
```

完整示例：

```js
import { useSelector, useDispatch } from 'react-redux'

export default function Counter() {
  const count = useSelector((state) => state.value)
  const dispatch = useDispatch()

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => dispatch({ type: 'increment' })}>
        加 1
      </button>
    </div>
  )
}
```

##### 5.1.3.3 Redux Toolkit（RTK）更现代、更推荐

Redux 官方现在**强烈推荐使用 Redux Toolkit（RTK）**。

RTK 解决了 Redux 原本的问题：

- 配置复杂
- 模板代码太多
- Immutable 写法麻烦
- 异步流程不直观

**1️⃣ 创建 slice**

```js
// counterSlice.js
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment(state) {
      state.value++ // 允许“修改”，RTK 会自动处理不可变
    }
  }
})

export const { increment } = counterSlice.actions
export default counterSlice.reducer
```

------

**2️⃣ 配置 store**

```js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})
```

------

**3️⃣ 组件中使用**

```js
const dispatch = useDispatch()
dispatch(increment())
```

------

##### 5.1.3.4 Redux 中的异步（thunk）

Redux 本身只支持同步，为了支持异步通常使用 Redux Thunk：

```js
export const fetchUser = () => async (dispatch) => {
  const res = await fetch('/api/user')
  const data = await res.json()
  dispatch(setUser(data))
}
```

RTK 已内置 thunk，无需额外安装。

# 五、Webpack && Vite

## 1. 打包概述

> Webpack 是一个 **前端模块打包工具**（module bundler）。它可以将你的 JS、CSS、图片等各种资源看作模块，进行处理、依赖分析，然后打包成浏览器能直接使用的文件。
>
> 简单类比：
>
> - **模块（Module）**：像乐高积木，每块积木都有自己的功能。
> - **Webpack**：像工厂，把这些乐高积木组装成最终的作品（浏览器可用的 bundle）。
> - **打包（Bundling）**：把很多小模块组合成一个或多个大文件，提高加载效率。

----



### 基础概念

**🧩 Module（模块）**
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



**📦 Chunk（代码块）**

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

----



**🪣 Bundle（最终打包产物）**

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

----



## 2. Webpack

### 2.1 Webpack的核心概念

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

### 2.2 Webpack的工作原理

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

----



### 2.3 entry

#### 2.3.1 entry是什么

Webpack 允许 entry 的值是：

```php
string | array | object | function（返回以上类型）
```

1️⃣ **entry: string — 单入口（最常见）**

```js
module.exports = {
  entry: './src/index.js'
}
```

这是默认方式。

效果：

- 生成 1 个 chunk
- 通常输出成一个 `main.js`

适用场景：

- SPA 应用（React/Vue）
- 小型项目



2️⃣ **entry: array — 多文件合并为一个入口**

数组能合并多个入口点为一个 chunk。

例如添加 polyfill：

```
entry: ['core-js/stable', 'regenerator-runtime/runtime', './src/index.js']
```

这很常用在老浏览器兼容。

也可以加载 HMR 客户端：

```
entry: ['webpack-hot-middleware/client', './src/index.js']
```

作用：

- 所有文件 → 合并成 **一个** chunk/bundle
- 数组顺序会保持执行顺序



3️⃣ **entry: object — 多入口（MPA、多业务系统用）**

这是企业级项目的常见配置。

```
module.exports = {
  entry: {
    home: './src/home/index.js',
    admin: './src/admin/index.js',
    login: './src/login/index.js'
  }
}
```

Webpack 会生成：

```
home.js
admin.js
login.js
```

应用场景👇

| 业务需求         | entry 写法 |
| ---------------- | ---------- |
| 多页面网站       | 多入口     |
| 管理后台代码拆分 | 多入口     |
| 分离不同业务线   | 多入口     |



4️⃣ **entry: function() — 动态入口（高级用法）**

在实际复杂项目（如 CMS/多租户系统）会用到。

```js
entry: () => {
  const entries = {
    main: './src/main.js'
  };

  if (process.env.BUILD_ADMIN === 'true') {
    entries.admin = './src/admin.js';
  }

  return entries;
}
```

作用：

- 根据环境变量决定打包哪些入口
- 适合大型企业项目（同一仓库包含多个应用）

你也可以 async：

```js
entry: async () => {
  return {
    main: './src/main.js'
  };
}
```



#### 2.3.2 entry字段详解

```
import
runtime
dependOn
filename
publicPath
```

**1️⃣ `import` —— 真正的入口文件路径**

```js
main: {
  import: './src/index.js'
}
```

`import` 字段 = 你原本 `entry: './src/index.js'` 写的路径。

也就是说：

> **你以前 entry 写的所有东西，现在统一写到 import 里了。**

它支持：

- 字符串
- 数组（合并入口）

例如：

```js
main: {
  import: ['core-js/stable', './src/index.js']
}
```

它的作用完全等同于：

```js
entry: ['core-js/stable', './src/index.js']
```



**2️⃣ `runtime` —— 指定该入口的 runtime chunk 名称**

Webpack 会为每个入口自动生成一个 runtime（脚本加载逻辑、模块映射表等）。

如果你不配置，runtime 会混进入口的 bundle 里，导致：

- 任何代码改动都会导致 runtime 变更
- 入口文件 hash 变了 → 长缓存失效

Webpack 5 允许：

```json
runtime: 'runtime-main'
```

这样：

```cmd
main.js（业务代码）
runtime-main.js（runtime）
```

优点：

- **业务代码的 hash 更稳定（更好缓存）**
- 多个入口可以共享 runtime
- runtime 不混入业务 bundle

比以前用 `optimization.runtimeChunk: 'single'` 更精细控制。



**3️⃣ `dependOn` —— 指定该入口依赖另一个入口的 chunk**

这是 **Webpack 5 最强大的新功能之一**。

例子：

```js
entry: {
  shared: ['react', 'react-dom'],

  home: {
    import: './src/home.js',
    dependOn: 'shared'
  },

  admin: {
    import: './src/admin.js',
    dependOn: 'shared'
  }
}
```

结果输出：

```
shared.js   ← react & react-dom
home.js
admin.js
```

含义：

- `home` 入口依赖 `shared`
- `admin` 入口也依赖 `shared`
- shared 的 bundle 不会被 home/admin 重复打出来

优势：

- 比 splitChunks 更可控
- 更适合多页、多入口场景
- 可完全手动管理公共代码



**4️⃣ `filename` —— 指定这个入口输出的 bundle 文件名**

```js
entry: {
  home: {
    import: './src/home.js',
    filename: 'home/[name].[contenthash].js',
  }
}
```

这样你可以：

- 调整 bundle 文件夹结构
- 给不同入口输出不同命名规则
- 对 SSR 或 MPA 做精细目录管理



**5️⃣ `publicPath` —— 为某一个入口自定义资源加载路径**

```js
entry: {
  admin: {
    import: './src/admin.js',
    publicPath: '/admin-static/'
  }
}
```

用途：

- 多应用合并部署
- CDN 与非 CDN 资源混合加载
- 为某些入口指定不同静态资源路径



**📦 最终总结（让你一眼记住）**

| 字段         | 作用                                |
| ------------ | ----------------------------------- |
| `import`     | 入口文件（替代原来的 entry 字符串） |
| `runtime`    | 指定 runtime chunk 名称             |
| `dependOn`   | 设置入口依赖关系（共享 chunk）      |
| `filename`   | 控制该入口输出文件的命名格式        |
| `publicPath` | 设置该入口资源 CDN 路径             |



### 2.4 output

#### 2.4.1 `output` 是什么？

在 Webpack 中：

- `entry` 决定：你的打包入口是什么
- `output` 决定：Webpack 最终要 **把打包产物输出在哪里、叫什么名字**

通俗理解：
 `output` = **打包结果输出规则**



#### 2.4.2 `output` 最常用字段详解

**1️⃣ `output.path` — 指定输出目录（绝对路径）**

Webpack 必须使用**绝对路径！**

```js
const path = require('path');

output: {
  path: path.resolve(__dirname, 'dist')
}
```

打包后的文件都会放在：

```
项目/dist
```



**2️⃣ `output.filename` — 输出的 bundle 文件名**

最常用：

```
output: {
  filename: 'bundle.js'
}
```

也可以使用占位符：

| 占位符          | 作用                                |
| --------------- | ----------------------------------- |
| `[name]`        | 入口名称                            |
| `[hash]`        | 构建时的总 hash（整个项目）         |
| `[chunkhash]`   | 每个 chunk 独立 hash（推荐生产用）  |
| `[contenthash]` | 根据内容生成 hash（最适合持久缓存） |

推荐生产模式：

```js
output: {
  filename: '[name].[contenthash].js',
}
```

好处：文件内容不变 → hash 不变 → 浏览器缓存命中



3️⃣ `output.publicPath` — 静态资源访问前缀（CDN 必备）

例如你将文件上传到 CDN:

```js
output: {
  publicPath: 'https://cdn.example.com/assets/'
}
```

生成的 HTML 引用会变成：

```html
<script src="https://cdn.example.com/assets/main.js"></script>
```

常用场景：

- CDN 加速
- 服务器的静态资源目录不在根目录
- 图片、字体需要自定义访问路径

开发环境通常设为：

```
publicPath: '/'
```



4️⃣ `output.clean` — 构建前清空 dist

Webpack 5 新增特性：

```js
output: {
  clean: true
}
```

每次构建会自动清空 `dist/`，不再需要 clean-webpack-plugin。



5️⃣ `output.assetModuleFilename` — 控制资源文件名

如图片、字体输出目录：

```js
output: {
  assetModuleFilename: 'images/[name].[contenthash][ext]'
}
```

打包后：

```
dist/images/logo.9df12a.png
```



6️⃣ `output.chunkFilename` — 非入口 chunk 的文件名

例如动态 `import()` 会生成 chunk：

```js
output: {
  chunkFilename: '[name].[contenthash].js'
}
```



7️⃣ `output.pathinfo`（开发时使用）

用于输出文件注释标识模块信息，方便调试：

```js
output: {
  pathinfo: true
}
```



8️⃣ `output.library` / `libraryTarget` — 打包成库（提供给别人用）

如果你要开发 npm 包或 SDK：

```json
output: {
  library: 'MyLib',
  libraryTarget: 'umd'
}
```



**🌟 一个完整、实际可用的 output 配置**

```js
const path = require('path')

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: 'chunks/[name].[contenthash].js',
    publicPath: '/',
    clean: true,
    assetModuleFilename: 'assets/[name].[contenthash][ext]'
  }
}
```

解释：

- 打包目录：`dist`
- JS 文件：带 contenthash，适合浏览器缓存
- 动态导入文件：放在 chunks/ 下
- 静态资源：放在 assets/ 下



**🌟 多入口项目的 output 配置**

示例：

```js
entry: {
  home: './src/home.js',
  about: './src/about.js'
},
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: '[name].[contenthash].js'
}
```

结果：

```
dist/
  home.12ab3c.js
  about.98f1a2.js
```



**🌟 生产环境中 output 的最佳实践**

最推荐的一套配置：

```
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: 'js/[name].[contenthash:8].js',
  chunkFilename: 'js/[name].[contenthash:8].chunk.js',
  publicPath: '/',
  clean: true,
  assetModuleFilename: 'assets/[name].[contenthash:8][ext]'
}
```

理由：

- 带 hash → 强缓存优化
- 目录拆分清晰：js/、assets/
- clean 帮你自动清理



####  2.4.3  output 常见问题解答

❓ 1. 为什么 Webpack 要求 `output.path` 必须是绝对路径？

因为 Webpack 可能在不同 OS、不同 loader、插件环境中运行，需要确保路径可控、稳定。



❓ 2. publicPath 必须设置吗？

不必须，但在下面情况很重要：

- 资源托管在 CDN
- 项目部署在非根目录（如 `/app/`）
- HMR（热更新）时资源找不到



❓ 3. filename 和 chunkFilename 区别？

| 字段            | 用途                       |
| --------------- | -------------------------- |
| `filename`      | 入口文件生成               |
| `chunkFilename` | 动态 import() 生成的 chunk |



### 2.5 loader

#### 2.5.1. Loaders 是什么？

> Webpack 默认只识别 **JavaScript 和 JSON 文件**。
>
> 但现实项目中，你会使用：
>
> - CSS / Less / Sass
> - 图片 jpg/png/svg
> - 字体
> - TS
> - Vue 单文件组件
> - React JSX
> - Babel 转 ES6+
> - 等等…

Webpack 本身根本不懂这些文件，所以需要用 **Loader 来告诉 Webpack 如何处理这些非 JS 文件**。



**⭐ Loader 是如何工作的？**

简单来说：

```
源文件 --> Loader 转换 --> Webpack 接受 JS 模块
```

例如：
 sass → css → js

加载器会把文件转换为 Webpack 能理解的 JavaScript 模块。



**⭐ Loader 的执行顺序（非常关键）**

执行顺序 → **从右到左，从下到上**

例如：

```js
use: ['style-loader', 'css-loader', 'sass-loader']
```

执行顺序：

1. sass-loader（先处理 Sass）
2. css-loader（把 CSS 转成 JS）
3. style-loader（把 CSS 注入页面）



**⭐ Loader 链式处理（chaining）**

Loaders 可以串联多个处理步骤。

比如你使用 TypeScript + Babel：

```js
{
  test: /\.ts$/,
  use: ['babel-loader', 'ts-loader']
}
```

Webpack 会按顺序：

```
ts → ts-loader → babel-loader → Webpack
```



#### 2.5.2 loaders配置项详解

在 Webpack 中：一个最完整的 Loader Rule 结构如下：

```js

module: {
  rules: [
    {
      test: /\.xxx$/,         // 匹配文件
      include: /src/,         // 仅处理这个目录
      exclude: /node_modules/,// 忽略处理
      use: [
        {
          loader: 'loader-name',
          options: { ... }    // Loader 的配置项
        }
      ]
    }
  ]
}

```

字段含义：

| 字段                  | 作用                               |
| --------------------- | ---------------------------------- |
| `test`                | 用正则匹配文件                     |
| `use`                 | 使用哪些 Loader（从右到左执行）    |
| `loader`              | use 的简写（当只有一个 loader 时） |
| `options`             | loader 的配置项                    |
| `exclude` / `include` | 指定加载范围                       |



⭐ use / loader / options 的区别

✔ 最简单写法（只有一个 loader）：

```js
loader: "babel-loader"
```

等同于：

```js
use: ["babel-loader"]
```

✔ 常用写法（带 options）：

```js
use: [
  {
    loader: "babel-loader",
    options: { presets: ["@babel/preset-env"] }
  }
]
```



✔ 多 loader（串联）：

```js
use: [
  'style-loader',
  {
    loader: 'css-loader',
    options: { modules: true }
  }
]
```

执行顺序：从右往左
 先执行 css-loader → 再执行 style-loader



**⭐  Loader options 的 3 种写法**

🔹 写法 1：对象写法（推荐）

```js
{
  test: /\.css$/,
  use: [
    {
      loader: "css-loader",
      options: { modules: true }
    }
  ]
}
```



🔹 写法 2：loader?query URL 写法（不推荐）

```js
loader: "css-loader?modules=true"
```

会自动解析 query 参数作为 options。

不推荐，因为不易维护。



🔹 写法 3：字符串简写（无 options 时）

```js
use: ["style-loader", "css-loader"]
```

简单项目可用。



**⭐ 常见 Loader 的 Options 示例**

🔵（1）babel-loader options

```js
{
  loader: 'babel-loader',
  options: {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ],
    cacheDirectory: true, // 启用缓存，加速构建
  }
}
```

常用配置：

- `presets`：使用的预设（转 JS）
- `plugins`：附加 babel 插件
- `cacheDirectory`：缓存，提升构建速度



🔵（2）css-loader options

```js
{
  loader: 'css-loader',
  options: {
    modules: true,         // 开启 CSS Modules
    importLoaders: 1,      // 在 css-loader 之前处理的 loader 数量
    sourceMap: true        // 生成 SourceMap
  }
}
```

`importLoaders` 很重要
 如果你写 Sass：

```scss
@import "./common.scss";
```

你希望这些 @import 的文件，也要经过 sass-loader → css-loader

就要：

```js
{
  loader: "css-loader",
  options: { importLoaders: 1 }
}
```



🔵（3）style-loader options

```js
{
  loader: "style-loader",
  options: {
    injectType: "singletonStyleTag" // 合并为一个 <style>
  }
}
```



🔵（4）sass-loader options

```js
{
  loader: "sass-loader",
  options: {
    additionalData: `$primaryColor: #3498db;`,
    sourceMap: true,
  }
}
```

`additionalData` 会在每个 SCSS 文件前注入内容。



🔵（5）file-loader options（Webpack4）

Webpack 5 使用 asset 模块就不需要 file-loader了。

```js
{
  loader: 'file-loader',
  options: {
    name: '[name].[hash:8].[ext]',
    outputPath: 'img/',
    esModule: false
  }
}
```



🔵（6）url-loader options（Webpack4）

```js
{
  loader: 'url-loader',
  options: {
    limit: 8192, // <8kb 转 base64
    name: '[name].[hash:8].[ext]',
    outputPath: 'img/'
  }
}
```



🔵（7）postcss-loader options（非常常用）

```js
{
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        require('autoprefixer'),
        require('postcss-preset-env')
      ]
    }
  }
}
```



⭐ 6. include / exclude 的作用（非常重要）

例如你希望只处理 src 文件夹：

```js
{
  test: /\.js$/,
  include: path.resolve(__dirname, 'src'),
  exclude: /node_modules/,
  use: 'babel-loader'
}
```

优化：

- 避免无意义编译 node_modules
- 构建速度能快几倍



#### 2.5.3 自定义Loader（用于加载自定义 loader）

如果你的自定义 loader 放在 /loaders 目录：

```js
resolveLoader: {
  modules: ['node_modules', 'loaders']
}
```

Webpack 就会在这两个目录找 loader。



⭐ 自定义 Loader 如何读取 options？

自定义 loader 写法：

```js
function myLoader(source) {
  const options = this.getOptions(); // 🔥 获取 options
  console.log(options);

  return source;
}

module.exports = myLoader;
```

Webpack 会把：

```js
{
  loader: "my-loader",
  options: { prefix: "Hello" }
}
```

传入 loader 中。



### 2.6 plugins

当然可以！Webpack **Plugins（插件）** 是 Webpack 中最强大、最灵活的机制，用来扩展 Webpack 的功能。Loaders 专注于**处理单个文件**，而 Plugins 负责**参与整个打包生命周期**，对打包流程进行更加深度和广泛的控制。

下面我会从 *概念 → 作用 → 工作机制 → 常见 Plugins → 用法示例 → 自定义 Plugin* 全面讲解。



#### 2.6.1 Plugins是什么

>Webpack 插件是在 Webpack 打包的生命周期中，执行特定任务的扩展机制，比如：
>
>- 自动生成 HTML
>- 清理打包目录
>- 压缩 JS / CSS
>- 复制静态资源
>- 环境变量注入
>- Tree Shaking 支持
>- 代码分析与优化
>
>Loaders 只处理文件，Plugins 能控制整个构建过程。



**✅ Plugins 的本质是什么？**

其实 plugin 本质上就是一个 **包含 apply() 方法的类**。

Webpack 在构建时会调用这个 apply 方法，并给你传入 `compiler` 对象。

你就可以通过 compiler **监听 Webpack 的生命周期**，执行任何你想做的事情。



#### 2.6.2 Webpack 中 Plugins 的基本使用方式

在 `webpack.config.js` 中：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  plugins: [
    new CleanWebpackPlugin(), // 实例化
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
```

Plugins 必须写在 `plugins` 数组中，并且是 **类的实例**！



**✅ 常见 Webpack Plugins 详细介绍**

**1️⃣ HtmlWebpackPlugin**

自动生成 HTML 文件，并自动注入打包后生成的 JS/CSS。

```js
new HtmlWebpackPlugin({
  template: './src/index.html',
  minify: true
})
```

✨ 作用：

- 不需要手动维护 HTML
- 自动帮你 `<script src="main.12345.js">`



**2️⃣ CleanWebpackPlugin**

打包前清空目录。

```js
new CleanWebpackPlugin()
```



**3️⃣ DefinePlugin**

注入全局变量（最常见是环境变量）

```js
new webpack.DefinePlugin({
  __BUILD_ENV__: JSON.stringify('production')
})
```



**4️⃣ MiniCssExtractPlugin**

提取 CSS 文件，而不是内联在 JS 里。

```js
new MiniCssExtractPlugin({
  filename: 'css/[name].[contenthash:8].css',
})
```



**5️⃣ CopyWebpackPlugin**

复制静态资源到输出目录。

```js
new CopyWebpackPlugin({
  patterns: [
    { from: 'public', to: 'public' }
  ]
})
```



**6️⃣ TerserWebpackPlugin（内置于生产模式）**

压缩 JS，支持 ES6。



**7️⃣ BundleAnalyzerPlugin**

可视化查看打包构成（强烈推荐）

```js
new BundleAnalyzerPlugin()
```



**✅ Plugins vs Loaders（对比理解）**

| 特性     | Loader                    | Plugin                         |
| -------- | ------------------------- | ------------------------------ |
| 作用对象 | 文件（.js / .css / .png） | 整个打包过程                   |
| 执行方式 | 处理文件输入 → 输出       | Hook Webpack 生命周期          |
| 使用方式 | `module.rules.use`        | `plugins: []`                  |
| 场景     | 转换文件（TS、CSS、图片） | 优化、注入变量、压缩、生成文件 |

📌 **一句话总结：Loaders 转换文件，Plugins 深度参与构建生命周期。**



✅ Plugins 配置示例

假设你有多个 loader 和多个 plugin，一般结构如下：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  module: {
    rules: [
      // js
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      // css
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      // 图片
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin()
  ]
}
```



#### 2.6.3 如何自定义一个 Webpack Plugin？

一个最简单的插件长这样：

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('Webpack 构建完成！')
    })
  }
}

module.exports = MyPlugin
```

使用：

```js
plugins: [
  new MyPlugin()
]
```

这说明：

- plugin 就是一个 class
- 必须实现 apply()
- 通过 hooks 监听事件



## 3. Vite

### 3.1 Vite的基本概念

> Vite（法语，意为“快速”）是一个现代前端构建工具，由尤雨溪（Vue 作者）开发。它主要解决了传统前端工具（Webpack、Rollup 等）在**开发环境启动慢、热更新慢**的问题。
>
> 其核心特性为：
>
> 1. **基于原生 ES 模块开发**
>    - 开发模式下，Vite 不打包文件，而是将源代码直接以 ESM 的形式提供给浏览器。
>    - 浏览器按需加载模块，避免传统打包的“全量编译”。
> 2. **按需编译**
>    - 只有浏览器请求的模块会被即时编译（on-demand）。
>    - 比如你只修改了一个组件，Vite 只会重新编译这个组件，而不是整个项目。
> 3. **快速热模块替换（HMR）**
>    - 利用 WebSocket，监听文件变化，只刷新变化模块。
>    - 对 React/Vue 组件状态友好，不会丢失局部状态。
> 4. **现代语法支持**
>    - 默认支持 TypeScript、JSX/TSX、Vue SFC（Single File Component）。
>    - 支持 CSS Modules、PostCSS、Sass、Less 等预处理器。
> 5. **优化构建（Build）**
>    - 开发模式用 ESM，生产模式用 Rollup 打包。
>    - 内置静态资源优化、Tree Shaking、代码分割等功能。
> 6. **插件系统**
>    - Vite 插件兼容 Rollup 插件，大量现成插件可用。
>    - 可以扩展功能，如自动导入组件、压缩图片、SVG 处理等。

#### 3.1.1 Vite 构建过程（Build Flow）

Vite 有两个主要模式：**开发模式（Dev Server）** 和 **生产模式（Build）**。

**开发模式**

1. 浏览器请求你的入口 HTML（比如 `index.html`）。
2. Vite Dev Server 根据 HTML 中的 `<script type="module" src="./main.js">` 加载 JS。
3. 当浏览器请求模块时：
   - Vite 将源码通过 ESBuild 快速转换（例如 TS → JS）。
   - 返回给浏览器，浏览器直接运行。
4. 如果文件改变：
   - Vite 通过 WebSocket 告诉浏览器只更新修改的模块。
   - 无需刷新整个页面。

> ⚡ 核心是利用浏览器对 ESM 的原生支持，实现**按需即时编译**。

----



**生产模式**

1. 使用 Rollup 对源码进行打包优化。
2. 支持代码分割、Tree Shaking、静态资源优化。
3. 输出可部署的静态文件（HTML/CSS/JS）。

----

**开发模式 vs 生产模式**

| 阶段          | 开发模式 Dev           | 生产模式 Build            |
| ------------- | ---------------------- | ------------------------- |
| 文件处理      | 原生 ESM，按需加载     | Rollup 打包，Tree Shaking |
| 转换工具      | ESBuild（超快）        | Rollup + ESBuild          |
| 热更新（HMR） | 支持，模块级别刷新     | 不支持                    |
| 优化策略      | 无需打包优化           | 压缩、分块、静态资源优化  |
| 输出          | 内存中运行，不生成文件 | dist 目录生成静态文件     |



#### 3.1.2  Vite 生命周期（Hooks）

Vite 本身基于 Rollup 插件系统，所以也有类似的**生命周期 Hook**，主要用于**插件开发和自定义处理**。

| Hook 名称         | 时机/用途                               |
| ----------------- | --------------------------------------- |
| `config`          | Vite 读取配置时调用，可以修改或扩展配置 |
| `configResolved`  | 配置解析完成后调用                      |
| `buildStart`      | 构建开始时触发                          |
| `transform`       | 模块内容转换（TS → JS、Vue SFC → JS）   |
| `load`            | 自定义模块加载                          |
| `resolveId`       | 自定义模块解析                          |
| `buildEnd`        | 构建结束                                |
| `closeBundle`     | 打包完成后调用                          |
| `handleHotUpdate` | HMR 更新时触发                          |

> ⚡ Tip：如果你写 Vite 插件，基本就是在这些生命周期 hook 里处理业务逻辑。



#### 3.1.3 Vite 配置项（vite.config.js）

Vite 的配置非常灵活，核心用 `defineConfig` 定义：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  root: './src',           // 项目根目录
  base: '/',               // 生产打包的基础路径
  server: {                // 开发服务器配置
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  build: {                 // 构建配置
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue']
        }
      }
    }
  },
  resolve: {               // 模块解析别名
    alias: {
      '@': '/src'
    }
  },
  css: {                   // CSS 相关
    preprocessorOptions: {
      scss: { additionalData: `$color: red;` }
    }
  },
  define: {                // 全局常量
    __DEV__: true
  },
  optimizeDeps: {          // 依赖预构建
    include: ['axios']
  }
})
```

(1) 核心配置分类

1. **root**：项目根目录。
2. **base**：生产环境下的公共路径。
3. **server**：开发服务器相关，如端口、代理、HMR。
4. **build**：生产打包配置，如输出目录、压缩、Rollup 选项。
5. **resolve**：模块解析配置，如别名。
6. **plugins**：插件数组。
7. **css**：CSS 预处理器和模块相关配置。
8. **define**：定义全局常量。
9. **optimizeDeps**：依赖预构建配置，加快冷启动速度。
10. **envPrefix**：环境变量前缀配置。

------



**Vite vs Webpack 对比**

| 特性         | Vite                          | Webpack          |
| ------------ | ----------------------------- | ---------------- |
| 构建模式     | Dev: ESM + 按需编译           | Dev: 全量打包    |
| 热更新 (HMR) | 秒级更新，保留状态            | 慢，需要重新打包 |
| 默认支持     | TypeScript、ESM、JSX/TSX、Vue | 需要 loader 配置 |
| 插件生态     | Rollup 插件兼容               | 自有丰富插件     |
| 生产构建     | Rollup 打包优化               | 自己配置优化     |

✅ 结论：Vite 更轻量、启动快、适合现代前端开发，Webpack 更灵活、适合复杂项目或老项目迁移。







# 六、性能优化方案

## 1. 总述

### 1.1 资源加载优化

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

### 1.2 渲染性能优化

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

### 1.3 脚本执行优化

**目标：降低 JS 阻塞，提高交互速度。**

**(1)异步加载 JS**

- `<script src="xxx.js" defer>`：延迟执行，按顺序。
- `<script src="xxx.js" async>`：异步执行，不保证顺序。

(2)**减少主线程压力**

- 将计算密集任务放入 `Web Worker`。
- 使用 `OffscreenCanvas` 处理复杂绘图。

(3)**事件节流与防抖**

- 避免滚动、窗口缩放时频繁触发事件。

### 1.4 构建与部署优化

**目标：构建产物更轻，部署加载更快。**

1. **SSR / SSG**
   - 服务端渲染（SSR，Nuxt/Next.js）或预渲染（SSG），减少首屏白屏时间。
2. **懒加载与预加载**
   - **懒加载**：路由级、组件级、图片懒加载。
   - **预加载**：关键资源（字体、首屏脚本）使用 `<link rel="preload">`。
3. **Bundle 优化**
   - 使用 CDN external（Vue、React、lodash 等大库外链）。
   - 按需引入 UI 库组件（如 `babel-plugin-import`、`unplugin-vue-components`）。

### 1.5 运行时体验优化

**目标：让用户感知“快”。**

1. **骨架屏 / Loading 占位**
   - 首屏请求慢时，展示骨架屏或加载动画，减少心理等待。
2. **懒加载图片 / 组件**
   - 滚动到可视区域时再加载。
3. **PWA**
   - 利用 Service Worker 离线缓存，提高二次访问速度。

### 1.6 监控与分析

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

### 总结一下：

- **加载阶段** → 代码分割、压缩、缓存、CDN。
- **渲染阶段** → 减少重绘、虚拟列表、GPU 动画。
- **交互阶段** → 防抖节流、Web Worker。
- **部署阶段** → SSR/SSG、懒加载、预加载。
- **运行时体验** → 骨架屏、PWA。
- **持续优化** → 性能监控、指标追踪。

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

## 2. 资源加载优化

### 2.1 代码分割

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

### 2.2 TreeShaking清除未使用代码

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



### 2.3 压缩和混淆

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



### 2.4 图片资源优化

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



### 2.5 静态资源压缩

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



## 3. 渲染性能优化

### 3.1 减少重排 (Reflow) 与重绘 (Repaint)

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

### 3.2 合理使用 CSS

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

### 3.3  虚拟列表 / 分片渲染

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

----

**⚠️ 虚拟列表的常见问题**

**❗️item长度不一致的问题**

>该策略适用于内容不固定、列表项高度可能各不相同的场景。
>
>核心实现目标
>
>1. 初始化时使用一个**估计高度**提供滚动条。
>2. 当列表项进入视口并被渲染后，**测量**其真实高度。
>3. **缓存**真实高度。
>4. **校准**总高度和滚动条位置，替换掉估计高度。

1. 估算高度与缓存

我们使用一个 `Map` 来存储每个列表项的真实高度，以其索引作为键。

**核心状态：*

```js
// React/Vue 伪代码
const data = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, content: `Item ${i}` })));
// 缓存真实高度：key=索引, value=真实高度
const sizeMap = new Map(); 
// 初始的估计高度
const ESTIMATED_HEIGHT = 100; 
```

2. 测量回调（使用 ResizeObserver）

使用 `ResizeObserver` 替代传统的 `getBoundingClientRect()`，因为它专门用于监听元素尺寸的变化，效率更高。

**代码实例（React Hook 伪代码）：**

JavaScript

```js
// 假设这是列表项组件，用于测量自身高度
function ItemComponent({ index, onResize }) {
  const itemRef = React.useRef(null);

  // 挂载和更新后，创建或使用 ResizeObserver
  React.useEffect(() => {
    if (!itemRef.current) return;

    // 创建观察者
    //entries是ResizeObserver观测对象数组，我们这里仅仅观测了一个元素
    const observer = new ResizeObserver((entries) => {
      // 检查是否有尺寸变化
      for (let entry of entries) {
        // 报告给父组件：索引和真实高度
        const height = entry.contentRect.height;
        onResize(index, height);
      }
    });

    observer.observe(itemRef.current);
    // 清理函数：组件卸载时停止观察
    return () => observer.disconnect();
  }, [index, onResize]);

  return <div ref={itemRef}>... Item Content ...</div>;
}

// 父组件中的测量处理函数，即传递给子组件的onRize函数
const handleItemResize = useCallback((index, height) => {
    if (sizeMap.get(index) !== height) {
        sizeMap.set(index, height);
        // 🌟 关键：触发重新计算总高度和滚动位置的逻辑
        // 触发 setTotalHeight / setStartOffset 等状态更新
        recalculateLayout(); 
    }
}, [recalculateLayout]);
```

**3. 校准总高度计算 (RecalculateLayout)**

这是最复杂的逻辑，它将缓存的真实高度和估计高度结合起来计算总高度。

**伪代码逻辑：**

JavaScript

```js
function recalculateLayout() {
    let totalHeight = 0;
    let measuredCount = 0; // 已测量真实高度的元素数量

    // 1. 遍历所有数据项
    for (let i = 0; i < data.value.length; i++) {
        const measuredHeight = sizeMap.get(i);
        
        if (measuredHeight !== undefined) {
            // 如果已测量，使用真实高度
            totalHeight += measuredHeight;
            measuredCount++;
        } else {
            // 如果未测量，使用估计高度
            totalHeight += ESTIMATED_HEIGHT;
        }
    }

    // 2. 更新平均高度 (可选但推荐)
    // 使用已测量的真实数据，重新计算更准确的平均高度，用于未测量项的估算。
    const newAverageHeight = measuredCount > 0 
        ? (totalHeight / measuredCount) 
        : ESTIMATED_HEIGHT;

    // 3. 更新占位符高度（触发视图更新）
    // setPlaceholderHeight(totalHeight); 
}
```



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

## 4. 排查思路

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

## 5. 性能指标优化思路

>🧠 前端性能的核心指标主要是：
>
>- **LCP（Largest Contentful Paint）最大内容渲染时间**
>- **FID（First Input Delay）首次输入延迟**
>- **INP（Interaction to Next Paint）整体交互响应指标**
>- **CLS（Cumulative Layout Shift）累计布局偏移**
>- **TTFB（Time To First Byte）首字节时间**
>- **FCP（First Contentful Paint）首次内容绘制**
>- （扩展）**TTI、FP、SI、TBT** 等



### 5.1 LCP 优化（最大内容渲染速度）

**关键：尽快让用户看到页面主体内容（主图、标题等）**

🔍 LCP 可能被哪些因素影响？

- 主图（banner）、视频加载慢
- CSS 阻塞渲染
- JS 阻塞渲染
- 大型字体文件阻塞渲染
- 服务器响应慢、未缓存
- 大量重定向、304 等



**🔧 优化策略（极详细版）**

1️⃣ **优化图片（LCP 的最大瓶颈）**

- 使用 next/image 或 nuxt/image（自动压缩、懒加载）
- 使用 **WebP / AVIF** 替代 jpg/png（体积缩小 50%+）
- 通过 CDN 提供“多尺寸响应式图片”
- 使用 `<img fetchpriority="high">`
- 大图 lazyload（但注意：LCP 的元素不能 lazyload）

2️⃣ **减少 CSS 阻塞**

浏览器必须解析 CSS 才能渲染，因此 CSS 会延迟 LCP。

优化：

- 关键样式（above-the-fold）使用 **Critical CSS 内联**
- 其他 CSS 通过 `media="print"` 或 `rel="preload"` 延迟加载
- CSS 文件压缩、去掉未使用的 CSS（PurifyCSS、PurgeCSS）

3️⃣ **减少 JS 阻塞渲染**

过多 JS 会让浏览器在解析脚本期间无法渲染页面。

优化：

- script 加 **defer**
- 动态加载非关键 JS（懒加载）
- Webpack/Next 开启 **tree shaking**
- 分包（splitChunks）
- 仅首屏加载必需 JS

4️⃣ **加速服务端响应**

- 启用 **Gzip / Brotli 压缩**
- 启用 HTTP/2 / HTTP/3（多路复用）
- 使用 CDN 缓存静态资源
- 使用 SSR/SSG 提前生成页面，减轻浏览器渲染压力



### 5.2 FID 优化（首次输入延迟）

**核心：用户第一次点击 → 页面响应的时间**

高 FID 的根本原因是：
 ➡️ **主线程被 JS 阻塞**

🔍 FID 主要受影响的场景：

- 巨大的 JS bundle（React 组件太多）
- 第三方库注入（Analytics、Ads）
- 重计算（排序/循环/正则等）



**🔧 优化策略**

1️⃣ **减少 JS 体积**

- 按需加载（import()）
- 组件懒加载
- 删除不必要 polyfill
- 压缩代码（Terser）

2️⃣ **减少 JS 执行时间**

将耗时任务拆小，使用：

- requestIdleCallback（浏览器空闲再执行）
- setTimeout 分片任务拆除

3️⃣ **将计算挪到 Web Worker**

适合：

- 大数据计算
- markdown 编译
- 加密/解密
- 正则大量匹配

避免阻塞主线程。

4️⃣ **使用更轻量的框架**

- 使用 Preact 替代 React（仅 3kb）
- 使用 Svelte / SolidJS



### 5.3 INP（Interaction to Next Paint）优化

INP 是 FID 的升级指标，衡量 **整个生命周期内所有交互的响应速度，而不是第一次。**

影响 INP 的常见问题：

- React 组件频繁重渲染
- 大量 setState（例如 input 输入时产生许多 re-render）
- useEffect 的 DOM 操作阻塞
- 动画/过渡卡顿



**🔧 优化策略**

1️⃣ **减少组件不必要重新渲染**

使用：

- React.memo
- useCallback
- useMemo
- useTransition（让不重要的更新变“低优先级”）
- useDeferredValue（降低输入控制组件的卡顿）

2️⃣ **虚拟滚动**

列表过长会卡顿：
 ➡️ 用 react-window / react-virtualized

3️⃣ 优化动画

- 使用 transform/opacity（不会触发重排）
- 使用 requestAnimationFrame 控制 DOM 更新频率
- 使用 GPU 加速（translate3d）

4️⃣ 尽量避免复杂 DOM 操作

例如：

- 遍历 5000 个节点
- 多次触发布局（offsetHeight/scrollTop 连续读写）



### 5.4 CLS 优化（布局稳定性）

**用户阅读过程中页面元素突然跳动，是最糟糕的体验之一。**

**🔍 CLS 波动的主要原因：**

- 图片未设置 width、height → 加载后撑开布局
- 字体加载闪烁（FOUT/FOIT）
- 懒加载内容加载后挤开布局
- 广告等异步组件渲染后挤动布局



**🔧 优化策略**

**1️⃣ 所有图片标明尺寸**

即使是响应式布局，也可以用：

```
img {
  aspect-ratio: 16 / 9;
}
```

**2️⃣在广告/懒加载内容处提前占位**

预留固定高度。

**3️⃣ 使用 font-display: swap**

避免字体加载导致内容跳动。

**4️⃣ 避免动态插入较高 DOM，或用 placeholder 代替**



### 5.5 TTFB 优化（服务器首字节时间）

主要是后端/网络问题，但前端也能优化。

🔧 优化策略

**1️⃣ CDN 分发静态资源**

减少地理位置延迟。

**2️⃣ SSR 缓存**

例如使用：

- Redis 缓存 SSR 结果
- Next.js ISR（增量静态生成）

**3️⃣ 减少服务器计算开销**

减少数据库查询次数、网络调用。



### 5.6 FCP 优化（首次内容渲染）

和 LCP 类似，但只要求尽快出现“任何内容”。

优化方法：

- 内联关键 CSS
- preload 字体、css
- preconnect 优化 DNS 和 TCP 连接
- 删除 render-blocking script



💥 总体性能指标（附额外优化）

✔ 使用 HTTP/2/3 多路复用

减少并发请求限制。

✔ 缓存策略

- 强缓存：Cache-Control: max-age=31536000
- 协商缓存：ETag

✔ Service Worker 离线缓存

PWA 加速加载。

✔ 图层优化避免重排

- transform: translateZ(0)
- will-change: transform

------



# 七、场景

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

## 1. 登录方案

### 1.1 **基于 Cookie 的 Session 方案**

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

### 1.2 **基于 Token 的方案（JWT、OAuth2 等）**

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




### 1.3 **单点登录（SSO，Single Sign-On）**

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

### 1.4 **第三方登录（OAuth2.0 授权）**

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

### 1.5  **短信/邮箱验证码登录**

- **流程**：
  1. 用户输入手机号或邮箱。
  2. 系统发送验证码。
  3. 用户输入验证码，后端验证并颁发 Token。
- **优点**：
  - 无需记密码，安全性高（配合风控）。
- **缺点**：
  - 成本较高（短信/邮件服务）。
  - 如果验证码逻辑不严谨，容易被攻击。

### 1.6 小结

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

## 2. 跨域解决方案

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





## 3. 图片懒加载

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

## 4. 懒加载实现

>懒加载指：**在实际需要时才加载模块/组件**，减少首屏加载体积，提高页面加载速度。
>
>在现代前端，懒加载通常借助 **动态 import()**，由打包工具（Webpack / Vite / Rollup）生成独立的 chunk，然后在运行时按需加载。



**🟦 React 的懒加载实现**

**1️⃣ React 懒加载组件：`React.lazy() + Suspense`**

📌 核心写法

```js
const MyComponent = React.lazy(() => import('./MyComponent'));

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </React.Suspense>
  );
}
```



原理解释

1. **`import('./MyComponent')` 会让打包工具生成一个异步 chunk**
2. React.lazy 会将这个 Promise 封装成一个 “Lazy Component”
3. Suspense 会在模块加载期间显示 fallback（loading）
4. 加载完成后渲染真实组件



重要点

- 必须**配合 `<Suspense>`** 使用
- 支持 code-splitting（按块拆分）
- React 18 支持 SSR + lazy（Streaming SSR 需要 fallback）



**2️⃣ React 路由懒加载（React Router）**

```js
const Home = React.lazy(() => import('./pages/Home'));

<Route
  path="/home"
  element={
    <Suspense fallback={<Loading />}>
      <Home />
    </Suspense>
  }
/>
```

React Router 不内置懒加载，但可搭配 React.lazy 使用。



**3️⃣React 资源懒加载（图片等）**

- 图片懒加载：`loading="lazy"`
- IntersectionObserver 手动实现
- 第三方库：react-lazyload 等

----



🟩 Vue 的懒加载实现

Vue 的懒加载也基于 **动态 import()**，但会由框架封装得更顺滑。

**1️⃣ Vue 按需组件加载：`defineAsyncComponent()`**

Vue 3 写法

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComp.vue')
)
```

在模板中：

```js
<Suspense>
  <AsyncComp/>
  <template #fallback>
    加载中...
  </template>
</Suspense>
```



Vue 2 写法（异步组件）

```js
const AsyncComp = () => import('./MyComponent.vue')
```

Vue 识别返回 Promise 就当作异步组件处理。

**原理**

Vue 会在渲染异步组件时自动：

1. 加载模块（动态 import）
2. 显示 loading 组件（可配置）
3. 出现错误时显示 error 组件
4. 加载完成后渲染真实组件

Vue 内置异步组件能力，比 React.lazy 更“原生”。



**2️⃣ Vue Router 路由懒加载**

```js
const Home = () => import('../views/Home.vue')

const routes = [
  { path: '/home', component: Home }
]
```

Vue Router 会自动生成 chunk。



**3️⃣ Vue 图片懒加载**

- Vue 指令（v-lazy）
- Vue-lazyload 库
- IntersectionObserver

示例：

```html
<img v-lazy="imgSrc" />
```



**🔧 Vue vs React 懒加载对比总结**

| 特性               | Vue                                                          | React                          |
| ------------------ | ------------------------------------------------------------ | ------------------------------ |
| 核心懒加载组件 API | `defineAsyncComponent()`（Vue3）<br/>`() => import()`（Vue2） | `React.lazy()`                 |
| Loading fallback   | `<Suspense>` 或 `loading/error` 选项                         | `<Suspense>` 必须使用          |
| 易用性             | 更“自动化”                                                   | 更显式、灵活                   |
| 路由懒加载         | Vue Router 原生支持                                          | React Router 需搭配 React.lazy |
| 资源懒加载         | 指令体系更统一（v-lazy）                                     | 用 hook/IoObserver 实现        |
| SSR 支持           | Vue 3 + Suspense 自动处理                                    | React 18 支持，但更复杂        |



**🧠 懒加载何时应该使用？**

 适用场景

✔ 路由页面
 ✔ 大组件、图表组件（Echarts）
 ✔ 富文本编辑器（Quill、TinyMCE）
 ✔ 第三方库（moment.js、monaco editor）
 ✔ 后台管理系统的子模块

 不适用场景

✘ 首屏必须展示的组件
 ✘ 小组件（不值得拆分）
 ✘ 高频切换的组件（反复加载影响体验）



**📈 性能优化建议**

- 加载前置（prefetch）：

  ```
  <link rel="prefetch" href="/static/chunk-xxx.js">
  ```

- 路由分块策略（基于业务模块）

- skeleton UI 替代 loading

- 缓存懒加载组件（Vue keep-alive / React memoization）

- 合理 chunk 拆分（避免过小 chunk 引入大量请求）



# 八、浏览器

## 1. 浏览器存储

| 类型                               | 特点                     | 生命周期                    | 大小限制                | 是否随请求发送到服务器 |
| ---------------------------------- | ------------------------ | --------------------------- | ----------------------- | ---------------------- |
| **Cookie**                         | 早期方案，用于服务端通信 | 可自定义（Expires/Max-Age） | ~4KB                    | ✅ 会自动携带           |
| **localStorage**                   | 永久存储在本地           | 永久（除非手动删除）        | ~5MB                    | ❌ 不会                 |
| **sessionStorage**                 | 临时存储（仅当前标签页） | 关闭标签页即清除            | ~5MB                    | ❌ 不会                 |
| **IndexedDB**                      | 面向对象数据库           | 永久                        | 几百 MB（依浏览器而定） | ❌ 不会                 |
| **Cache Storage (Service Worker)** | 用于 PWA 缓存资源        | 永久                        | 视浏览器而定            | ❌ 不会                 |

### **1.1 Cookie**

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

### **1.2 localStorage**

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

### **1.3 sessionStorage**

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

### 1.4 IndexedDB

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



### 1.5 Cache Storage

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



### 1.6 总结与对比

| 功能         | Cookie         | localStorage       | sessionStorage | IndexedDB | Cache Storage |
| ------------ | -------------- | ------------------ | -------------- | --------- | ------------- |
| 数据类型     | 字符串         | 字符串             | 字符串         | 对象      | 文件资源      |
| 持久性       | 可设置         | 永久               | 会话级         | 永久      | 永久          |
| 大小限制     | ~4KB           | ~5MB               | ~5MB           | 几百MB    | 几百MB        |
| 服务器可访问 | ✅              | ❌                  | ❌              | ❌         | ❌             |
| 操作难度     | 较高           | 简单               | 简单           | 中等      | 中等          |
| 场景         | 登录状态、会话 | 偏好设置、本地缓存 | 临时表单       | 离线数据  | 静态资源缓存  |

------

## 2. Web Worker

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

### 2.1 Web Worker 的基本用法

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

### 2.2 **Web Worker 的生命周期**

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

### 2.3 类型与限制

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

### 2.4 sharedWorker
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

### 2.5 self

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



## 3. Service Worker

> **Service Worker 是一种独立于网页运行的后台脚本**，它充当了网页与网络之间的“中间代理层”。
>  它可以拦截所有网页发出的网络请求，并决定：
>
> - 要不要去请求网络；
> - 是否直接返回缓存；
> - 是否在后台更新资源。

换句话说：

> 它让网页拥有「离线工作」的能力

### 3.1 核心特性

| 特性           | 说明                                                      |
| -------------- | --------------------------------------------------------- |
| **独立线程**   | 不运行在主线程中，不会阻塞 UI                             |
| **可拦截请求** | 可以代理网页的所有网络请求（fetch）                       |
| **可缓存资源** | 可以将 HTML、CSS、JS、图片等静态资源缓存起来              |
| **可离线访问** | 即使用户离线，也能从缓存返回页面                          |
| **事件驱动**   | 通过生命周期事件（install、activate、fetch）控制逻辑      |
| **必须 HTTPS** | 为了安全，Service Worker 只能在 HTTPS 或 localhost 上运行 |
| **异步通信**   | 使用 `postMessage()` 与页面通信                           |



### 3.2 serviceWorker的生命周期

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



### 3.4 Cache Storage API

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

## 4 浏览器渲染过程

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



## 5. 浏览器对象及Web API

浏览器提供的对象大体可以分为 4 大类：

```
① 全局环境 (Window / globalThis)
② DOM（Document Object Model — 操作页面结构）
③ BOM（Browser Object Model — 操作浏览器功能）
④ Web API（现代浏览器能力，文件、媒体、硬件、性能、网络等）
```



### 5.1 全局对象

浏览器中的 JS 是运行在 **window 全局环境** 下的。

| 对象           | 作用                                                  |
| -------------- | ----------------------------------------------------- |
| **window**     | 浏览器的全局对象，包含所有全局属性和方法              |
| **self**       | 在 window 中等于 window，在 worker 中等于 worker 全局 |
| **globalThis** | 跨环境统一全局对象，推荐使用                          |

在浏览器里：

```js
window === self  // true
window === globalThis // true
```



### 5.2 DOM（Document Object Model）

DOM 是用来 **操作网页结构（HTML）** 的 API。

核心对象体系如下：

**document（入口）**

- `document.querySelector()`
- `document.createElement()`
- `document.body`
- `document.cookie`
- `document.documentElement`



🔹 节点体系（Node → Element → HTMLElement）

- `Node`（所有节点基类）
- `Element`（所有 DOM 元素基类）
- `HTMLElement`（所有 HTML 标签的基类）
- `Text`（文本节点）
- `Comment`（注释节点）



🔹 操作节点

- `appendChild()`
- `removeChild()`
- `replaceChild()`
- `setAttribute()`
- `classList.add()`



🔹 事件系统

- `element.addEventListener()`
- `Event`
- `MouseEvent`
- `KeyboardEvent`
- `InputEvent`



🔹 DOM 解析 & 节点信息

- `getBoundingClientRect()`
- `dataset`
- `innerHTML / textContent`

> DOM 让 JavaScript 可以增删改查，它负责“页面内容”。



### 5.3  BOM（Browser Object Model）

BOM 是用来 **控制浏览器自身行为** 的对象集合。

| 对象                          | 作用                                 |
| ----------------------------- | ------------------------------------ |
| **location**                  | 地址栏控制（跳转、刷新）             |
| **history**                   | 浏览器前进、后退                     |
| **navigator**                 | 浏览器信息、设备信息、权限、网络状态 |
| **screen**                    | 显示器信息（分辨率等）               |
| **window**                    | 弹窗、定时器、全局属性               |
| **localStorage**              | 永久存储                             |
| **sessionStorage**            | 会话存储                             |
| **cookie（document.cookie）** | 存储 & 跨域控制                      |
| **console**                   | 调试                                 |

常见例子：

```js
location.href = 'https://example.com'
history.back()
navigator.userAgent
localStorage.setItem('token', 'abc')
screen.width
```

> BOM 是“控制浏览器”，而 DOM 是“控制页面”。



### 5.4 Web API（现代浏览器能力）

Web API 是浏览器为 JS 提供的大量系统功能。
 它的数量非常大，我帮你按领域拆分。



**1️⃣ 网络相关 Web API（Network APIs）**

✔ fetch API（现代请求方式）

```js
fetch('/api/user')
```

✔ XMLHttpRequest（旧 AJAX）

✔ WebSocket（实时通信）

✔ EventSource（SSE 服务端推送）

✔ WebRTC（点对点音视频）

✔ Beacon API（页面卸载时仍能发送数据）



**2️⃣ 性能相关 Web API（Performance APIs）**

✔ performance（高精度计时）

```js
performance.now()
```

✔ performance.timing（页面加载各阶段耗时）

✔ performance.getEntries()（资源、导航、绘制）

✔ Long Task API（长任务监测）



**3️⃣存储相关 Web API（Storage APIs）**

| API                | 说明               |
| ------------------ | ------------------ |
| **localStorage**   | 永久存储           |
| **sessionStorage** | 会话存储           |
| **IndexedDB**      | 浏览器内部数据库   |
| **Cache API**      | PWA 缓存策略       |
| **Service Worker** | 离线缓存、拦截请求 |



**4️⃣文件系统 / 输入输出相关（File / FS APIs）**

| API                              | 说明                            |
| -------------------------------- | ------------------------------- |
| **File API**                     | 文件读取（如 input[type=file]） |
| **FileReader**                   | 读取文件内容                    |
| **Blob / URL.createObjectURL()** | 二进制数据对象                  |
| **File System Access API**       | 读写用户真实文件（现代浏览器）  |
| **Drag & Drop API**              | 文件拖拽                        |



**5️⃣多媒体相关 Web API（Media APIs）**

| API                             | 说明            |
| ------------------------------- | --------------- |
| **MediaDevices.getUserMedia()** | 摄像头 + 麦克风 |
| **HTMLMediaElement**            | 视频/音频控制   |
| **MediaRecorder**               | 音频/视频录制   |
| **Picture-in-Picture API**      | 小窗播放        |
| **Screen Capture API**          | 屏幕录制        |



**6️⃣设备访问相关 Web API（Device Access APIs）**

| API                 | 用途                      |
| ------------------- | ------------------------- |
| **Geolocation API** | GPS 定位                  |
| **Bluetooth API**   | 访问蓝牙设备              |
| **WebUSB API**      | USB 硬件访问              |
| **WebSerial API**   | 串口硬件访问              |
| **HID API**         | 键盘/鼠标/手柄等 HID 设备 |
| **Battery API**     | 电池信息                  |
| **Vibration API**   | 震动（手机）              |



**7️⃣ 图形 & 计算相关（Graphics / Compute APIs）**

| API             | 用途                              |
| --------------- | --------------------------------- |
| **Canvas API**  | 绘图                              |
| **SVG**         | 矢量图                            |
| **WebGL**       | GPU 绘图                          |
| **WebGPU**      | 新时代 GPU API（比 WebGL 强很多） |
| **WebAssembly** | 高性能计算（AI 推理等）           |



**8️⃣Worker 体系（多线程能力）**

| API               | 说明                |
| ----------------- | ------------------- |
| **Web Worker**    | 后台 JS 线程        |
| **SharedWorker**  | 多页面共享线程      |
| **ServiceWorker** | PWA、缓存、拦截请求 |



**9️⃣其他常用现代 Web API**

| API                           | 功能                   |
| ----------------------------- | ---------------------- |
| **Notification API**          | 系统通知               |
| **Clipboard API**             | 读写剪贴板             |
| **IntersectionObserver**      | 监听元素是否出现在视口 |
| **MutationObserver**          | 监听 DOM 变化          |
| **ResizeObserver**            | 元素大小变化           |
| **Intl**                      | 国际化                 |
| **Credential Management API** | 登录凭据管理           |



# 九、网络

## 1. Http缓存

> 浏览器在访问一个资源（如 `index.js`、`style.css` 或图片）时，会先检查本地是否有缓存副本，
>  如果有，就可能直接使用，以**减少网络请求**、**加快页面加载**。

HTTP 缓存主要分为两种机制：

| 类型                            | 是否向服务器发请求 | 是否使用本地缓存           | 主要字段                   |
| ------------------------------- | ------------------ | -------------------------- | -------------------------- |
| **强缓存 (Strong Cache)**       | ❌ 不发请求         | ✅ 直接用本地缓存           | `Expires`、`Cache-Control` |
| **协商缓存 (Negotiated Cache)** | ✅ 发请求           | ✅ 服务器返回 304，不传数据 | `ETag`、`Last-Modified`    |

### 1.1**强缓存（Strong Cache）**

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



### 1.2 协商缓存（Negotiated Cache）

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



## 2. Http1/2/3

### 2.1 HTTP 协议演化背景

HTTP（HyperText Transfer Protocol）是浏览器和服务器之间通信的协议。
 它并非独立存在，而是依赖底层传输层协议：

| HTTP 版本     | 底层传输协议         |
| ------------- | -------------------- |
| HTTP/1.0、1.1 | TCP                  |
| HTTP/2        | TCP                  |
| HTTP/3        | **QUIC（基于 UDP）** |



### 2.2 HTTP/1.x：性能瓶颈的起点

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



### 2.3 HTTP/2：多路复用的时代

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



### 2.4 HTTP/3：基于 QUIC 的新时代

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



### 2.5 三代协议核心区别总表

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

## 3.HTTP请求

### 3.1 **option请求**

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

### 3.2 **get和post请求**

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

## 4. HTTPS

HTTPS（HyperText Transfer Protocol Secure）**
本质是：

> **HTTP + TLS/SSL**

也就是说：

- HTTP：负责**应用层的请求与响应语义**
- TLS/SSL：负责**加密、认证、完整性校验**

📌 HTTPS ≠ 新协议
📌 HTTPS = **在 HTTP 与 TCP 之间加了一层 TLS**

协议栈结构：

```
应用层：   HTTP
安全层：   TLS / SSL
传输层：   TCP
网络层：   IP
```

----

### 4.1 HTTPS概述

💡**为什么需要HTTPS**

1️⃣ HTTP 是明文传输

```text
GET /login?user=liu&password=123456
```

在以下任何一个环节，都能被直接看到：

- 公共 Wi-Fi
- 路由器
- 运营商
- 中间代理
- 被劫持的网关

👉 **中间人攻击（MITM）** 就是基于这一点。

2️⃣ HTTP 无法确认服务器身份

你访问的是：

```
https://bank.com
```

但：

- DNS 被劫持
- ARP 欺骗
- Wi-Fi 钓鱼

你可能访问的是一个**伪造的 bank.com**

HTTP **完全无法识别**

3️⃣ HTTP 无法防止数据被篡改

请求途中可能被：

- 插广告
- 注入 JS
- 篡改返回内容

用户看到的页面 ≠ 服务器返回的页面

----

**💡 HTTPS 解决了什么问题？**

HTTPS 提供了 **三大安全保证**

| 能力                         | 解决什么问题 |
| ---------------------------- | ------------ |
| 🔐 加密（Confidentiality）    | 防止窃听     |
| 🧾 身份认证（Authentication） | 防止假服务器 |
| ✍️ 完整性校验（Integrity）    | 防止篡改     |

----

### 4.2 HTTPS 的核心：TLS 握手全过程

下面是**一次完整 HTTPS 建立连接的流程（TLS 1.2/1.3 统一理解版）**

------

1️⃣**Client Hello（客户端 → 服务器）**

客户端发送：

```text
- 支持的 TLS 版本
- 支持的加密套件（cipher suites）
- 随机数 Random_C
```

👉 告诉服务器：

> “我支持这些加密算法，你选一个吧”

**2️⃣Server** **Hello**（服务器 → 客户端）

服务器返回：

```text
- 选定的 TLS 版本
- 选定的加密套件
- 随机数 Random_S
- 数字证书（Certificate）
```

📌 **数字证书是关键！**

------

**3️⃣ 浏览器验证证书（非常重要）**

浏览器会做以下检查：

1. 证书是否过期
2. 域名是否匹配（CN / SAN）
3. 是否被吊销
4. 证书是否由 **受信任 CA** 签发
5. 是否能构建完整的证书链

证书链结构：

```
服务器证书
   ↓
中间 CA
   ↓
根 CA（内置在浏览器/系统中）
```

❌ 任一失败 → 浏览器报红警告

------

4️⃣**密钥协商**（非对称 → 对称）

为什么要两种加密？

| 加密方式   | 特点               |
| ---------- | ------------------ |
| 非对称加密 | 安全，但慢         |
| 对称加密   | 快，但密钥分发困难 |

👉 **TLS 用非对称加密“安全地交换”对称密钥**

现代 HTTPS 使用：

- **ECDHE / DHE**（支持前向安全）

流程（简化）：

1. 双方协商一个共享密钥
2. 生成会话密钥（Session Key）

📌 私钥 **永远不会在网络上传输**

------

5️⃣ **Finished**（握手完成）

双方用协商好的 **对称密钥**：

- 加密 HTTP 数据
- 校验数据完整性

之后就是：

```
HTTP over TLS
```

### 4.3 HTTPS 中的重要安全特性

1️⃣ **对称加密**（AES / ChaCha20）

用于：

- 请求体
- 响应体
- Header（部分）

优点：**快**

------

2️⃣ 消息完整性（MAC / AEAD）

防止：

- 数据被篡改
- 重放攻击

TLS 1.3 使用：

- **AEAD（加密 + 校验一体）**

------

3️⃣ 前向安全（Forward Secrecy）

> 即使服务器私钥泄露，历史通信也无法解密

依赖：

- DHE / ECDHE

📌 现代 HTTPS 标配

------

**HTTPS 与 HTTP 的关键区别（面试必问）**

| 项目     | HTTP     | HTTPS     |
| -------- | -------- | --------- |
| 端口     | 80       | 443       |
| 是否加密 | ❌        | ✅         |
| 防 MITM  | ❌        | ✅         |
| SEO      | 差       | 好        |
| 可用性   | 易被劫持 | 稳定      |
| HTTP/2   | ❌        | ✅（主流） |

------

**浏览器中的 HTTPS 相关机制**

1️⃣ HSTS（强制 HTTPS）

```http
Strict-Transport-Security: max-age=31536000
```

效果：

- 浏览器记住：**只能用 HTTPS**
- 防止 SSL Strip 攻击

------

2️⃣ Mixed Content（混合内容）

HTTPS 页面中：

- ❌ 加载 HTTP JS / CSS
- ⚠️ 加载 HTTP 图片

浏览器会直接阻止或警告

------

3️⃣ HTTPS 与 Cookie

```http
Set-Cookie: token=xxx; Secure; HttpOnly; SameSite
```

- `Secure`：仅 HTTPS 传输
- `HttpOnly`：防 XSS
- `SameSite`：防 CSRF

----

## 5. SSE

> **SSE（Server-Sent Events）是一种单向的服务器推送技术**
>  让服务器可以持续不断地向客户端发送数据，不需要客户端轮询。
>
> 特点：
>
> - **单向流**：服务器 → 浏览器（不能反向发送）
> - **基于 HTTP（文本流）**
> - **自动断线重连**
> - **性能比 WebSocket 更轻量**
>
> 常用于消息推送、日志、实时状态更新、AI 打字机流式输出等。



### 5.1 SSE 核心对象：`EventSource`

浏览器中使用 SSE 的核心 API 就是：

```js
const sse = new EventSource(url, options);
```



**🌟 EventSource() 构造函数**

语法：

```js
new EventSource(url, {
  withCredentials: false
});
```

参数：

| 参数              | 类型    | 含义                            |
| ----------------- | ------- | ------------------------------- |
| `url`             | string  | SSE 服务端地址（必须 GET 请求） |
| `withCredentials` | boolean | 是否携带 Cookie（跨域需要开启） |

示例（携带 Cookie）

```
const sse = new EventSource("https://api.example.com/events", {
  withCredentials: true
});
```



**🎧 EventSource 实例属性**

| 属性                  | 说明                |
| --------------------- | ------------------- |
| `sse.readyState`      | 当前 SSE 连接状态   |
| `sse.url`             | 当前 SSE 的请求 URL |
| `sse.withCredentials` | 是否携带凭证        |

其中最关键的是：

**⭐ readyState（连接状态）**

| 值   | 常量                     | 含义                     |
| ---- | ------------------------ | ------------------------ |
| `0`  | `EventSource.CONNECTING` | 正在连接 or 自动重连     |
| `1`  | `EventSource.OPEN`       | 已连接                   |
| `2`  | `EventSource.CLOSED`     | 已关闭，且不会再自动重连 |

使用：

```js
if (sse.readyState === EventSource.CLOSED) {
  console.log("SSE 已关闭");
}
```



**🧩 EventSource 事件**

浏览器内部维护三个可监听事件：

1️⃣ `onopen` —— 连接成功触发

```
sse.onopen = () => {
  console.log("SSE 连接已建立");
};
```



2️⃣ `onmessage` —— 默认事件（event: message）

当服务端发送：

```
data: hello
```

前端：

```
sse.onmessage = (event) => {
  console.log("收到数据:", event.data);
};
```

注意：**这是默认的 message 事件，不需要 event 字段**。



3️⃣ `onerror` —— 连接断开 or 错误时触发

```js
sse.onerror = (event) => {
  console.log("SSE 出错 or 断开:", event);

  if (sse.readyState === EventSource.CONNECTING) {
    console.log("正在自动重连中...");
  }
  if (sse.readyState === EventSource.CLOSED) {
    console.log("连接已被永久关闭");
  }
};
```

⚠ 重要：
 `onerror` 不等于连接关闭。
 它可能仅仅表示正在自动重连。



**4️⃣  `sse.close()` —— 手动关闭连接**

```
sse.close();
```

关闭后：

- readyState 变成 `CLOSED`
- 不会再自动重连



**🎯 支持自定义事件**

服务端发送：

```
event: update
data: {"x":1}
```

前端监听：

```js
sse.addEventListener("update", (event) => {
  console.log("update事件:", event.data);
});
```

👉 自定义事件必须使用 `addEventListener`。



### 5.2 SSE 消息格式

服务端返回的数据必须是这种格式：

```
event: <事件名称>      // optional
id: <消息ID>           // optional
retry: <重连毫秒数>     // optional
data: <数据内容>       // required（最少一行）
data: <第二行>         // 多行 data 可用

\n                    // 必须两个换行结束一次消息
```

示例：

```
event: progress
id: 17
retry: 2000
data: {"percent":80}
data: doing work...
```



**🎯 关键字段说明**

1️⃣ **`data:`**

真正的数据，**至少需要一行 data**。
 多行也可以：

```
data: line1
data: line2
```

前端收到 event.data = "line1\nline2"

2️⃣**`event:`（自定义事件名）**

如果没有 event 字段，则使用默认事件 `message`。

3️⃣**`id:`（用于断线恢复）**

浏览器自动保存最后一个 ID，重连时带上：

```
Last-Event-ID: 17
```

后端可以据此恢复状态。

4️⃣ **`retry:`（告诉浏览器重连间隔）**

例如：

```
retry: 5000
```

浏览器会在断线后 5 秒重连。

------



**✨ SSE必须设置三类头：**

```yaml
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

返回体必须是“流式”的。



**🌟 SSE 的自动断线重连（非常关键）**

SSE 浏览器原生支持断线重连：

- 网络掉线
- 服务器重启
- Nginx 中断

浏览器会自动重新连接 `/sse`。

你可以指定重连时间：

```
retry: 3000
```

或由前端手动重试（不常用）。



**🌟 SSE vs WebSocket**

| 功能         | SSE                      | WebSocket              |
| ------------ | ------------------------ | ---------------------- |
| 通信方向     | 单向（服务器 → 客户端）  | 全双工（双方都能推送） |
| 基于协议     | HTTP / text-stream       | 独立协议（ws/wss）     |
| 自动断线重连 | ✔ 内置                   | ❌ 需要自己实现         |
| 建立成本     | 很低                     | 较高                   |
| 适合场景     | 流输出、消息推送、事件流 | 聊天室、游戏、实时协作 |

如果你做 AI 打字机效果，**SSE 是最佳方案**。



**🌟 前端如何使用 SSE**

浏览器原生提供：

```js
const evtSource = new EventSource('/sse');

evtSource.onmessage = function(event) {
  console.log("收到服务器消息：", event.data);
};

evtSource.onerror = function() {
  console.log("连接出错，浏览器会自动重连");
};
```

后端每发送一条消息，onmessage 就会触发。



**🌟 后端如何实现 SSE（Node.js / Express 示例）**

后端必须保持连接不断开，并持续写入文本数据。

```js
app.get('/sse', (req, res) => {
  // 设置 SSE 必须的头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.flushHeaders();  // 确保立即发送

  let count = 0;

  const timer = setInterval(() => {
    count++;
    res.write(`data: 服务器消息 ${count}\n\n`); // SSE 格式：必须以两个换行结尾
  }, 1000);

  // 客户端断开时清理资源
  req.on('close', () => {
    console.log('SSE 连接关闭');
    clearInterval(timer);
  });
});
```

------

## 6. WebSocket

**WebSocket 是一种基于 TCP 的全双工、持久化通信协议**，用于在客户端和服务器之间建立一条**长期保持的连接**，双方可以**随时互相主动推送数据**。

👉 解决的核心问题是：

> **HTTP 天生是“请求-响应”模型，不适合实时通信**

WebSocket 的目标就是：
 **一次握手，长期通信，低延迟，高实时性**

----

### 6.1 WebSocket 的工作流程

**1️⃣ 建立连接（HTTP → WebSocket 握手）**

WebSocket 并不是一开始就脱离 HTTP 的，而是：

> **通过一次 HTTP 请求完成协议升级（Upgrade）**

客户端发起请求（示例）

```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

关键点：

- `Upgrade: websocket` → 请求升级协议
- `Sec-WebSocket-Key` → 随机值，用于安全校验
- `Version = 13` → 当前唯一标准版本

服务端响应

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

返回 **101** 表示：

> **协议切换成功，之后不再是 HTTP，而是 WebSocket**

**2️⃣ 握手成功后**

- TCP 连接保持
- 客户端 / 服务端 **随时可发消息**
- 不再有 request / response 的概念

----

### 6.2 WebSocket 的核心特性

**✅ 全双工（Full Duplex）**

- 客户端可以随时发
- 服务端可以随时推
- 不需要“先请求再响应”

对比：

| 协议      | 通信方向                |
| --------- | ----------------------- |
| HTTP      | 单向（请求 → 响应）     |
| SSE       | 单向（服务端 → 客户端） |
| WebSocket | **双向**                |

**✅ 长连接**

- 连接建立后长期存在
- 不需要反复建立 TCP / TLS
- 显著降低延迟和服务器压力

**✅ 数据帧（Frame）而不是文本流**

WebSocket 使用**帧结构**传输数据：

- 文本帧（Text）
- 二进制帧（Binary）
- 控制帧（Ping / Pong / Close）

----

### 6.3 WebSocket 的帧结构（面试高频）

简化理解：

```
| FIN | Opcode | Mask | Payload Length | Payload Data |
```

在 HTTP 中传输的是**文本流**，而 WebSocket 设计为**消息帧**，原因是：

- 支持 **二进制**
- 支持 **消息分片**
- 支持 **控制指令（Ping / Pong / Close）**
- 支持 **长连接上的多次消息**

👉 **一次 WebSocket 消息 = 一个或多个帧**



**⚠️WebSocket 帧整体结构（RFC 6455）**

```
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-------+-+-------------+-------------------------------+
 |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
 |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
 |N|V|V|V|       |S|             |   (if payload len==126/127)   |
 | |1|2|3|       |K|             |                               |
 +-+-+-+-+-------+-+-------------+-------------------------------+
 |     Masking-key (32)           |    Payload Data (x bytes)     |
 +-+-+-+-+-----------------------+-------------------------------+
```

我们一段一段拆解。

----

💡**第 1 个字节（FIN + RSV + Opcode）**

```
  0 1 2 3 4 5 6 7
 +---+---+---+---+---+---+---+---+
 |FIN|RSV1|RSV2|RSV3|  OPCODE     |
 +---+---+---+---+---+---+---+---+
```

1️⃣ FIN（1 bit）

- **1**：这是**当前消息的最后一帧**
- **0**：后面还有帧（分片）

📌 示例：

- 小消息：`FIN = 1`
- 大文件传输：`FIN = 0`（中间帧）

2️⃣ RSV1 / RSV2 / RSV3（3 bit）

- 预留位
- 一般为 **0**
- 用于 **扩展协议**（如压缩）

📌 如果未协商扩展却置 1 → **协议错误**

3️⃣ Opcode（4 bit）

| Opcode | 含义                 |
| ------ | -------------------- |
| 0x0    | Continuation（续帧） |
| 0x1    | Text（文本）         |
| 0x2    | Binary（二进制）     |
| 0x8    | Close                |
| 0x9    | Ping                 |
| 0xA    | Pong                 |

📌 规则：

- **控制帧不能分片**
- 续帧只能跟在非控制帧后面

----

💡**第 2 个字节（Mask + Payload Length）**

```
  0 1 2 3 4 5 6 7
 +---+-----------------------+
 |MASK| Payload length (7)   |
 +---+-----------------------+
```

1️⃣ MASK（1 bit）⭐⭐⭐⭐⭐

- **客户端 → 服务端：必须为 1**
- **服务端 → 客户端：必须为 0**

📌 原因：

> 防止恶意脚本通过代理缓存攻击非 WebSocket 服务

2️⃣ Payload Length（7 bit）

| 值    | 含义                |
| ----- | ------------------- |
| 0–125 | 实际长度            |
| 126   | 后续 2 字节表示长度 |
| 127   | 后续 8 字节表示长度 |

📌 注意：

- 126 → **16 位无符号整数**
- 127 → **64 位无符号整数**
- 网络字节序（大端）

----

💡**扩展 Payload Length**

情况 1：Payload len = 126

```
+-------------------------------+
| Extended payload length (16)  |
+-------------------------------+
```

表示：

```text
真实长度 = 0 ~ 65535
```

情况 2：Payload len = 127

```
+----------------------------------------------+
| Extended payload length (64)                 |
+----------------------------------------------+
```

- 理论最大：2⁶³ − 1
- 实际实现通常有限制

-----

**💡 Masking Key**

```
+------------------+
| Masking Key (32) |
+------------------+
```

- **4 字节随机数**
- 仅当 MASK = 1 存在

----

**💡 Payload 解码规则**

```text
decoded[i] = encoded[i] XOR maskingKey[i % 4]
```

📌 前端浏览器会自动处理
 📌 后端必须手动解码



**💡Payload Data（真正的数据）**

- 文本帧 → UTF-8 字符串
- 二进制帧 → 任意字节
- 控制帧 → 有长度限制（≤125）

----

### 6.4 webSocket的基本使用

#### 6.4.1 创建 WebSocket 连接

```
const ws = new WebSocket('ws://localhost:8080');
```

协议说明

- `ws://`：明文
- `wss://`：TLS 加密（生产环境必用）

----

#### 6.4.2 WebSocket 的 4 个核心事件 

1️⃣ `onopen` —— 连接成功

```
ws.onopen = () => {
  console.log('WebSocket 连接已建立');
};
```

📌 **只有在 onopen 后才能安全发送消息**

----

2️⃣ `onmessage` —— 接收消息

```
ws.onmessage = (event) => {
  console.log(event.data);
};
```

`event.data` 的类型

| 类型        | 场景       |
| ----------- | ---------- |
| string      | 文本消息   |
| Blob        | 二进制文件 |
| ArrayBuffer | 二进制流   |

----

3️⃣ `onerror` —— 发生错误

```
ws.onerror = (err) => {
  console.error('WebSocket 错误', err);
};
```

⚠️ 注意：

- `onerror` **不会提供详细错误原因**
- 通常会紧接着触发 `onclose`

----

4️⃣ `onclose` —— 连接关闭

```
ws.onclose = (event) => {
  console.log(event.code, event.reason);
};
```

重要属性

| 字段       | 含义         |
| ---------- | ------------ |
| `code`     | 关闭码       |
| `reason`   | 关闭原因     |
| `wasClean` | 是否正常关闭 |

----

#### 6.4.3 发送消息（send）

```js
ws.send('hello');
```

发送 JSON（真实项目）

```js
ws.send(JSON.stringify({
  type: 'chat',
  content: 'hello'
}));
```

发送二进制

```
ws.send(new Uint8Array([1, 2, 3]));
```

----

#### 6.4.4 连接状态（readyState）

```js
ws.readyState
```

| 值   | 状态       |
| ---- | ---------- |
| 0    | CONNECTING |
| 1    | OPEN       |
| 2    | CLOSING    |
| 3    | CLOSED     |

```js
if (ws.readyState === WebSocket.OPEN) {
  ws.send('ok');
}
```

----

#### 6.4.5 主动关闭连接（close）

```js
ws.close();
```

带关闭码

```js
ws.close(1000, 'normal close');
```

**常见关闭码**

| Code | 含义       |
| ---- | ---------- |
| 1000 | 正常关闭   |
| 1006 | 异常关闭   |
| 1008 | 策略违规   |
| 1011 | 服务端错误 |

----

#### 6.4.6 子协议（subprotocol）

用于**自定义应用层协议**

```js
const ws = new WebSocket('wss://example.com', ['json']);
```

服务端确认：

```js
Sec-WebSocket-Protocol: json
```

----

#### 6.4.7 认证方式

❌ 错误方式

```js
new WebSocket(`ws://xx.com?token=${token}`);
```

✅ 推荐方式

1️⃣ Cookie（HttpOnly）

```
new WebSocket('wss://xx.com/ws');
```

2️⃣ 首次消息发送 token

```js
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token
  }));
};
```

----

### 6.5 心跳机制

> ❓ 为什么需要心跳？
>
> - NAT / 防火墙可能会“静默断开”
> - 浏览器不会自动重连
> - TCP 断开不一定马上触发 `onclose`

**解决方案：**

**1️⃣ 协议级 Ping / Pong（后端主导）**

WebSocket 协议内置

- Ping（opcode = 0x9）
- Pong（opcode = 0xA）

📌 **浏览器不能手动发 Ping 帧**

📌 后端可以发，浏览器自动回 Pong

**Node.js 后端示例（推荐）**

```js
const interval = setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('connection', ws => {
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });
});
```



**2️⃣ 应用层心跳（前后端都参与）**

前端

```js
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
}, 30000);
```

后端

```js
ws.on('message', data => {
  const msg = JSON.parse(data);

  if (msg.type === 'ping') {
    ws.send(JSON.stringify({ type: 'pong' }));
  }
});
```



## 7. 网络安全攻击

### 7.1 XSS（跨站脚本攻击)

>XSS 是指**攻击者将恶意 JS 注入页面，在用户浏览器中执行**
>
>本质:
>
>- 前端信任了「不可信的数据」
>- 浏览器执行了攻击者的脚本

#### 7.1.1 XSS 的 3 种类型

**1️⃣ 反射型 XSS**

```url
https://example.com/search?q=<script>alert(1)</script>
```

- 后端/前端直接把 `q` 渲染到页面
- 刷新即消失

⚠️ 常见于：

- 搜索页
- 错误提示页

**2️⃣ 存储型 XSS（最危险）**

```html
<script>fetch('/cookie')</script>
```

- 恶意代码被**存进数据库**
- 所有访问该页面的用户都会中招

⚠️ 常见于：

- 评论系统
- 富文本
- 聊天消息

**3️⃣ DOM 型 XSS（前端专属）**

```js
element.innerHTML = location.hash;
```

- 完全发生在前端
- 后端毫不知情

#### 7.1.2 XSS防御

**✅ 不要相信任何外部输入**

```js
// ❌ 危险
div.innerHTML = userInput;

// ✅ 安全
div.textContent = userInput;
```

**✅ 富文本必须做白名单过滤**

- DOMPurify
- sanitize-html

```js
DOMPurify.sanitize(html);
```

**✅ 避免危险 API**

| 危险 API            |
| ------------------- |
| innerHTML           |
| outerHTML           |
| document.write      |
| eval / new Function |
| setTimeout(string)  |

**✅ CSP**

```http
Content-Security-Policy:
  defaul-src 'self';
  script-src 'self';
```

👉 即使 XSS 注入成功，脚本也执行不了

----

### 7.2 CSRF（跨站请求伪造）

> CSRF 是**利用浏览器自动携带 Cookie，在用户不知情的情况下发请求**
>
> 只要同时满足这 3 点，**CSRF 就可能发生**：
>
> 1️⃣ **用户已登录目标网站**
> 2️⃣ **浏览器自动携带身份凭证（Cookie）**
> 3️⃣ **服务端只凭 Cookie 判断用户身份**

----

#### 7.2.1 CSRF 攻击示例

```html
<img src="https://bank.com/transfer?to=attacker&money=10000">
```

当进入恶意页面时，对方嵌入一个上述img，发起了上述img的请求。由于用户已经登陆，所以一打开页面，就转账了 😨

**why？**-->📌 这里有 3 个致命点：

1. **img 可以跨域加载**
2. **浏览器会自动携带 bank.com 的 Cookie**
3. **bank.com 只用 Cookie 判断你是谁**

👉 **攻击成功**

要注意同源策略仅是避免读取响应，并非阻止请求。

----

#### 7.2.2 CSRF 的防御方案

**1️⃣ CSRF Token**

原理

> **攻击者无法读取页面内容，因此无法拿到 Token**

**实现方式**

1、服务端生成 Token

```js
//方案一
//当用户访问首页时，生成一个csrfToken，通过res.render向html当中插入这个token
//res.render(view, data)：生成最终 HTML，返回给浏览器
//view：读取一个 HTML 模板文件
//data：把 data 填充进模板占位符
//浏览器会得到<meta name="csrf-token" content="a1b2c3d4">

app.get('/', (req, res) => {
  const csrfToken = generateCSRFToken();
  req.session.csrfToken = csrfToken;

  res.render('index.html', {
    csrfToken
  });
});

//方案二
//在登陆接口生成csrfToken
//然后前端再将window.__CSRF__ = res.data.csrfToken;
```

 2、前端请求时携带

```
fetch('/api', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': token
  }
});
```

3、服务端校验

```
Cookie + Token 同时正确 → 放行
```

**为什么 Token 有效？**

- Cookie：浏览器自动带
- Token：**必须前端主动读 DOM 并发送**
- 攻击站点 **做不到这一点**

----

**2️⃣ SameSite Cookie（现代浏览器强力方案**）

```
Set-Cookie: session=xxx; SameSite=Lax
```

**SameSite 的 3 种模式**

| 值     | 行为                 |
| ------ | -------------------- |
| Strict | 完全禁止跨站         |
| Lax    | GET 部分允许         |
| None   | 允许跨站（需 HTTPS） |

📌 **推荐：`SameSite=Lax` 或 `Strict`**

----

**3️⃣ 不使用 GET 修改服务器状态**

```
❌ GET /deleteUser
✅ POST /deleteUser
```

👉 只能减少风险，**不能单独防 CSRF**

----

**4️⃣ 验证 Referer / Origin（辅助）**

```
Origin: https://example.com
```

⚠️ 易被绕过 / 丢失
 👉 **不能作为唯一防线**

----

**5️⃣ 双重 Cookie 验证（了解即可）**

- Cookie + Header 中放同一个值
- 服务端对比

----

### 7.3 MITM（中间人攻击）

> **中间人攻击是指攻击者在通信双方之间“插入自己”，让双方都以为在和对方直接通信，但实际上所有数据都被攻击者拦截、篡改或伪造。**

```text
客户端  ←→  攻击者  ←→  服务器
```

📌 核心不是“偷听”，而是：
 **拦截 + 篡改 + 伪装*

**MITM 成功通常依赖 至少一个前提条件：**

1. 通信未加密（HTTP）
2. 客户端未验证服务器身份
3. 用户被欺骗（钓鱼 / 假 Wi-Fi）
4. 系统或证书被植入（企业网 / 恶意软件）

----

#### 7.3.1 最典型的 MITM 攻击场景

**场景 1：公共 Wi-Fi**

```text
咖啡馆 Wi-Fi
你 → 路由器 → 攻击者控制的网关 → 服务器
```

攻击者可以：

- 监听 HTTP 明文请求
- 注入 JS
- 替换返回页面
- 劫持 Cookie

📌 **HTTPS 是唯一防线**

----

**场景 2：HTTP 劫持（前端最容易踩）**

```http
GET /login HTTP/1.1
```

返回内容被篡改为：

```html
<script src="http://evil.com/hijack.js"></script>
```

👉 你页面里的所有逻辑都被控制了

----

**场景 3：DNS 劫持（非常常见）**

```text
你请求 api.example.com
↓
DNS 返回攻击者 IP
↓
你连上了假服务器
```

如果没有 HTTPS：

- 完全无感知
- 登录信息全泄露

----

**场景 4：HTTPS MITM（高级）**

即使是 HTTPS，也可能被 MITM：

- 安装了恶意根证书
- 企业代理（SSL Inspection）
- 用户点了「继续访问不安全网站」

------

#### 7.3.2 利用HTTPS 是“防住 MITM”

**1️⃣ TLS 做了三件事**

| 能力       | 防什么   |
| ---------- | -------- |
| 加密       | 偷听     |
| 完整性校验 | 篡改     |
| 身份认证   | 假服务器 |

------

**2️⃣ TLS 握手的“反 MITM”关键点**

🔐 证书校验

浏览器会验证：

- 证书是否由可信 CA 签发
- 域名是否匹配
- 是否过期
- 签名是否合法

❌ 攻击者无法伪造合法证书

------

🔑 密钥协商

- 使用非对称加密
- 中间人无法解密后续通信

------

**3️⃣ 为什么“用户点继续访问”很危险？**

```text
你：忽略证书错误
↓
浏览器：关闭身份校验
↓
MITM 成功
```

----

**🤯 前端工程师在 MITM 面前能做什么？（**实战）

**1️⃣ 强制 HTTPS（非常重要）**

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

📌 防止 HTTP → HTTPS 降级攻击

------

**2️⃣ Cookie 安全属性**

```http
Set-Cookie:
  session=xxx;
  Secure;
  HttpOnly;
  SameSite=Strict
```

防：

- MITM 偷 Cookie
- XSS + MITM 联合攻击

------

**3️⃣ 前端永远不要加载 HTTP 资源**

❌

```html
<script src="http://cdn.com/a.js"></script>
```

✔

```html
<script src="https://cdn.com/a.js"></script>
```

------

**4️⃣ 使用 Subresource Integrity（SRI）**

```html
<script
  src="https://cdn.com/vue.js"
  integrity="sha384-xxx"
  crossorigin="anonymous">
</script>
```

📌 防 CDN 被 MITM 篡改

------

**5️⃣ API 层二次校验（Token / 签名）**

即使 HTTPS 被破坏：

- 请求签名
- 时间戳
- nonce

```json
{
  "sign": HMAC(body + timestamp)
}
```

------

**📖 面试官最喜欢的追问**

**Q1：HTTPS 一定能防 MITM 吗？**

> 不一定，如果用户信任了恶意证书或系统被植入根证书，HTTPS 也可能被中间人解密。

------

**Q2：HSTS 能防什么？**

> 防止 HTTPS 被降级到 HTTP，避免 SSL Strip 攻击。

------

**Q3：企业代理为什么能解 HTTPS？**

> 因为企业在系统中安装了自己的根证书，浏览器会信任它签发的证书。

------



### 7.4  JWT / Token 安全问题

#### 7.4.1 JWT概述

JWT（JSON Web Token）本质是：**`Header.Payload.Signature`**

**1️⃣ Header**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

🔹 `alg`（Algorithm）：表示 **签名算法**，决定了 JWT 的安全性上限。

常见值：

| alg   | 含义                   |
| ----- | ---------------------- |
| HS256 | HMAC + SHA256（对称）  |
| RS256 | RSA + SHA256（非对称） |
| ES256 | ECDSA + SHA256         |
| none  | ❌ 极度危险             |

2️⃣ Payload（最危险的部分）

```json
{
  "sub": "user_123",
  "role": "admin",
  "exp": 1735689600
}
```

⚠️ **JWT 的 Payload 是 Base64URL 编码，不是加密**

👉 **任何人都能解码看到内容**



**Payload是 JWT 中的声明（Claims）集合，包含了三类 Claims**

① Registered Claims（标准声明）

| 字段  | 含义     | 安全意义   |
| ----- | -------- | ---------- |
| `iss` | 签发者   | 防伪       |
| `sub` | 用户 ID  | 身份       |
| `aud` | 接收方   | 防滥用     |
| `exp` | 过期时间 | 防长期有效 |
| `nbf` | 生效时间 | 防提前使用 |
| `iat` | 签发时间 | 风控       |

👉 **成熟系统一定会用其中至少 3~4 个**

------

② Public Claims（公共声明）

- 需要避免冲突
- 通过 IANA 注册

工程中较少直接用

------

③ Private Claims（私有声明）

你自己定义的字段：

```
{
  "uid": 123,
  "role": "admin",
  "scope": ["read", "write"]
}
```

⚠️ **风险集中区**

-----

3️⃣ Signature（唯一的安全来源）

```
HMACSHA256(
  base64Url(header) + "." + base64Url(payload),
  secret
)
```

作用：

- 防篡改
- 防伪造

------

#### 7.4.2 JWT的安全防御

>JWT 的安全性 **依赖于 3 个前提**：
>
>1. **Token 不被泄露**
>2. **签名密钥不被泄露**
>3. **服务端严格校验 Token**
>
>只要破一个，JWT 就不安全。

JWT / Token 的主要安全问题,下面这些 **全是现实世界里真实发生过的漏洞**。

----

**① Token 泄露（最常见 & 最致命）**

攻击方式

1️⃣ XSS 窃取 Token

```js
localStorage.getItem("token")
```

👉 如果 Token 存在：

- `localStorage`
- `sessionStorage`

**一旦 XSS = 账号直接被接管**

2️⃣ 日志 / 监控泄露

- 前端 console.log
- 后端 access log
- Nginx / 网关日志

3️⃣ 浏览器插件 / 恶意脚本

- 插件拥有读取页面数据的能力



**本质原因**

> **JWT 是“持有即授权（Bearer Token）”**

谁拿到 Token，谁就是你。

**🛡️ 防御手段**

| 手段            | 说明      |
| --------------- | --------- |
| HttpOnly Cookie | JS 读不到 |
| HTTPS           | 防抓包    |
| CSP             | 防 XSS    |
| Token 最小权限  | 降低危害  |

------



**② XSS + JWT = 秒杀组合**

> **Access Token 不进 localStorage**

推荐组合：

```
Access Token  → HttpOnly Cookie
Refresh Token → HttpOnly + Secure + SameSite
```



**③ CSRF（在 Cookie 场景下）**

JWT 放 Cookie ≠ 自动安全

如果你：

```http
Cookie: access_token=xxx
```

而没有：

- SameSite
- CSRF Token

👉 仍然可能被 CSRF

**防御方案**

| 手段                | 是否推荐 |
| ------------------- | -------- |
| SameSite=Strict/Lax | ⭐⭐⭐⭐⭐    |
| CSRF Token          | ⭐⭐⭐⭐     |
| 双重 Cookie 校验    | ⭐⭐⭐      |



**④ JWT 被篡改（算法/校验问题）**

经典漏洞 1：`alg = none`

早期错误实现：

```json
{
  "alg": "none"
}
```

👉 服务端：

- 不校验签名
- 直接信 payload

**直接提权**



经典漏洞 2：算法混淆攻击

- 服务端期望：RS256
- 攻击者改成：HS256
- 用公钥当 HMAC 密钥

👉 验签通过



**防御**

- 服务端 **写死算法**
- 不信 Header 里的 alg
- 使用成熟 JWT 库

------

**⑤ JWT 无法主动失效（设计缺陷）**

场景

- 用户退出登录
- 用户被封号
- 密码被修改

但：

- JWT 还没过期
- 服务端无法“撤销”



常见补救方案

| 方案              | 说明       |
| ----------------- | ---------- |
| Access Token 短期 | 5~15 分钟  |
| Refresh Token     | 可撤销     |
| Token 黑名单      | Redis      |
| tokenVersion      | 用户表字段 |

------



⑥ Refresh Token 的安全问题（很多人忽略）

Refresh Token 比 Access Token 更危险

原因：

- 有效期更长
- 可无限续命

------

必须做到的 4 点

1. **只存 HttpOnly Cookie**
2. **绑定设备 / UA / IP**
3. **一次性使用（rotation）**
4. **可服务端吊销**



⑦ JWT 中存敏感信息（严重误区）

❌ 千万不要在 JWT 中放：

- 密码
- 手机号
- 身份证
- 内部权限规则

因为：

> **JWT Payload ≠ 加密**

------



**JWT vs Session 的安全对比（本质）**

| 维度     | JWT    | Session  |
| -------- | ------ | -------- |
| 状态     | 无状态 | 有状态   |
| 存储     | 客户端 | 服务端   |
| XSS 风险 | 高     | 低       |
| 主动失效 | 困难   | 容易     |
| 分布式   | 友好   | 需要共享 |

👉 **JWT 不是更安全，只是更“分布式友好”**



#### 7.4.3 JWT的正确安全实践

✅ 推荐方案（重点）

```
Access Token  +  Refresh Token
```

两种 Token **职责完全不同**，这是核心思想。

| Token         | 作用              | 特点         |
| ------------- | ----------------- | ------------ |
| Access Token  | 访问 API          | 短期、JWT    |
| Refresh Token | 续期 Access Token | 长期、可撤销 |



💡**Access Token（JWT）设计（短命 + 无状态）**

1️⃣ Access Token 的定位

> **Access Token 不是“登录凭证”，而是“临时通行证”**

设计原则：

- 被偷了也 **影响有限**
- 不可长期使用

----

2️⃣ Access Token 的技术选型

✅ 格式

- JWT

✅ 算法

- **RS256 / ES256（非对称）**
- ❌ 不用 HS256（微服务泄露风险）

----

3️⃣ Access Token Payload（精简但够用）

```json
{
  "iss": "auth.example.com",
  "sub": "user_123",
  "aud": "api.example.com",
  "exp": 1735689600,
  "iat": 1735686000,
  "scope": ["read", "write"],
  "token_type": "access"
}
```

字段说明（都是“生产必需”）

| 字段       | 必要性        |
| ---------- | ------------- |
| iss        | 防伪          |
| sub        | 用户唯一 ID   |
| aud        | 防 Token 滥用 |
| exp        | 强制过期      |
| scope      | 权限          |
| token_type | 防混用        |

----

4️⃣ Access Token 生命周期

- ⏱ 有效期：**5 ~ 15 分钟**
- ❌ 不可主动续期
- ❌ 不存服务端

----

5️⃣ Access Token 存储方式

✅ Web 场景（强烈推荐）

```http
Set-Cookie: access_token=xxx;
HttpOnly;
Secure;
SameSite=Lax
```

原因：

- JS 读不到 → 防 XSS
- 自动携带 → 简化前端

-----



**💡 Refresh Token**

对于Refresh Token，服务端做的不是：

> “验签 + 看 exp”

而是：

1. 从 Cookie 取 refresh_token
2. hash(refresh_token)
3. 查存储
4. 判断：
   - 是否存在
   - 是否过期
   - 是否 revoked
   - 是否设备一致
5. 生成新 Access Token
6. 🔄 生成新 Refresh Token
7. ❌ 旧 Refresh Token 标记 revoked



1️⃣ Refresh Token 的定位

> **Refresh Token 才是真正的“长期身份凭证”**

所以：

- 它必须 **可控**
- 必须 **可撤销**

----

2️⃣ Refresh Token 的技术选型

✅ 格式

- **随机字符串**
- ❌ 不用 JWT（没必要）

例如：

```
rft_8f7a9d3e6c...
```

----

3️⃣ Refresh Token 服务端存储（必做）

```text
refresh_token
user_id
device_id
user_agent
ip
expires_at
revoked
```

👉 存 Redis / DB 都可以

-----

4️⃣ Refresh Token 生命周期

- ⏱ 有效期：**7 ~ 30 天**
- 🔄 支持轮换（Rotation）
- ❌ 单次使用

------

5️⃣ Refresh Token 存储方式

```http
Set-Cookie: refresh_token=xxx;
HttpOnly;
Secure;
SameSite=Strict
```

> **Refresh Token 永远不允许被 JS 访问**

-----



**💡 完整登录 & 续期流程（非常重要）**

1️⃣ 登录成功

```
POST /login
```

服务端：

1. 校验账号密码
2. 生成 Access Token
3. 生成 Refresh Token
4. 返回两个 Cookie

----

2️⃣ 正常请求 API

```
GET /api/user
```

流程：

1. 浏览器自动携带 access_token
2. API 验证 JWT 签名 + exp
3. 放行

----

3️⃣ Access Token 过期

API 返回：

```http
401 Unauthorized
```

----

4️⃣ 前端自动刷新（无感）

```
POST /auth/refresh
```

流程：

1. 校验 Refresh Token（查库）
2. ❌ 若 revoked → 强制重新登录
3. ✅ 生成新 Access Token
4. 🔄 轮换 Refresh Token
5. 返回新 Cookie

----

5️⃣ 用户退出 / 封号

```
POST /logout
```

服务端：

- 标记 Refresh Token revoked
- 删除 Cookie

👉 **立即生效**

------



**💡 关键安全加固点（生产必做）**

1️⃣ Refresh Token Rotation（必做）

每次刷新：

- 旧 Refresh Token 立即失效
- 防止重放攻击

------

2️⃣ 设备绑定

```text
refresh_token ↔ device_id / UA
```

异常直接拒绝

------

3️⃣ 权限变更即时生效

做法：

- 权限不完全信 JWT
- 或引入 `tokenVersion`

------

4️⃣ 防 CSRF（Cookie 场景）

- SameSite=Lax / Strict
- 刷新接口校验 Origin

------

5️⃣ 密钥轮换

- JWT 私钥定期更换
- 公钥支持多版本

------



✅ 推荐架构（工业级）

```
Access Token:
  - JWT
  - 5~15 分钟
  - HttpOnly Cookie

Refresh Token:
  - 随机字符串
  - HttpOnly + Secure + SameSite
  - 服务端存储
```

------



# 十、Node

