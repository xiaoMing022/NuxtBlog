---
title: LangGraph
date:  2026/4/20
description: 从线到环
image: /blogs-img/LangGraph.jpg
alt: LangGraph
ogImage: /blogs-img/LangGraph.jpg
tags: ['agent']
published: true
trending: true
---
# LangGraph

## 1 架构基石 —— 从线性到循环的思维跃迁

### 1.1 为什么是 LangGraph

在传统的 LangChain 开发中，我们习惯于将组件（Prompt, Model, OutputParser）像乐高一样串联起来。这种模式在处理简单的、流向明确的任务时非常优雅。但在构建真正的“智能体（Agent）”时，你会撞上几面无形的墙。

**1. 线性 vs 循环 (DAG vs. Cycles)**

 传统的 LangChain 链（Chains）本质上是一个 **DAG（有向无环图）**。

- **线性思维：** 数据从 A 流向 B，再流向 C。如果你想让 AI 发现结果不对并“退回去重写”，在 LCEL 中实现这种“循环”会变得异常痛苦，通常需要嵌套复杂的 `while` 循环或递归函数，代码可读性极差。
- **智能体思维：** 真实的推理过程往往是：思考 -> 行动 -> 观察 -> **（如果不满意）回到思考**。LangGraph 允许你显式地定义这种“循环”，让 AI 在图中反复迭代直到满足终止条件。

**2. “黑盒” AgentExecutor 的局限性**

在 LangGraph 出现之前，我们主要依赖 LangChain 内置的 `AgentExecutor`。

- **痛点：** `AgentExecutor` 就像一个黑盒子。你很难精细地控制：
  - “在执行工具 A 之前，必须先询问人类。”
  - “如果工具返回错误，不要直接报错，而是去尝试工具 B。”
- **解决方案：** LangGraph 将 Agent 的控制权交还给了开发者。你可以手动定义每一个节点（Node）和每一条边（Edge），将 Agent 的逻辑拆解为透明的状态转移过程。

**3. 状态管理的缺失 (The State Problem)**

 在普通的 Chain 中，上下文的传递完全依赖于前一个组件的输出作为下一个组件的输入。

- **问题：** 当你的 Agent 运行了 10 个步骤后，你很难管理哪些信息是需要保留的长效记忆，哪些是临时的中间变量。
- **LangGraph 的革新：** 它引入了 **`State`（状态对象）**。整个图共用一个状态，每个节点都可以按需读取或更新这个状态的部分字段，类似于前端开发中的 Redux 或 Vuex。

------

**核心对比：Chain vs Graph**

| **特性**     | **LangChain (LCEL)** | **LangGraph**                     |
| ------------ | -------------------- | --------------------------------- |
| **逻辑流**   | 主要是线性的（DAG）  | **支持循环（Cycles）**            |
| **状态管理** | 局部传递，难以持久化 | **全局 `State` 对象，支持持久化** |
| **人机交互** | 极难中途中断并恢复   | **原生支持断点（Breakpoints）**   |
| **透明度**   | 较高（链式结构清晰） | **极高（每一个决策分支都可见）**  |

------

**🛠️ 深度解析：LCEL 的“痛点”实例**

想象一下，你要写一个“论文润色助手”。它的逻辑是：

1. 润色文本。
2. 检查字数。
3. **如果字数超标，重新压缩润色。**

使用 **LCEL**，你可能需要通过嵌套逻辑来实现，一旦逻辑稍微复杂（比如还要检查语法、语气），代码就会变成一团乱麻。

而在 **LangGraph** 中，这只是一个简单的循环：

> **节点 A (润色)** $\rightarrow$ **节点 B (检查)** $\rightarrow$ **条件边 (若超标则回到 A，否则去往结束)**。

------

### 1.2 状态机模型：StateGraph、Nodes 与 Edges

在 LangGraph 中，构建一个 AI 应用不再是简单的“连点成线”，而是**“设计一个生命体”**。这个生命体由三个核心支柱组成：**State（状态）**、**Nodes（节点）** 和 **Edges（边）**。

我们可以把 LangGraph 想象成一个**精密自动化的工厂流水线**。

1. **StateGraph：工厂的设计蓝图**

`StateGraph` 是整个应用的载体。它定义了流水线上流转的“工单”格式是什么样的。

- **核心逻辑：** 在 LangGraph 中，所有的信息交换都发生在一个全局的 `State` 对象中 。
- **设计原则：** 你必须先定义这个 `State`（通常是一个 `TypedDict`），然后用它来初始化 `StateGraph`。这就像是工厂开工前，先确定好工单上必须包含哪些字段（比如：客户需求、初始代码、错误日志等）。

------

2. **Nodes (节点)：工厂里的职能车间**

节点是逻辑发生的地方。每一个节点本质上都是一个 **Python 函数**。

- **输入与输出：** 节点接收当前的 `State` 作为输入，处理完毕后，输出一个**修改后的 State 增量**。

- **独立性：** 每个车间（节点）只负责自己的活。例如，`Researcher` 节点只负责上网搜资料，它不需要知道 `Writer` 节点是怎么写的。它只需要把搜到的结果填进 `State` 里的对应字段即可。

- **代码示例：**

  ```Python
  def research_node(state: MyState):
      # 执行搜索逻辑
      content = web_search(state["topic"])
      # 返回更新后的状态（注意：只返回需要改变的部分）
      return {"docs": content}
  ```

------

3. **Edges (边)：自动传送带与分拣机**

边决定了工单（State）从一个车间流向哪一个车间。它们是控制逻辑的灵魂。在 LangGraph 中，边分为两种：

**A. 普通边 (Normal Edges)**

- **作用：** 固定的逻辑流。
- **类比：** A 车间加工完，必须送往 B 车间。
- **语法：** `workflow.add_edge("node_a", "node_b")`

**B. 条件边 (Conditional Edges)**

- **作用：** 逻辑分支与循环的关键 。
- **类比：** “质检车间”检查产品。如果合格，送往“包装车间”；如果不合格，送回“加工车间”重做。
- **核心机制：** 依靠一个**路由函数 (Router Function)** 来决定下一步去哪。

------

**🛠️ 动手实践：构建你的第一个“骨架”代码**

让我们把这些概念拼成一段可运行的逻辑结构。假设我们要写一个简单的“翻译校验助手”：翻译 -> 校验 -> 不合格则重翻。

```Python
from typing import TypedDict, List
from langgraph.graph import StateGraph, END

# 1. 定义状态 (State)
class AgentState(TypedDict):
    content: str
    is_ok: bool
    review_feedback: str

# 2. 定义节点 (Nodes)
def translator(state: AgentState):
    print("---翻译中---")
    return {"content": "Translated text..."}

def critic(state: AgentState):
    print("---评审中---")
    # 模拟逻辑：如果内容太短就判为不合格
    if len(state["content"]) < 5:
        return {"is_ok": False, "review_feedback": "太短了"}
    return {"is_ok": True}

# 3. 定义路由逻辑 (Conditional Function)
def decide_next_step(state: AgentState):
    if state["is_ok"]:
        return "end"
    else:
        return "translate"

# 4. 构建图 (The Graph)
workflow = StateGraph(AgentState)

# 添加节点
workflow.add_node("translator", translator)
workflow.add_node("critic", critic)

# 设置起点
workflow.set_entry_point("translator")

# 添加边
workflow.add_edge("translator", "critic") # 翻译完必去评审

# 添加条件边：评审完根据结果决定去向
workflow.add_conditional_edges(
    "critic",
    decide_next_step,
    {
        "translate": "translator", # 路由函数返回 translate 则回到翻译节点
        "end": END                 # 路由函数返回 end 则结束
    }
)

# 5. 编译 (Compile)
app = workflow.compile()
```

------

**🎓 本节小结**

1. **StateGraph** 是大管家，管理着全局的“账本” ($State$)。
2. **Nodes** 是打工人，只负责接收 $State$、干活、更新 $State$。
3. **Edges** 是交通警察，负责指引 $State$ 的流向，尤其是**条件边**实现了我们梦寐以求的“循环”能力。

很高兴我们继续深入。在 1.2 节中，我们搭建了图的“骨架”，但要让这个工厂真正高效运转，还需要理解它的“血液循环系统”和“出厂设置”。

现在，我们进入 **第一阶段：架构基石** 的最后一小节：**1.3 核心机制详解：状态更新 (Reducers) 与 编译 (Compile)**。

------

### 1.3 核心机制详解：状态更新与图的编译

如果说 `Nodes` 是工厂的工人，那么 **State（状态）** 就是那本流转的账本。但在复杂的智能体协作中，如何保证多个工人同时写账本时不打架？这就是 **Reducers** 的职责。

1. **State & Reducers：精妙的增量更新**

在 LangGraph 中，状态更新默认是**覆盖（Overwrite）**模式。也就是说，如果节点 A 返回了 `{"count": 1}`，节点 B 随后返回了 `{"count": 2}`，那么状态中的 `count` 就会变成 `2`。

但在 AI 应用（尤其是对话系统）中，我们往往需要**累加（Append）**，比如保留完整的聊天记录。这时我们就需要用到 `Annotated` 和 `operator` 。

**核心机制：Reducer 函数**

Reducer 定义了如何将节点返回的“新值”合并到“旧状态”中。

- **默认行为：** 直接覆盖旧值。
- **增量累加：** 使用 `operator.add`。这在处理消息列表（Message List）时最为常见。

**代码实现对比：**

```Python
from typing import Annotated, TypedDict
import operator

class GlobalState(TypedDict):
    # 默认模式：新的字符串会直接覆盖旧的字符串
    current_task: str 
    
    # Reducer 模式：新的列表会通过 operator.add 自动拼接在旧列表后面
    # 比如：["hi"] + ["hello"] = ["hi", "hello"]
    history: Annotated[list, operator.add] 
```

> **专家提示：** `operator.add` 不仅仅能用于列表，还能用于整数累加（计数器）或者字典合并。它是实现智能体“记忆”和“进度追踪”的核心工具。

------

2. **The Compile Step：从逻辑图到可执行实体**

当定义好所有的节点和边之后，必须执行 `workflow.compile()`。这个步骤不仅仅是简单的封装，它在幕后完成了几件至关重要的事 ：

1. **逻辑验证：** 检查你的图是否有孤立节点、是否有无法到达的终点、以及条件边的路由逻辑是否闭环。
2. **转化为 Runnable：** 编译后的对象是一个 `CompiledGraph`。它遵循 LangChain 的 **LCEL 协议**，这意味着你可以像调用普通 Chain 一样使用 `.invoke()`、`.stream()` 或 `.astream_log()`。
3. **接入持久化层：** 只有编译后的图才能绑定 **Checkpointer（检查点）**。这是实现“时光倒流”、“断点续传”以及多轮对话记忆的前提。
4. **支持人机交互：** 编译阶段可以指定哪些节点需要“中断（interrupt）”，从而实现人类审批逻辑。

------

**🛠️ 深度解析：编译后的对象长什么样？**

当你运行 `app = workflow.compile()` 后，`app` 就变成了一个功能强大的引擎。

- **可视化：** 你可以立即通过 `app.get_graph().print_ascii()` 查看逻辑流是否符合预期。
- **输入输出适配：** 它会自动根据你定义的 `State` 结构来校验输入数据。

```Python
# 编译后的调用示例
initial_state = {"history": ["用户: 你好"], "current_task": "打招呼"}
for event in app.stream(initial_state):
    # 每一个 event 代表一个节点执行完毕后的输出
    # 这让你能实时监控 Agent 的思考过程
    print(event)
```

------

**⚖️ 本节小结**

理解了 **Reducer** 和 **Compile**，你就掌握了 LangGraph 的“内功心法”：

- **State & Reducers** 解决了数据的**流动与保存问题**，让 Agent 不再是“健忘症”。
- **Compile** 解决了逻辑的**封装与工程化问题**，让复杂的图变成一个可交互、可追踪的标准组件。

------

## 2 深度人机交互 (Human-in-the-loop, HITL)。

### 2.1 断点控制 (Breakpoints)

在普通的程序开发中，断点用于调试；但在 LangGraph 中，断点是一种**生产环境的逻辑控制**。

- **定义：** 断点允许你在图执行到某个特定节点**之前**或**之后**，强制暂停执行并挂起当前状态 。
- **特性：** 此时 Agent 的所有状态（State）会被保存到持久化层（Checkpointer），等待外部信号（通常是人类的审批或输入）来触发续传 。

------

1. **静态断点：确定性的风险预防**

静态断点是最简单的模式，你在**编译图**时直接指定哪些节点需要被“阻断” 。

核心场景：人工授权

想象一个“自动运维 Agent”，当它决定执行 `rm -rf` 命令前，必须停下来。

- **实现：** 在 `compile` 时使用 `interrupt_before` 参数。
- **流程：**
  1. Agent 运行到该节点前停止。
  2. 状态存入数据库。
  3. 人类收到通知，查看 State。
  4. 人类批准，Agent 继续运行。

```Python
# 示例：在执行 'action' 节点前设置静态断点
app = workflow.compile(
    checkpointer=memory, # 必须绑定检查点才能支持断点
    interrupt_before=["action"] 
)
```

------

**2. 动态断点：基于逻辑的智能拦截**

有时候，我们并不想每次都拦截，只有在 AI 觉得“心里没底”时才请求人工介入。

**实现方式：`NodeInterrupt` 异常**

你可以在节点函数内部进行逻辑判断，如果满足特定条件（如：LLM 输出的置信度低于 0.8，或者涉及敏感关键词），则抛出一个 `NodeInterrupt` 异常。

- **优势：** 更加灵活。它允许 Agent 自主决定何时需要“求助”人类。

------

**3. 深度交互流程：暂停 -> 恢复**

要实现断点，必须具备持久化（Persistence）能力。

- **运行并中断：** 当你调用 `app.invoke()` 且触碰断点时，程序会结束运行，但 `Thread ID` 下的状态已被保留 。
- **获取快照：** 开发者可以通过 `app.get_state(config)` 获取当前停在哪了。
- **恢复执行：** 人类通过 `app.invoke(None, config)`。传入 `None` 表示：“不用输入新信息，接着上次没干完的活继续干” 。

------

**🛠️ 资深工程师的实战代码片段**

假设我们要构建一个“高额消费审批系统”：

```Python
# 定义节点逻辑
def process_payment(state: AgentState):
    # 如果金额大于 1000，我们在编译阶段会拦截它
    print(f"正在处理支付：{state['amount']}元")
    return {"status": "success"}

# 编译时指定拦截
app = workflow.compile(
    checkpointer=memory, 
    interrupt_before=["process_payment"] # 支付前必须人看一眼
)

# --- 运行逻辑 ---
config = {"configurable": {"thread_id": "user_123"}}

# 1. 触发运行
# Agent 会停在 process_payment 节点之前
app.invoke({"amount": 5000}, config)

# 2. 此时 Agent 处于等待状态，我们可以检查它
current_state = app.get_state(config)
print(f"当前节点: {current_state.next}") # 输出: ('process_payment',)

# 3. 人类确认没问题，继续执行
app.invoke(None, config) 
```

------

**🎓 本节小节**

- **断点** 是实现“人类在环（HITL）”的基础，它将 Agent 从“全自动”降级为“半自动”，从而换取极高的安全性 。
- 实现断点有两个前提：**编译时指定（静态）/代码内触发（动态）**，以及**必须配置 Checkpointer** 。

既然我们已经掌握了如何让 Agent “刹车”，现在我们要进入更高级的领域：**如何让 Agent “后悔”**。

欢迎来到 **第二阶段：深度人机交互** 的第二小节 —— **2.2 时光倒流与状态编辑 (State Shifting)**。

------

### 2.2 时光倒流与状态编辑：重塑 Agent 的历史

在复杂的任务中，Agent 可能会在第 5 步犯错，导致后面全盘皆错。如果只能重头再来，效率太低。LangGraph 提供的“时光倒流”能力，本质上是赋予了开发者和用户“修改过去，改写未来”的超能力 。

1. **时光倒流 (Time Travel)：浏览历史快照**

当你在图中配置了 **Checkpointer（检查点）** 后，Agent 的每一次状态转移都会被永久记录在一个 `thread`（线程）中 。

- **核心机制：** 通过 `app.get_state_history(config)`，你可以获取该线程下所有历史状态的列表 。
- **不仅仅是查看：** 每一个快照（Checkpoint）都有一个唯一的 `checkpoint_id`。你可以随时“跳回”到任何一个历史点查看当时的输入、输出和完整状态 。

------

2. **状态编辑 (Forking & Editing)：手动纠偏**

这是 LangGraph 最具威力的特性之一。当你发现 Agent 走偏了，你可以直接干预它的“大脑状态” 。

- **应用场景：纠正 AI 偏差。** 比如一个写代码的 Agent 在第二步选错了库，你不需要等它报错，可以直接暂停，把状态里的 `library_name` 改成正确的，然后让它继续执行 。
- **操作流程：**
  1. **暂停：** 结合上一节的断点机制，让 Agent 停下。
  2. **获取状态：** 拿到当前或历史的状态快照。
  3. **更新状态：** 使用 `app.update_state(config, {"key": "new_value"})` 强行覆盖 。
  4. **分叉执行（Forking）：** 从这个修改后的点重新启动图，Agent 会带着你给它的“新指令”继续往下走 。

------

这个问题问得非常到位！这正是从“实验原型”转向“生产级应用”时最核心的挑战：**如果开发者和用户看不见 Agent 的思考过程，那么所谓的“时光倒流”和“状态编辑”就只是空中楼阁。**

要让这些机制真正发挥作用，我们需要通过可观测性（Observability）**和**防御性设计（Defensive Design）来捕捉那些“隐形”的错误。

------

3. **捕捉隐形错误：如何让“纠错机制”落地？**

在一个真实的工作流中，我们通常采用以下四种策略来发现并追溯错误状态。

1️⃣ **节点级流式输出 (Node-level Streaming) —— “看得见”的思考**

开发者不能等到 `invoke()` 全部结束才看结果。LangGraph 支持**流式更新**，允许你实时查看每一个节点的输入输出。

- **实现方法：** 使用 `app.stream()`。
- **应用逻辑：** 在 UI 界面或开发者控制台中，实时打印出：*“当前 Agent 选择了工具 X，参数为 Y”* 。
- **价值：** 就像看进度条一样，开发者或用户一旦在屏幕上看到 Agent 选错了工具，可以立即通过 UI 触发**手动中断**。

------

**2️⃣ 引入“校验节点” (Validation Nodes) —— “内行”看门道**

不要指望 Agent 每次都能完美自省。我们可以在图中显式地设计一个**评审节点（Critic/Validator Node）**。

- **机制：** 在“工具调用”节点之后，紧跟一个“校验”节点。
- **逻辑示例：**
  - `Tool_Call_Node` 执行完毕。
  - `Validator_Node` 检查：*“调用的工具是否符合安全规范？输出结果是否包含预期关键词？”*
  - **发现错误：** 如果校验失败，该节点直接抛出异常触发**动态断点**，或者将 `State` 标记为 `error` 并引导流向人类审批节点 。

------

**3️⃣ 利用 LangSmith 进行深度回溯 —— “监控录像”回放**

对于开发者来说，**LangSmith** 是追溯错误的最强利器。

- **追踪全链路：** LangSmith 会记录下 Graph 中每一个节点的详细 Trace（追踪记录），包括 Prompt、原始 LLM 响应和工具返回结果。
- **错误追溯：** 当用户反馈结果不对时，开发者可以通过 `thread_id` 在 LangSmith 中找到那一轮对话，定位是哪一个节点的 `State` 出现了偏差。
- **配合时光倒流：** 找到出错的 `checkpoint_id` 后，开发者可以在本地环境使用 `app.update_state` 模拟修复，测试改写历史后能否得到正确答案。

------

**4️⃣ 动态断点与置信度拦截 —— “自知之明”**

这是最智能的方式：让 Agent 在“拿不准”的时候自己停下来。

- **置信度检查：** 编写 Node 逻辑时，要求 LLM 输出一个置信分数。
- **逻辑：** `if confidence < 0.8: raise NodeInterrupt("AI不确定，请人工检查状态")` 。
- **用户感知：** 此时前端界面会弹出一个对话框，显示当前的中间状态（State），并询问用户：*“我准备使用工具 A 来处理，你觉得对吗？”* 。

------

**🛠️ 资深工程师的应用模式：用户纠偏流程**

在生产环境中，这个机制通常被包装成一个 **“撤销/修改”** 按钮：

1. **用户观察：** UI 显示 Agent 正在执行“查询数据库”动作。
2. **发现错误：** 用户发现 Agent 理解错了条件（比如把“去年的报表”理解成了“去年的工资单”）。
3. **触发动作：** 用户点击“暂停并修正”。
4. **后台操作：**
   - 前端调用 `app.get_state(config)` 获取当前 State。
   - 用户在界面修改错误的查询条件。
   - 后端调用 `app.update_state(config, {"query": "正确的条件"})` 。
   - 后端调用 `app.invoke(None, config)` 让 Agent 带着正确的指令重跑该步骤 。

------

### 

