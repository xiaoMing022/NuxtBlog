---
title: Zustand
date:  2025/9/18
description: 了解Zustand的使用
image: /blogs-img/blog2.jpg
alt: Zustand state management
ogImage: /blogs-img/blog2.jpg
tags: ['状态管理器','web']
published: true
---

## 1. **Zustand 核心概念**

Zustand 是一个轻量级、灵活的 **状态管理库**，相比 Redux、MobX 更加简洁，没有 boilerplate。它基于 **Hooks** 构建，核心理念是：

1. **全局状态的 Hook 化**
   你可以通过 `useStore` Hook 在任何 React 组件中访问状态或修改状态。
2. **简洁的状态定义**
   状态和操作（action）写在一个对象里，不需要 reducer 和 action type。
3. **选择性订阅（selector）**
   组件可以只订阅它关心的状态片段，避免不必要的渲染。
4. **中间件支持**
   如持久化（`persist`）、日志（`logger`）、immer 等，可以很方便增强 store。

------

## 2. **创建 Store**

Zustand 的核心函数是 `create`：

```ts
import { create } from 'zustand';
```

### 2.1 `create` 函数

**签名：**

```ts
create<T extends object>(
  initializer: (set: SetState<T>, get: GetState<T>, api: StoreApi<T>) => T
): UseBoundStore<StoreApi<T>>
```

**参数解释：**

1. `initializer`

   - 类型：`(set: SetState<T>, get: GetState<T>, api: StoreApi<T>) => T`

   - 作用：定义初始状态和操作（actions）。`T` 是状态类型。

   - 参数：

     - `set`：用于修改状态

       ```ts
       set(partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean)
       ```

       - `partial`：要更新的状态片段或一个函数（接收当前状态，返回要更新的状态片段）
       - `replace`（可选）：是否完全替换状态（默认是 `false`，表示 merge）

     - `get`：获取当前状态

       ```ts
       const state = get(); // 返回整个状态对象 T
       ```

     - `api`：Store 对象本身，可用于 subscribe、destroy 等操作

2. **返回值**：

   - 一个自定义 Hook `useStore`，用于在组件中访问状态：

     ```ts
     const count = useStore(state => state.count);
     ```

------

### 2.2 简单示例

```ts
interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useCounterStore = create<CounterState>((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
  decrement: () => set(state => ({ count: state.count - 1 })),
}));
```

使用：

```tsx
function Counter() {
  const count = useCounterStore(state => state.count);
  const increment = useCounterStore(state => state.increment);

  return (
    <>
      <div>{count}</div>
      <button onClick={increment}>+</button>
    </>
  );
}
```

------

## 3. **Zustand 核心 API 详解**

### 3.1 `set` 函数

**签名：**

```ts
type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>),
  replace?: boolean
) => void
```

**参数：**

- `partial`：更新的状态片段，或返回更新片段的函数
- `replace`：是否替换整个状态（默认 false）

**返回值**：`void`

**示例：**

```ts
set({ count: 10 }); // merge 更新
set(state => ({ count: state.count + 1 })); // 基于当前状态更新
```

------

### 3.2 `get` 函数

**签名：**

```ts
type GetState<T> = () => T
```

**功能**：获取当前整个状态对象

**返回值**：整个状态对象 `T`

**示例：**

```ts
const currentCount = get();
console.log(currentCount.count);
```

------

### 3.3 `subscribe` 函数

允许你订阅状态变化，可以在非 React 组件中使用。

**签名：**

```ts
subscribe: <U>(
  listener: (state: T, previousState: T) => void,
  selector?: (state: T) => U,
  equalityFn?: (a: U, b: U) => boolean
) => () => void
```

**参数：**

- `listener`：状态变化时调用的函数，接收新状态和旧状态
- `selector`（可选）：选择要监听的状态片段
- `equalityFn`（可选）：用于比较新旧状态片段是否相等，默认浅比较

**返回值**：取消订阅函数 `() => void`

**示例：**

```ts
const unsubscribe = useCounterStore.subscribe(
  state => console.log("count changed:", state.count),
  state => state.count
);

// 取消订阅
unsubscribe();
```

------

### 3.4 `destroy` 函数

- 销毁 store，通常在测试或热重载时使用

```ts
useCounterStore.destroy();
```

------

### 3.5 `persist` 中间件

将状态持久化到 localStorage/sessionStorage：

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      count: 0,
      increment: () => set(state => ({ count: state.count + 1 })),
    }),
    {
      name: 'counter-storage', // localStorage key
      getStorage: () => localStorage, // 可自定义 storage
    }
  )
);
```

------

### 3.6 `devtools` 中间件

- 用于 Redux DevTools 调试

```ts
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set, get) => ({
      count: 0,
      increment: () => set(state => ({ count: state.count + 1 })),
    }),
    { name: 'CounterStore' }
  )
);
```

------

## 4. **高级用法**

### 4.1 组合多个 store（partial store）

```ts
const useStoreA = create(set => ({ a: 1, incrementA: () => set(state => ({ a: state.a + 1 })) }));
const useStoreB = create(set => ({ b: 2, incrementB: () => set(state => ({ b: state.b + 1 })) }));
```

在组件中可以同时订阅：

```ts
const a = useStoreA(state => state.a);
const b = useStoreB(state => state.b);
```

------

### 4.2 选择性订阅避免重渲染

```ts
const count = useCounterStore(state => state.count); // 只渲染 count 改变时
const increment = useCounterStore(state => state.increment); // 不触发重新渲染
```

------

### 4.3 TypeScript 支持

- Zustand 的类型定义很好，`create<T>` 可以精确约束状态和 actions

```ts
interface TodoState {
  todos: string[];
  addTodo: (todo: string) => void;
}

const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  addTodo: (todo) => set(state => ({ todos: [...state.todos, todo] })),
}));
```

------

## 5. **总结**

1. **核心概念**：
   - `create` → 创建 store
   - `useStore` → React Hook 使用状态
   - `set` / `get` → 状态修改和获取
   - `subscribe` → 状态订阅
   - `destroy` → store 销毁
   - 中间件如 `persist`、`devtools` → 增强 store 功能
2. **优势**：
   - API 简洁，零 boilerplate
   - 精细订阅，减少组件不必要渲染
   - 灵活中间件体系
   - 完全支持 TypeScript