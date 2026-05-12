---
title: Langchain
date:  2026/2/20
description: agent工程化的第一步
image: /blogs-img/Langchain.png
alt: Langchain
ogImage: /blogs-img/Langchain.png
tags: ['agent']
published: true
trending: true
---
# LangChain

我们可以将 LangChain 看作是一个由多个功能模块组成的“工具箱”：

1. **Models（模型接口）** 🧠：这是大脑，负责处理文本输入并生成输出。LangChain 统一了不同模型供应商（如 OpenAI, Anthropic, HuggingFace）的调用方式。
2. **Prompts（提示词模板）** 📝：这是方向盘，通过模版化的方式管理输入，确保大模型能按预期的逻辑工作。
3. **Chains（链）** ⛓️：这是流水线，通过 **LCEL (LangChain Expression Language)** 将模型、提示词和数据处理逻辑串联起来。
4. **Retrieval（检索系统）** 📚：这是外挂知识库（RAG），让模型能够访问它训练数据之外的实时或私有信息。
5. **Agents（智能体）** 🤖：这是高级形态，模型不仅会思考，还能根据需求选择并调用工具（如搜索、计算器、运行代码）。

## 1.Model

### 1.1 统一的模型接口调用

**痛点：被厂商绑架的 API ⛓️**

在没有 LangChain 之前，如果你想在你的应用中同时支持 OpenAI、Anthropic (Claude) 和 Google (Gemini) 的模型，你会面临一个巨大的工程灾难：

- **OpenAI** 的输入格式是 `{"role": "user", "content": "..."}`。
- **Anthropic** 的 API 结构和鉴权方式完全不同。
- **Gemini** 又有自己独特的消息结构（比如 `parts` 和 `role`）。

这意味着，如果你要切换底层模型，你的业务代码、历史记录管理和输出解析代码几乎要重写一遍。

**解决方案：`BaseChatModel` 抽象类 🔌**

LangChain 解决这个问题的核心在于它的底层基础包：**`langchain-core`**。

在这个包里，LangChain 定义了一个极其重要的抽象基类：`BaseChatModel`。所有的模型厂商（或者社区开发者）要想把自己的模型接入 LangChain，就必须继承这个基类，并在内部把自己的特有 API 翻译成 LangChain 的标准格式。

这样做带来了三大统一：

1. **统一的初始化接口**：虽然不同模型需要的 API Key 不同，但初始化的模式是一致的。
2. **统一的输入输出类型**：无论底层是哪个大模型，它们**只接受** `BaseMessage` 列表，并且**只返回**统一的 `AIMessage` 对象。
3. **统一的调用方法 (Runnable 协议)**：所有模型都强制拥有 `.invoke()`（单次调用）、`.stream()`（流式输出）、`.batch()`（批量处理）等标准方法。

**代码实操：无缝切换底层模型**

让我们来看看在代码层面，这种统一有多么优雅：

```Python
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

# 1. 初始化不同的模型实例 (这是唯一需要针对厂商修改的地方)
llm_openai = ChatOpenAI(model="gpt-4-turbo", temperature=0)
llm_claude = ChatAnthropic(model="claude-3-opus-20240229", temperature=0)

# 2. 统一的输入：构建标准的 Message 列表
messages = [HumanMessage(content="用一句话解释什么是量子纠缠。")]

# 3. 统一的执行逻辑：下游的业务代码完全不需要知道底层是哪个模型
def get_ai_response(model, input_messages):
    # 无论是 OpenAI 还是 Claude，调用的都是标准的 invoke
    return model.invoke(input_messages)

# 无论传哪个模型，业务逻辑都能完美运行
result_from_openai = get_ai_response(llm_openai, messages)
result_from_claude = get_ai_response(llm_claude, messages)
```

通过这种设计，你可以通过修改配置文件中的一行代码，瞬间把整个系统的底层引擎从 OpenAI 换成私有化部署的开源模型（比如 Llama 3），而你的上层业务逻辑（提示词组装、输出解析、Agent 循环）**一行都不用改**。

------

### 1.2 Prompt Templates：工业级的组装流水线

现在，我们理解了输入和接口的统一。既然所有模型调用 `.invoke()` 后，返回的都不再是各大厂商乱七八糟的 JSON 响应，而是一个被 LangChain 统一封装好的 **`AIMessage` 对象**。

在早期的开发中，模型主要接收一串长文本并续写（LLMs）。但在目前的工程实践中，我们几乎全部转向了 **Chat Models（聊天模型）**。

Chat Models 的底层逻辑是：**输入和输出不再是单一的字符串，而是一个“消息列表 (List of Messages)”**。为了规范化，LangChain 定义了三种最核心的消息对象：

- **`SystemMessage` (系统消息)**：定义全局人设、规则和背景约束（例如：“你是一个只能输出 JSON 的翻译官”）。通常放在列表的第一位。
- **`HumanMessage` (人类消息)**：用户的当前输入或指令。
- **`AIMessage` (AI 消息)**：模型之前的历史回复内容。

----

你可能会问：既然只是拼接消息，为什么不用 Python 的 `f-string`？

在生产级应用中，**Prompt Templates** 提供了不可替代的工程价值：

- **自动角色转换**：它可以将简单的变量字典安全地转换为上述的 `SystemMessage` 和 `HumanMessage` 对象。
- **变量校验**：如果下游缺少必要的参数，它会在组装阶段直接抛出异常，而不是让残缺的提示词进入大模型浪费 Token。

让我们看一个基础的组装代码：

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# 1. 使用元组列表快速构建包含不同角色的 Prompt 模板
prompt_template = ChatPromptTemplate.from_messages([
    ("system", "你是一个精通 {language} 的资深工程师。"),
    ("human", "请解释什么是 {concept}。")
])

# 2. 注入变量，生成实际的消息列表
messages = prompt_template.invoke({
    "language": "Python",
    "concept": "装饰器"
})

print(messages)
# 输出: [SystemMessage(content='你是一个精通 Python 的资深工程师。'), HumanMessage(content='请解释什么是 装饰器。')]
```

这些结构化的消息，正是大模型最喜欢的数据格式。

### 1.3 Output Parsers：走向强类型，利用原生工具调用

在早期，我们让模型输出 JSON 的方式是这样的：

> “请输出 JSON，格式如下：`{"name": "...", "age": ...}`。不要输出多余的解释文字！”

**工程痛点：**

1. **幻觉前缀**：模型偶尔会说“好的，这是你要的 JSON：...”，导致 `json.loads` 报错。
2. **结构不稳**：在高并发下，模型可能会漏掉一个引号或逗号。
3. **维护困难**：字段一旦增多，Prompt 会变得极其臃肿。

**现代方案**：利用 OpenAI、Anthropic 等模型原生的 **Function Calling** 接口。你不再是通过“求”模型给 JSON，而是给它定义一个“数据契约”，模型在 API 层面就被限制只能按照这个契约填充数据。

------

**第一步：定义强类型契约 (Pydantic Schema)**

在 Python 工程中，**Pydantic** 是数据校验的事实标准。在 LangChain 中，它承担了“协议定义”的角色。

请注意代码中的 `Field` 和 `description`，这是**模型理解字段含义的唯一依据**。

```python
from typing import List, Optional, Literal
from pydantic import BaseModel, Field

# 定义一个复杂的输出结构
class FinancialReport(BaseModel):
    """提取财务报告中的核心指标""" # 类的文档字符串也会发送给模型
    
    company_name: str = Field(..., description="公司的完整法定名称")
    
    # 使用 Literal 限制模型只能在指定范围内选择，防止模型乱编
    sentiment: Literal["positive", "neutral", "negative"] = Field(
        description="报告表现出的整体情感极调"
    )
    
    # 使用 Optional 处理缺失数据，这是工程防御的关键
    revenue: Optional[float] = Field(
        None, description="营业收入金额（单位：亿元）。如果文中未提及，请设为 null"
    )
    
    key_risks: List[str] = Field(
        default_factory=list, description="报告中提到的风险点列表，至少提取3条"
    )

    # 嵌套结构：展示更复杂的逻辑
    audit_info: Optional[dict] = Field(
        description="包含 'auditor' (审计师) 和 'opinion' (审计意见) 的字典"
    )
```

**资深工程师笔记**：

- `...` 代表必填项，`None` 代表可选。
- `description` 是给 AI 读的“微型提示词”。例如，你可以通过描述告诉 AI 如何换算单位（如“将万元折算为亿元”）。

------

**第二步：绑定模型与方法选择 (`with_structured_output`)**

LangChain 的新版接口将模型包装成了一个“结构化输出器”。

```Python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 核心：将 Pydantic 类绑定到模型
# method 参数通常有 'function_calling' 或 'json_mode'
# 'function_calling' 是最稳定的，因为它利用了模型专门训练过的工具调用路径
structured_llm = llm.with_structured_output(FinancialReport, method="function_calling")
```

------

**第三步：处理真实世界的“不确定性” (Error Handling)**

即使使用了原生工具调用，模型依然可能失败（例如：输入太乱导致模型无法提取必填字段）。在工程化应用中，我们需要一层**异常拦截**。

```Python
from langchain_core.prompts import ChatPromptTemplate
from pydantic import ValidationError

prompt = ChatPromptTemplate.from_template("请分析以下文本并提取数据：\n\n{input}")

# 构建链
chain = prompt | structured_llm

def safe_extract(text: str):
    try:
        # invoke 返回的是一个 FinancialReport 的对象实例
        response = chain.invoke({"input": text})
        return response
    except ValidationError as e:
        # 当模型返回的格式不符合 Pydantic 要求时触发
        print(f"数据校验失败: {e}")
        return None
    except Exception as e:
        print(f"其他错误: {e}")
        return None

# 测试：传入一段不完整的文本
raw_data = "本季度腾讯表现不错，虽然没说具体挣了多少钱，但大家都很有信心。"
result = safe_extract(raw_data)

if result:
    print(f"公司: {result.company_name}")
    print(f"营收: {result.revenue}") # 这里会输出 None，而不是报错崩溃
    print(f"情感: {result.sentiment}")
```

------

**深度：`with_structured_output` 到底做了什么？**

作为一个资深工程师，你需要知道底层发生了什么：

1. **Schema 转换**：LangChain 将你的 `Pydantic` 类转换成了 OpenAI 要求的 **JSON Schema** 格式。
2. **API 注入**：在调用模型 API 时，这个 Schema 会被放入 `tools` 或 `response_format` 参数中。
3. **强制引导**：模型在生成每一个 Token 时，都会受到这个 Schema 的约束（比如定义了 `int`，它就不能输出字母）。
4. **自动实例化**：当 API 返回 JSON 字符串后，LangChain 会自动调用 `FinancialReport(**json_data)`，将字符串变成一个你可以直接点出属性的 Python 对象。

------

**工程进阶：多模型适配与 Fallback**

如果你担心某个模型（如 GPT-3.5）提取能力不够，导致解析失败，你可以构建一个**备份链**。

```Python
# 定义备选模型（更强大的 GPT-4）
fallback_llm = ChatOpenAI(model="gpt-4o").with_structured_output(FinancialReport)

# 使用 .with_fallbacks 建立容错机制
robust_chain = chain.with_fallbacks([fallback_llm])

# 逻辑：先试用便宜的模型，如果解析报错，自动调用贵但聪明的模型重试
result = robust_chain.invoke({"input": "一段复杂的财务文本..."})
```

------

**总结 Model I/O 的工程化精髓：**

- **统一接口**：通过 `BaseChatModel` 屏蔽厂商 API 差异。
- **模板管理**：通过 `ChatPromptTemplate` 确保消息序列的顺序和变量安全。
- **强类型解析**：通过 `Pydantic` + `with_structured_output` 实现从“自然语言”到“后端对象”的稳健转化。

## 2 检索增强生成（RAG）

大模型虽然博学，但它不知道你的私有文档、最新的新闻或是公司的内部 API 规范。RAG 的核心思想是：**与其试图把所有知识都塞进模型的权重里，不如在模型回答之前，先帮它去“查书”。**

一个标准的 RAG 流程分为五个核心环节，我们称之为 **“RAG 五部曲”**：

1. **载入 (Load)**：读取 PDF、网页、Word 或数据库。
2. **切分 (Split)**：将长文档切成小块（Chunk），因为模型窗口有限。
3. **向量化 (Embed)**：把文字转换成机器能理解的数字向量。
4. **存储 (Store)**：存入向量数据库（Vector Store）。
5. **检索 (Retrieve)**：用户提问时，找回最相关的文本块，喂给模型。

------

### 2.1 文档载入与切分 

在 LangChain 中，所有数据最终都必须转化为一个统一的 Python 对象：**`Document`**。

一个 `Document` 对象包含两个核心字段：

- `page_content`: 文本内容。
- `metadata`: 一个字典，记录来源、页码、标题等元数据（这对后续的**精准过滤**至关重要）。

**工业级选型建议：**

1. **入门级**：`PyPDFLoader`, `CSVLoader`, `TextLoader`。
   - *特点*：简单、轻量，适合结构非常规整的文件。
2. **专家级**：**`UnstructuredLoader`**。
   - *特点*：它是 RAG 工程中的“瑞士军刀”。它能自动识别文件类型（PDF, HTML, Word, PPT），最重要的是，它能通过 OCR 或布局分析，智能地剥离网页的广告条、导航栏，只留下核心正文。

```Python
# 必须安装: pip install "unstructured[all-docs]"
from langchain_community.document_loaders import UnstructuredURLLoader

urls = ["https://lilianweng.github.io/posts/2023-06-23-agent/"]

# 模拟工程中的异步加载（生产环境通常需要批量并行处理）
loader = UnstructuredURLLoader(urls=urls)
data = loader.load()

print(f"提取的元数据: {data[0].metadata}")
```

------

**Text Splitters：语义完整性的守护者 ✂️**

这是工程化中最容易被忽视，却最影响模型智商的地方。为什么不能简单地按字符数“每 500 字切一刀”？

- **语义断裂**：一段完整的代码逻辑或一个复杂的表格，可能会被从中切断，导致 AI 检索到后看不懂。
- **上下文丢失**：如果切片太小，AI 只看到局部，无法理解大意。

**核心策略一：递归字符切分 (`RecursiveCharacterTextSplitter`)**

它是 LangChain 的默认选择，也是最稳健的选择。它会按照一组字符顺序尝试切分：`["\n\n", "\n", " ", ""]`。

- 它先试着按段落切（`\n\n`），如果段落太长，再试着按行切（`\n`），最后才按空格切。这样能最大限度保证**段落结构的完整**。

**核心策略二：结构化切分 (`MarkdownHeaderTextSplitter`)**

在处理 API 文档、技术手册时，**标题结构就是语义边界**。

这种切分器会将 `#`, `##`, `###` 标题直接存入 `metadata`，并按标题层级切分。

```Python
from langchain_text_splitters import RecursiveCharacterTextSplitter

# 工程参数深度解析：
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # 每个块的最大容量 (Token或字符)
    chunk_overlap=200,    # 块与块之间的重叠区
    length_function=len,  # 计算长度的函数，也可以换成 tiktoken 来计算真正的 Token 数
    is_separator_regex=False,
)

# 为什么需要 chunk_overlap？
# 想象你在看一本连环画，如果每页之间完全独立，你会漏掉剧情。
# 重叠部分就像是“上一集回顾”，能保证相邻的块之间有语义衔接。
```

------

**工程化进阶：Chunk Size 的调优艺术 🎨**

作为资深工程师，你需要掌握这套调优公式。`chunk_size` 的选择是一个平衡木：

| **方案**               | **优点**                 | **缺点**                        | **适用场景**                         |
| ---------------------- | ------------------------ | ------------------------------- | ------------------------------------ |
| **小 Chunk** (如 200)  | 检索极其精准，节省 Token | 上下文严重缺失，AI 容易断章取义 | 事实搜索（如：查找具体的电话、日期） |
| **中 Chunk** (如 800)  | 语义保留较好，平衡性高   | 容易混入无关信息                | 通用问答、摘要提取                   |
| **大 Chunk** (如 2000) | 上下文完整，理解力强     | 浪费 Token，检索噪声多          | 复杂逻辑推理、长文总结               |

**工程技巧：** 在生产环境中，我们经常使用 **“父子索引（Parent-Document Retrieval）”**。

- **做法**：把大文档切成大块（Parent），再把大块切成小块（Child）。
- **逻辑**：通过小块进行高精度的向量匹配，但**真正喂给 AI 的是大块的内容**。这样既保证了检索的准，又保证了 AI 看得全。

------

> 现在，我们已经把长篇大论变成了易于检索的“小积木”。**在进入下一步“向量化存储”之前，请你想一下：如果我们的文档里包含大量的代码块或表格，这种简单的按字符数切分（比如每 500 字一刀）可能会带来什么样的问题？**
>
> ❗按字符数硬切，会破坏“语义完整性”和“结构完整性”
>
> | 问题       | 本质           |
> | ---------- | -------------- |
> | 代码断裂   | 结构破坏       |
> | 表格错乱   | 格式破坏       |
> | 语义不连贯 | 上下文丢失     |
> | 检索不准   | embedding 失真 |
>
> 🧠 正确思路
>
> 👉 **不要按“字符”，要按“语义结构”切**，针对性地使用 `MarkdownTextSplitter` 或 `PythonCodeTextSplitter`，它们会识别语法结构，尽量保证一个代码块或一个段落的完整性。

### 2.2 向量化 (Embedding) 与 向量数据库 (Vector Store) 

当我们把文档切成了无数个“语义完好”的小积木（Chunks）后，接下来的挑战是：**计算机怎么知道哪块积木和用户的问题最相关？**

这就是 **向量化 (Embedding)** 的魔力：

1. **转换**：我们将每一块文本通过 Embedding 模型（如 OpenAI 的 `text-embedding-3-small`）转换成一串长长的数字向量。
2. **空间关系**：在数学空间里，语义相近的句子，它们的向量距离就越近。例如，“猫”和“小猫”的向量距离，会比“猫”和“手机”近得多。
3. **存储**：为了能快速从成千上万个向量中找到最接近的一个，我们需要专门的仓库 —— **向量数据库**（常用的有 Chroma, FAISS, Pinecone）。

**代码实操：建立你的本地向量库**

我们将刚才切好的 `splits` 转化成向量并存入一个内存数据库（这里使用简单的 `FAISS`）。

```python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# 1. 定义 Embedding 模型（负责把文本变数字）
embeddings = OpenAIEmbeddings()

# 2. 建立向量库
# 这步会调用 API 将所有的 splits 转化成向量，并构建索引
vectorstore = FAISS.from_documents(documents=splits, embedding=embeddings)

# 3. 测试检索：寻找与“什么是 Agent 的记忆”最相关的文本块
query = "什么是 Agent 的记忆？"
docs = vectorstore.similarity_search(query)

print(f"检索到 {len(docs)} 条相关文档")
print(f"最匹配的内容片段：\n{docs[0].page_content[:200]}...")
```

**让 LCEL 串联起 RAG 全流程 ⛓️**

现在你有了一个“图书馆”（向量库），接下来我们需要用 LCEL 把**检索**和**回答**缝合在一起。

这就涉及到一个核心组件：**Retriever（检索器）**。它不是一个数据库，而是一个“寻找者”接口。

```python
from langchain_core.runnables import RunnablePassthrough

# 1. 将向量库转为检索器
retriever = vectorstore.as_retriever()

# 2. 定义 RAG Prompt
template = """你是一个专业的助手。请根据提供的上下文回答问题。
如果上下文中没有相关信息，请诚实回答不知道。

上下文: {context}
问题: {question}
回答:"""
prompt = ChatPromptTemplate.from_template(template)

# 3. 构建 RAG 链
rag_chain = (
    # 这里用到了我们之前学的并行逻辑
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

# 4. 一键执行
response = rag_chain.invoke("如何定义大模型 Agent 的长期记忆？")
print(response)
```

**深度点拨 🧠**

在这个 `rag_chain` 中，当你调用 `invoke` 时：

1. `question` 被同时传给了 `retriever`。
2. `retriever` 自动去向量库里“捞”出了最相关的文档，填入了 `context`。
3. Prompt 拿到了真实的背景知识，从而避免了“一本正经胡说八道”（幻觉）。

### 2.3 Retrievers：从“查库”到“智能搜索”的跃迁

如果我们的向量库里存了上万条数据，但用户的问题非常口语化（例如：“那个谁写的那个关于 AI 的东西是怎么说的？”），光靠“向量距离匹配”确实很难处理模糊或口语化的查询。在万级甚至亿级数据的库里，如果用户说“那个谁写的关于 AI 的东西”，向量搜索可能会因为“东西”、“那个谁”这些词的干扰，带回一堆噪音。

在工程化 RAG 中，我们通过 **Retrievers (检索器)** 这一层抽象，在“数据库”和“模型”之间加入一套精密的**逻辑过滤器**。在 LangChain 的哲学里，`Vectorstore` 是存储，而 `Retriever` 是行为。一个检索器不仅可以去向量库里搜，还可以去搜索引擎、图数据库、甚至是你的本地文件里搜。

**策略一：多查询检索 (Multi-Query Retriever) —— 解决“词不达意”**

这是应对“口语化、模糊查询”的工业级杀手锏。它的逻辑不是直接拿着用户的那句烂话去搜，而是先让大模型把这句话**重写成 3-5 个不同角度的专业查询**。

- **工程逻辑**：
  1. 用户输入：“那个谁写的 AI 东西”。
  2. LLM 转换成：
     - “Lilian Weng 关于 LLM Agents 的综述文章”
     - “人工智能代理系统的核心架构设计”
     - “2023年关于 AI Agent 的深度分析”
  3. 拿着这 3 句话去向量库搜，最后把结果**去重合并**。

```Python
from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain_openai import ChatOpenAI

# 定义大脑
model = ChatOpenAI(temperature=0)

# 将简单的向量库包装成一个“聪明”的多查询检索器
retriever_from_llm = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(), 
    llm=model
)

# 这样搜出来的结果，覆盖面和准确度会大幅提升
unique_docs = retriever_from_llm.invoke("那个谁写的 AI 东西")
```

**策略二：上下文压缩 (Contextual Compression) —— 告别“Token 浪费”**

向量库检索返回的是整个“块（Chunk）”。但大模型可能只需要这个块里的**一两句话**。如果把整块都喂给模型，不仅浪费钱，还会因为干扰信息太多导致模型智商下降。

- **工程逻辑**：利用一个专门的 `Compressor`（压缩器），在检索回来的结果里进行二次筛选，只把最相关的片段“剪”出来喂给模型。

**策略三：混合检索 (Ensemble Retrieval) —— 兼顾“语义”与“关键词”**

这是目前中文 RAG 工程中的标准配置。

- **向量搜索 (Dense)**：擅长搜“语义”。（搜“猫”，能找到“小猫”、“萌宠”）
- **关键字搜索 (BM25/Sparse)**：擅长搜“特定名词”。（搜“iPhone 15 Pro Max”，向量搜索可能会带回一堆“苹果手机”，而 BM25 能精准锁定型号）
- **Ensemble**：将两者的结果按权重（如 RRF 算法）融合。

```Python
from langchain.retrievers import BM25Retriever, EnsembleRetriever

# 1. 初始化关键字检索器
bm25_retriever = BM25Retriever.from_documents(documents)
bm25_retriever.k = 2

# 2. 初始化向量检索器
vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

# 3. 组合：权重各占 0.5
ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, vector_retriever], 
    weights=[0.5, 0.5]
)
```

------

**检索系统的“工程红线” 🚩**

作为资深工程师，在设计 RAG 检索层时，必须考虑以下三个工程指标：

1. **Recall (召回率)**：宁可多搜点，别漏掉关键信息。这就是为什么要用多查询和混合检索。
2. **Precision (精准率)**：别带回一堆废话，否则会引发模型“幻觉”。这需要靠上下文压缩和 Rerank（重排）。
3. **Latency (延迟)**：多查询和压缩都会增加调用次数，导致变慢。在追求极致体验的前端应用中，通常需要异步并行这些任务。

------

**Rerank：检索的最后一道防线 🛡️**

在复杂的 RAG 系统中，我们通常会搜回 10-20 个文档块，但最后喂给 LLM 的只有前 3 个。

**问题来了**：向量数据库基于余弦相似度的评分，真的代表“最相关”吗？不一定。

**工程做法**：引入一个 **Rerank Model**（重排模型，如 BGE-Reranker）。

1. 向量库先初步筛选（粗排）。
2. Rerank 模型对这 10 个结果进行精细打分，把真正最有用的排到最前面。这是提升 RAG 回答准确度最立竿见影的手段。

----

### 2.4 拥有记忆的对话链 

**现在的 RAG 看起来很完美，但请思考一个实际场景：** 如果用户第一句问：“什么是量子计算？”，第二句问：“**它**有什么应用？”，由于 RAG 链每次 `invoke` 都是独立的，你的检索器去搜“它”这个词时，能搜到正确的结果吗？

为了解决这个问题，我们需要引入一个核心机制：**查询重写 (Query Transformation) 与 历史记忆 (Memory)**。在真实的业务架构中，我们会在用户提问和检索器之间，插入一个**“问题重写层” (History-aware Retriever)**。

**它的工作流是这样的：**

1. **拦截**：拦截用户的最新问题（“它有什么应用？”）。
2. **回顾**：提取之前的聊天记录（“什么是量子计算？”）。
3. **重写**：利用大模型，将这两个信息融合成一个**独立的、无歧义的查询**（“量子计算有什么应用？”）。
4. **检索**：拿着重写后的查询，再去向量数据库搜索。

**逻辑代码演示**

在 LangChain (LCEL) 中，我们可以这样组合积木：

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# 1. 定义问题重写 Prompt (引入了 MessagesPlaceholder 来接收历史记录)
condense_prompt = ChatPromptTemplate.from_messages([
    ("system", "根据历史对话，将用户的最新问题重写为一个独立的问题。"),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}")
])

# 2. 构建“查询重写链”
condense_question_chain = condense_prompt | model | StrOutputParser()

# 3. 构建完整的对话 RAG 链
# 注意：这只是核心逻辑演示，实际生产中常结合 RunnableWithMessageHistory 使用
conversational_rag_chain = (
    RunnablePassthrough.assign(
        # 动态生成重写后的问题
        standalone_question=condense_question_chain
    )
    | RunnablePassthrough.assign(
        # 拿重写后的问题去检索上下文
        context=lambda x: retriever.invoke(x["standalone_question"])
    )
    | answer_prompt # 最后交给回答 Prompt
    | model
)
```

通过这套组合拳，你的 AI 就不再是“金鱼记忆”，而是一个能进行多轮深度探讨的领域专家了。

----

## 3. LCEL

在深入复杂的 Agent 之前，我们必须先理解最基本的 **LCEL (LangChain 表达式语言)**。它使用类似 Unix 管道符 `|` 的语法，让逻辑清晰可见。

很多开发者初看 LCEL，觉得 `chain = prompt | model | parser` 只是为了少写几行 Python 代码。**这是一个巨大的误解。**LCEL 的真正价值在于它实现了一套统一的 **`Runnable` 协议**。在工业级应用中，这意味着你的链条天然具备了以下高级特性：

1. **异步支持 (`ainvoke`)**：在高并发的后端（如 FastAPI）中，你可以无缝使用异步调用，不会阻塞线程。
2. **流式传输 (`stream`)**：即使是极其复杂的 RAG 链，你也能让模型像打字机一样一个字一个字地吐出来。
3. **自动并行 (`RunnableParallel`)**：如果你有两个检索器，它们会自动并发运行，显著降低响应时长（Latency）。
4. **容错回退 (`with_fallbacks`)**：模型挂了？自动切换到备用模型，无需写复杂的 try-except。

----

**核心基石：Runnable 协议 🧱**

LangChain 之所以能像搭积木一样灵活，是因为几乎所有的组件（如模型、提示词、解析器、甚至你自定义的函数）都遵循同一个协议：**Runnable**。

这意味着不管组件内部逻辑多复杂，它们都拥有统一的“标准接口”。最常用的四个方法是：

- **`invoke`**：同步调用，单个输入，单个输出。

- **`batch`**：内部并行执行，输入列表，输出列表。
- **`stream`**：流式输出。
- **`ainvoke`**：上述方法的异步版本。

------

 **代码实操：感受“链”的力量 🔗**

我们将Model 和Retrieval结合起来，构建一条具备参数透传、并行检索和容错机制的生产级链路。

```python
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

# 1. 定义组件
model = ChatOpenAI(model="gpt-3.5-turbo")
fallback_model = ChatOpenAI(model="gpt-4o") # 备用模型
retriever = vectorstore.as_retriever()

# 2. 构建具备容错的模型组件
smart_model = model.with_fallbacks([fallback_model])

# 3. 组合链（LCEL）
chain = (
    # 第一阶段：并行准备数据
    # context 去搜库，question 直接透传
    RunnableParallel({
        "context": retriever,
        "question": RunnablePassthrough()
    })
    # 第二阶段：填入 Prompt
    | prompt_template 
    # 第三阶段：调用具备回退机制的模型
    | smart_model 
    # 第四阶段：标准化解析
    | StrOutputParser()
)

# 4. 生产级调用：流式输出
for chunk in chain.stream("什么是量子纠缠？"):
    print(chunk, end="", flush=True)
```

### 3.1 数据流控与字典调度

在实际开发中，Prompt 通常需要多个参数（比如：上下文 + 问题）。但上一个组件的输出往往只是一个字符串。如何把单一的输出拆分成 Prompt 需要的“字典”？这就是 **`RunnableParallel`** 和 **`RunnablePassthrough`** 的战场。

**核心组件说明**

- **`RunnableParallel`** ：并行执行多个任务，并将结果组合成一个字典。它是 Prompt 的“供货商”。
- **`RunnablePassthrough`** ：顾名思义，“透传”。它不做任何改动，直接把上游的数据传给下游，常用于保留用户的原始输入。

**代码实操：模拟 RAG 的数据准备**

假设我们要实现：用户输入一个关键词，我们同时生成它的“百科定义”和“情感分析”，最后汇总给模型。

```python
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

model = ChatOpenAI(model="gpt-3.5-turbo")

# 1. 模拟两个独立的处理逻辑
def fake_retriever(question):
    return f"关于 {question} 的专业背景知识..."

def sentiment_analysis(question):
    return "积极/正面"

# 2. 构建并行准备层
# 这步会将原始输入 {"topic": "AI"} 转化为一个包含三个 key 的字典
map_setup = RunnableParallel(
    context=RunnableLambda(fake_retriever),
    sentiment=RunnableLambda(sentiment_analysis),
    question=RunnablePassthrough() # 直接透传用户的原始输入
)

# 3. 最终的 Prompt
prompt = ChatPromptTemplate.from_template("""
背景：{context}
情感基调：{sentiment}
请结合以上信息，回答用户的问题：{question}
""")

# 4. 组合链
full_chain = map_setup | prompt | model | StrOutputParser()

# 运行
# 注意：我们传进去的是一个简单的字符串
print(full_chain.invoke("量子计算"))
```

**关键点拨 💡**

在这个链条中，`RunnableParallel` 就像是一个**数据分流器**。它接收到“量子计算”后，同时把它送到了三个地方，最后又把结果打包成 `{ "context": ..., "sentiment": ..., "question": ... }` 喂给了 Prompt。

### 3.2 动态路由

在资深工程师的架构设计中，程序不应该是死板的直线，而应该能根据输入内容走向不同的分支。例如：如果用户问的是“编程问题”，走代码模型链；如果问的是“文学创作”，走创意模型链。

在 LangChain 中，实现路由主要有两种方式：

1. **使用 `RunnableBranch`**（传统的 if-else 声明式语法）。
2. **使用自定义函数**（更灵活，目前官方更推荐的方式）。

**场景实操：智能客服分类器**

我们来构建一个逻辑：判断用户的输入，如果是关于“技术支持”，我们就用一种严肃的口吻回答；如果是“闲聊”，我们就用幽默的口吻。

```python
from langchain_core.runnables import RunnableLambda
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. 定义两个不同的分支链
tech_chain = ChatPromptTemplate.from_template("你是一位严谨的工程师，请回答技术问题：{input}") | ChatOpenAI()
chat_chain = ChatPromptTemplate.from_template("你是一位幽默的脱口秀演员，请回应：{input}") | ChatOpenAI()

# 2. 定义分类逻辑
def route(info):
    # 这里的 info 会接收上游传来的数据
    if "bug" in info["topic"].lower() or "代码" in info["topic"]:
        return tech_chain
    else:
        return chat_chain

# 3. 构建全链
# 输入数据 -> 提取/准备数据 -> 路由判断 -> 执行对应分支
full_route_chain = (
    {"topic": RunnablePassthrough()} # 包装输入
    | RunnableLambda(route)          # 核心：根据输入返回另一个 Runnable(也就是链)
)

# 4. 测试
print("--- 技术路径 ---")
print(full_route_chain.invoke("我的代码报错了"))

print("\n--- 闲聊路径 ---")
print(full_route_chain.invoke("今天天气不错"))
```

**深度解析 🧠**

这里的关键在于 **`RunnableLambda(route)`**。在 LCEL 中，如果一个函数返回的是另一个 `Chain` 或 `Runnable`，LangChain 会**自动执行**返回的那个链。这就像是你在十字路口问路，路标（route 函数）不仅告诉你该往哪走，还直接把你送到了目的地。

------

### 3.3 状态透传与中间变量保留 

在 LCEL 中，如果直接使用管道符 `|`，上一步的输出会完全**替换**掉输入。但很多时候，我们需要不断地在原有的数据包上“累加”新信息，而不是替换它。

`RunnablePassthrough.assign()` 的妙处在于它实现了类似于 Python 字典中 `{**old_dict, "new_key": "new_value"}` 的逻辑。

**代码实操：模拟一个“意图识别 + 背景检索”的链**

```python
from langchain_core.runnables import RunnablePassthrough
from operator import itemgetter

# 1. 模拟一个简单的意图分析函数
def analyze_intent(input_dict):
    text = input_dict["question"]
    return "技术咨询" if "代码" in text else "日常闲聊"

# 2. 模拟一个简单的检索函数
def fake_retriever(input_dict):
    return f"检索到关于 [{input_dict['intent']}] 的相关文档..."

# 3. 使用 assign 构建累加状态的链
chain = (
    # 第一步：把输入的字符串包装成字典 {"question": "..."}
    {"question": RunnablePassthrough()} 
    # 第二步：保留 question，并追加 intent 字段
    | RunnablePassthrough.assign(intent=analyze_intent)
    # 第三步：保留之前的 question 和 intent，并追加 context 字段
    | RunnablePassthrough.assign(context=fake_retriever)
)

# 运行测试
result = chain.invoke("帮我看看这段 Python 代码")
print(result)
# 输出结果会是一个完整的字典：{'question': '...', 'intent': '技术咨询', 'context': '...'}
```

------

### 3.4 容错与回退 

在资深工程师的视野里，模型是不稳定的（可能会超时、触发布控或额度耗尽）。如果你的链条很长，中间任何一个环节断了，整个服务就会崩溃。

LangChain 提供了 `.with_fallbacks()` 方法，允许你为某个组件定义“备胎”。

```python
# 假设我们有一个昂贵但强大的模型，和一个便宜但基础的模型
expensive_model = ChatOpenAI(model="gpt-4")
cheap_model = ChatOpenAI(model="gpt-3.5-turbo")

# 定义一个带回退机制的可执行对象
# 如果 expensive_model 调用失败，它会自动切换到 cheap_model
robust_model = expensive_model.with_fallbacks([cheap_model])

# 这样你的链条就具备了生产级的稳定性
chain = prompt | robust_model | StrOutputParser()
```

在标准的 LCEL 中，数据流向通常是一个**有向无环图 (DAG)**，即数据从 A 流向 B，不能从 B 再回到 A。如果你需要实现“观察结果 -> 重新思考 -> 再次行动”这种循环逻辑，我们通常会引入 **LangGraph**（LangChain 的进化版，专门处理状态循环）。

## 4 Tool&Skill

初级开发者把 Tool 看作是一个简单的 Python 函数，但在资深架构师眼中，**Tool 是大模型与企业真实内网环境交互的“危险边缘”**。它涉及到权限控制、并发瓶颈、数据污染以及极高的失败率。

------

### 4.1 核心基座选型：为什么企业级应用必须用 `BaseTool`？

LangChain 提供了三种构建工具的方法，但它们在工程上的容错率和扩展性天差地别。

1. **`@tool` 装饰器 **

它底层利用 Python 的 `inspect` 模块去猜你的参数。默认情况下，工具名称来源于函数名称。如果需要更具描述性的名称，请对其进行覆盖：

```python
@tool("web_search")  # Custom name
def search(query: str) -> str:
    """Search the web for information.""" #默认情况下，函数的文档字符串会成为工具的描述，帮助模型理解何时使用该工具
    return f"Results for: {query}"

print(search.name)  # web_search
```

**致命缺陷**：无法持有外部状态。如果你的工具需要复用一个 Redis 连接池或者数据库的 Connection，你只能把它写成全局变量（极不优雅且非线程安全）。

2. **`StructuredTool.from_function` (中级过渡方案)**

适合你想把现有的、别人写好的复杂函数直接包装成工具的场景。

```python
from langchain.tools import StructuredTool

def add(a: int, b: int) -> int:
    return a + b

tool = StructuredTool.from_function(
    func=add,
    name="calculator",
    description="计算两个数的和"
)
```

3. **继承 `BaseTool` (企业级终极形态)**

这是一种**面向对象**的开发模式。它的巨大优势在于：**依赖注入 (Dependency Injection)** 和 **严苛的生命周期控制**。

**工程代码模板：构建一个持有状态的工具**

```Python
from typing import Type, Optional
from pydantic import BaseModel, Field
from langchain.tools import BaseTool

# 1. 定义极其严格的数据契约
class UserQuerySchema(BaseModel):
    # Field 的 description 就是喂给大模型的“微型 Prompt”
    email: str = Field(..., description="用户的企业邮箱，必须是 @company.com 结尾")
    action: str = Field(..., pattern="^(disable|enable|query)$", description="仅限这三种操作")

# 2. 继承 BaseTool
class EnterpriseUserTool(BaseTool):
    name: str = "enterprise_user_manager"
    description: str = "用于查询或修改企业内部用户状态。"
    args_schema: Type[BaseModel] = UserQuerySchema
    
    # 【核心优势】：工具内部可以安全地持有外部依赖（如数据库连接池、鉴权 Token）
    # 大模型在调用时，"看不见"这些属性，也无法生成这些属性
    db_pool: Optional[any] = None
    audit_logger: Optional[any] = None

    def _run(self, email: str, action: str) -> str:
        """同步执行逻辑"""
        if not email.endswith("@company.com"):
            return "Error: 邮箱格式不符合企业规范。"
            
        self.audit_logger.log(f"执行操作 {action} on {email}")
        # 执行 db_pool.execute(...)
        return f"操作 {action} 执行成功。"

    async def _arun(self, email: str, action: str) -> str:
        """异步执行逻辑：在高并发后端（如 FastAPI）中，这能防止线程阻塞"""
        # 必须实现真正的 async IO 操作
        pass

# 初始化时注入依赖
# tool = EnterpriseUserTool(db_pool=my_pool, audit_logger=my_logger)
```

------

### 4.2 隐式上下文：动态参数注入 

**工业级痛点**：假设你在做一个基于 SaaS 的数据分析 Agent。大模型需要调用 `query_sales_data` 工具。这个工具在底层执行 SQL 时，**必须加上 `WHERE tenant_id = 'xxx'`**，否则就会引发严重的数据越权（A 公司查到了 B 公司的数据）。

**错误做法**：在 Prompt 里告诉大模型“你是 A 公司的助手，tenant_id 是 1001”，并让大模型在调用工具时把 `1001` 当作参数传进去。

- *为什么错？* 大模型随时可能幻觉，万一它生成了 `1002`，数据就泄露了。绝对不能信任模型生成的权限字段。

**资深做法：参数剥离与运行时注入**

我们在 Pydantic 契约中**隐藏** `tenant_id`，让大模型只生成业务参数。而在工具执行前，利用 LangChain 的 `RunnableConfig` 将真实的租户 ID 注入进去。

```Python
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool

# 契约里只有 query，大模型不知道有 tenant_id 的存在
@tool
def query_sales_data(query: str, config: RunnableConfig) -> str:
    """根据自然语言查询销售数据。"""
    
    # 从外层 API 请求上下文中，安全提取出当前登录用户的租户 ID
    tenant_id = config.get("configurable", {}).get("tenant_id")
    if not tenant_id:
        raise ValueError("严重安全错误：缺失租户上下文！")
        
    print(f"[底层安全隔离] 正在查询租户 {tenant_id} 的数据...")
    # 执行实际的安全 SQL：SELECT * FROM sales WHERE tenant_id = ?
    return "销售数据如下..."

# 后端框架在调用 Agent 时，强制绑定上下文配置，即这里的tenant_id应该是后端查询后强制绑定的
# agent_executor.invoke(
#    {"input": "帮我看看上个月的销量"}, 
#    config={"configurable": {"tenant_id": "tenant_1001"}}，
# )
```

------

### 4.3 工具爆炸与智能路由 

随着业务发展，你的系统可能积累了 100 个甚至上千个工具（查天气、查库存、查 HR 政策、建 Jira 工单...）。

**痛点**：如果你把 100 个工具的 Schema 全部塞进系统提示词，不仅会立刻耗尽 Token，模型还会因为“注意力分散”而频繁调错工具。

**核心架构拆解：Tool Map 与 Vector Store 的双轨制**

在代码实现前，我们必须搞清楚一个逻辑：**大模型需要的是带有完整 Pydantic Schema 的 Python 工具对象，而向量数据库只能存文本和元数据。**

因此，我们的架构必须是“双轨制”：

1. **Tool Registry (工具字典)**：在内存中维护一个 `{ "工具名": 真实的 Python Tool 对象 }` 的哈希表。
2. **Vector Store (向量索引)**：把工具的 `description`（描述）作为文本向量化，把工具的 `name`（名称）存入元数据（Metadata）。

**运行工作流：**

用户提问 ➡️ 向量库匹配 description ➡️ 拿到 Top-K 的工具 name ➡️ 去 Tool Registry 中提取真实的 Tool 对象 ➡️ 动态绑定给 LLM。

------

**详细代码实操：构建动态工具路由系统**

我们将使用 `FAISS` 作为本地向量库，`LangChain` 构建核心逻辑。

1. **准备工具集 (模拟企业环境下的众多工具)**

```Python
from langchain_core.tools import tool
from pydantic import BaseModel, Field

# --- 工具 1：财务类 ---
class ExpenseSchema(BaseModel):
    amount: float = Field(..., description="报销金额")
    category: str = Field(..., description="费用类别，如餐饮、交通")

@tool("create_expense_ticket", args_schema=ExpenseSchema)
def create_expense_ticket(amount: float, category: str) -> str:
    """用于创建员工财务报销单。当用户提到“报销”、“打车费”、“发票”时使用。"""
    return f"报销单已生成：{category} - {amount}元"

# --- 工具 2：HR 类 ---
class LeaveSchema(BaseModel):
    days: int = Field(..., description="请假天数")

@tool("apply_leave", args_schema=LeaveSchema)
def apply_leave(days: int) -> str:
    """用于提交员工请假申请。当用户提到“请假”、“休假”、“生病”时使用。"""
    return f"已提交 {days} 天的请假申请。"

# --- 工具 3：IT 支持类 ---
@tool("reset_vpn_password")
def reset_vpn_password() -> str:
    """用于重置公司 VPN 或网络密码。当用户连不上网、VPN报错时使用。"""
    return "VPN 密码已重置，新密码已发送至企业微信。"

# 假设我们有上百个工具，这里放入一个列表
all_enterprise_tools = [create_expense_ticket, apply_leave, reset_vpn_password]
```

2. **构建核心的双轨路由引擎 (Tool Router)**

这是整个架构的心脏。我们需要写一个类来管理向量化和动态提取。

```Python
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

class DynamicToolRouter:
    def __init__(self, tools_list):
        # 1. 建立内存里的 Tool Map
        self.tool_map = {tool.name: tool for tool in tools_list}
        
        # 2. 将工具转化为 Document 对象准备向量化
        # 将 description 作为语义检索的核心内容，name 作为元数据用于后续映射
        docs = [
            Document(
                page_content=tool.description, 
                metadata={"tool_name": tool.name}
            ) for tool in tools_list
        ]
        
        # 3. 建立向量索引 (这里使用 OpenAI 向量模型)
        self.vectorstore = FAISS.from_documents(docs, OpenAIEmbeddings())
        
        # 4. 配置检索器：每次只返回最相关的 2 个工具
        self.retriever = self.vectorstore.as_retriever(search_kwargs={"k": 2})

    def get_relevant_tools(self, query: str):
        """根据用户的自然语言问题，动态返回最相关的工具对象列表"""
        # 语义检索
        retrieved_docs = self.retriever.invoke(query)
        
        # 打印日志以便观察路由过程
        print(f"\n[Tool Router] 针对问题 '{query}'，命中的工具为：")
        
        selected_tools = []
        for doc in retrieved_docs:
            tool_name = doc.metadata["tool_name"]
            selected_tools.append(self.tool_map[tool_name])
            print(f" -> {tool_name} (匹配理由: {doc.page_content[:20]}...)")
            
        return selected_tools
```

3. **将路由引擎接入 LCEL 链**

现在我们把动态路由逻辑和 LLM 组装在一起。我们要实现的是：**LLM 每次收到的 `bind_tools` 都是不一样的。**

```Python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

# 1. 初始化模型和路由引擎
llm = ChatOpenAI(model="gpt-4o", temperature=0)
tool_router = DynamicToolRouter(all_enterprise_tools)

# 2. 定义一个动态绑定的包装函数
def dynamic_llm_call(inputs: dict):
    user_query = inputs["question"]
    
    # 【核心逻辑】：根据用户问题，捞出 Top 2 工具
    relevant_tools = tool_router.get_relevant_tools(user_query)
    
    # 动态将这 2 个工具绑定给大模型
    llm_with_tools = llm.bind_tools(relevant_tools)
    
    # 构造 Prompt 并执行
    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是一个企业智能助手。请使用提供的工具帮助用户。"),
        ("human", "{question}")
    ])
    
    # 组装一条临时的小链条并执行
    chain = prompt | llm_with_tools
    return chain.invoke({"question": user_query})

# 3. 构建主 LCEL 链
main_chain = (
    {"question": RunnablePassthrough()}
    | dynamic_llm_call
)

# ================= 测试运行 =================

# 场景 1：用户想报销
print("\n--- 测试 1 ---")
response1 = main_chain.invoke("我刚才打车花了 50 块钱，帮我处理一下")
print(f"大模型决定调用的工具: {response1.tool_calls}")

# 场景 2：用户网络坏了
print("\n--- 测试 2 ---")
response2 = main_chain.invoke("我 VPN 突然登不上了，一直报 403 错误")
print(f"大模型决定调用的工具: {response2.tool_calls}")
```

------

**生产环境下的高级优化策略 (资深经验)**

在真正的企业级架构中，上面的代码只是骨架，我们通常还会加入以下“护城河”机制：

1. **Always-On Tools (常驻工具池)**

并不是所有工具都需要经过 RAG 检索。某些底层工具（如 `search_web`, `calculator`, `escalate_to_human`）应该**永远**绑定在 LLM 上，无论用户问什么。

- **做法**：`llm.bind_tools(relevant_tools + always_on_tools)`

2. **Hybrid Routing (混合路由机制)**

如果用户问“帮我提个财务报销单”，向量检索能完美命中。但如果系统庞大，工具名称极其相近（比如 `get_hr_policy` 和 `get_finance_policy`），向量搜索可能会找错。

- **工业级解法**：在向量检索之上，加一层轻量级的**大模型意图分类路由 (Semantic Router)**。先让一个便宜、极速的模型（如 Claude-3-Haiku）判断大类（如：HR / IT / 财务），然后再去对应的子工具向量库中进行检索。

3. **动态 Prompt 构建 (注入工具指南)**

有些极其复杂的工具，光靠 Pydantic Schema 是不够的，还需要在 Prompt 里给出“SOP（标准作业程序）”。

- **做法**：既然我们在 `Tool Router` 中捞出了特定的工具，我们就可以同时把这些特定工具的 SOP 拼接到 `SystemMessage` 中。没捞到的工具，其 SOP 就不占用 Token。这被称为**动态系统提示词**。

**工程师总结**

通过 **RAG for Tools**：

1. **你的系统不再有能力上限**：无论你有 10 个工具还是 10,000 个工具，大模型每次处理的 Token 数量和难度是不变的。
2. **极高的精准度**：因为每次只给 LLM 极少数最相关的选项，模型产生“幻觉”调用错误工具的概率几乎降为 0。

希望这些代码和架构思考，能为你构建生产级的 Agent 带来实质性的启发！如果有任何一行代码的逻辑需要探讨，随时告诉我。

------

### 4.4 生产生存指南：工具异常的“自愈循环”

在真实网络环境中，API 会限流，SQL 会报错。如果工具执行函数直接 `raise Exception`，整个 Agent 链条会当场崩溃，抛出 500 错误。

**工程化策略：让 LLM 从错误中学习并重试 (Error Feedback)**

不要让错误打断循环，而是**把报错信息当作一种 `Observation`（观察结果）还给大模型**，让大模型自行修正。

```Python
from langchain_core.tools import ToolException

def safe_divide(a: int, b: int) -> float:
    """执行除法运算。"""
    if b == 0:
        # 主动抛出受控的 ToolException
        raise ToolException("数学错误：除数不能为0。请检查你的输入并提供一个非零的除数。")
    return a / b

# 在包装工具时，开启 handle_tool_error
divide_tool = StructuredTool.from_function(
    func=safe_divide,
    # 当捕获到 ToolException 时，将错误信息作为字符串返回给大模型
    handle_tool_error=True 
)
```

**运行时的自愈流程：**

1. LLM 决定调用 `safe_divide(a=10, b=0)`。
2. 工具抛出异常。由于 `handle_tool_error=True`，LangChain 拦截异常，并将字符串 `"数学错误：除数不能为0..."` 发回给 LLM。
3. LLM 收到反馈，进行**自我反思 (Self-Reflection)**：“哦，我不能传 0，那我换个数字。”
4. LLM 重新发起调用 `safe_divide(a=10, b=2)`。
5. 成功返回。

------

## 5 状态、上下文与长短期记忆 (Memory & Context)

**⏳ 短期记忆 (Short-term Memory)：**

- **作用：** 维持当前这轮聊天的连贯性，通常是最近 N 轮的对话记录。
- **持久化：** 因为读写极度频繁，通常存储在 **Redis** 等内存型高速缓存数据库中。

**🗓️ 长期记忆 (Long-term Memory)：** 负责跨越时间周期（比如几个月后）记住信息。它主要分为两类：

- **实体记忆 (Entity Memory)：** 存储明确的、结构化的“客观事实”。比如 `{"爱好": "摄影", "职业": "架构师"}`。通常通过后台模型静默抽取，存储在**图数据库**或**关系型数据库 (SQL)** 中。
- **向量记忆 (Vector Memory)：** 存储模糊的“经验与探讨”。比如你们曾经花半小时讨论过“微服务架构的设计方案”。系统会将这些历史对话切块并转化为向量，存储在**向量数据库 (Vector DB)** 中，以便未来通过语义相似度找回。

**🏗️ 整体流转架构：** 当用户输入新消息 -> 系统去 Redis 拉取“短期记忆” -> 去长期数据库检索相关的“实体”和“向量”记忆 -> 将所有筛选出的记忆组装到当前的 **Context** 中 -> 发送给大模型生成回复 -> 后台异步更新各个记忆数据库。

### 5.1 短期记忆：会话上下文管理与 Token 压榨

我们必须先确立一个架构共识：**大模型本身是绝对“失忆”的（Stateless）。**它没有脑容量来记住你上一秒说的话。所谓的“记忆”，全靠我们在后端把历史聊天记录像“俄罗斯套娃”一样，拼接在最新的 Prompt 里发给它。

这带来了一个致命的工程痛点：**Token 爆炸**。

如果用户聊了 100 轮，你把 100 轮全传过去：

1. **API 费用呈指数级飙升**（因为每次请求的输入 Token 都在增加）。
2. **响应延迟（Latency）极高**。
3. **“中间失忆症 (Lost in the Middle)”**：当输入过长时，LLM 会严重忽略中间的文本，只关注开头和结尾。

为了解决这个问题，LangChain 经历了从“古典时代”到“现代 LCEL 时代”的演进。

**1. 古典陷阱：`ConversationBufferMemory` 为什么被淘汰？**

在很多早期的教程中，你会看到 `ConversationBufferMemory`。它的逻辑最简单：把用户和 AI 说过的每一句话，原封不动地存在一个列表里，然后全量传给 LLM。

**资深工程师视角：** 这是玩具代码。在生产环境中，**永远不要使用无上限的 Buffer**。只要用户一直聊，它一定会触发 API 的 `max_tokens` 报错，导致整个服务直接崩溃。我们需要的是**可控的上下文截断策略**。

2. **现代策略 A：滑动窗口 (Sliding Window) 与 `trim_messages`**

这是目前生产环境中最常用、性价比最高的策略。它的核心思想是：**“好汉不提当年勇，只看最近 N 轮”**。

在最新的 LangChain Core 中，我们不再依赖老旧的 `Memory` 类，而是直接在消息流（Message List）上使用 **`trim_messages`** 工具函数。

**工程化实操代码：**

```Python
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, trim_messages
from langchain_openai import ChatOpenAI

# 模拟一段极长的历史对话 (假设从数据库里捞出来的)
long_history = [
    HumanMessage("我叫王大锤，是一名前端开发。"),
    AIMessage("你好王大锤，很高兴认识你！"),
    HumanMessage("我最近在学 React。"),
    AIMessage("React 是个很棒的框架，需要帮忙吗？"),
    HumanMessage("你能帮我写个 Hook 吗？"),
    AIMessage("没问题，你要什么功能的？"),
    HumanMessage("我要一个防抖的 Hook。") # 这是用户最新的问题
]

# 工业级截断器：严格控制传递给大模型的 Token 数量
trimmed_history = trim_messages(
    long_history,
    max_tokens=40,            # 设定最大允许的 token 数量
    strategy="last",          # 策略：保留最新的消息，丢弃最老的
    token_counter=ChatOpenAI(model="gpt-3.5-turbo"), # 使用具体的模型来精准计算 Token
    include_system=True,      # 强制：系统提示词绝不能被截断丢弃！
    allow_partial=False       # 不允许截断半句话，要丢就丢完整的一条 Message
)

print(f"原始长度: {len(long_history)} 条")
print(f"截断后长度: {len(trimmed_history)} 条")
print("实际传给模型的内容:", trimmed_history)
```

**优缺点分析：**

- **优点**：Token 消耗极其稳定，永远不会超载崩溃。实现简单，延迟极低。
- **缺点**：刚性的物理截断。如果在第 1 轮用户说了他的名字，而在第 10 轮问“我叫什么”，由于窗口只保留最近 5 轮，LLM 会直接回答“不知道”。

**3. 现代策略 B：动态摘要 (Summary Memory)**

为了弥补滑动窗口“一刀切”的缺陷，我们需要引入**动态摘要机制**。

它的核心逻辑是：**“大群聊天太长看不过来，我们单开一个小号帮你做会议纪要”。**

我们将保留最近的 3 轮完整对话（用于维持当下的聊天连贯性），而将更早的 100 轮对话，交给一个后台的小模型（如 GPT-3.5-Turbo 或者更便宜的开源模型），让它压缩成一段 200 字的摘要。

**架构设计流：**

1. 监听对话轮数。

2. 当 `len(messages) > 10` 时，触发异步后台任务 (Celery / Asyncio)。

3. 后台任务 Prompt：*“请将以下对话总结为第三人称视角的摘要，重点保留用户的个人信息、意图和关键事实。”*

4. 下一次请求时，拼装的 Prompt 结构变为：

   `[SystemMessage] + [SummaryMessage(包含过往摘要)] + [最近 3 轮的 Message]`。

**优缺点分析：**

- **优点**：在可控的 Token 范围内，实现了近乎“无限”的记忆视野。
- **缺点**：工程复杂度剧增。额外引入了一次 LLM 调用，增加了成本。且摘要过程不可避免地会丢失细节语意（比如原话的情感色彩）。

------

在企业级应用的“短期记忆”管理中，我们并不追求让 AI 记住所有字，而是追求 **Token 成本、响应速度和语义完整度** 的黄金三角平衡。

一般 To C 的聊天产品（如客服），用 **滑动窗口（按 Token 截断）** 足够了；而长周期的陪伴型 AI 或深度的代码助手，必须上 **混合架构（滑动窗口 + 动态摘要）**。

收到。我们严格按照大纲，一步一步扎实推进。绝不走马观花。

### 5.2 持久化层设计

------

**🗄️ 为什么生产环境不能用内存（RAM）存记忆？**

在上一节测试 `trim_messages` 时，我们的聊天记录 `long_history` 是存在一个 Python 列表变量里的。在企业级后端架构（如 FastAPI, Django, SpringBoot）中，这种做法是致命的：

1. **无状态与负载均衡**：生产环境通常会启动多个后端进程（Worker）甚至跨多台服务器。用户的第一句话可能打到了服务器 A，第二句话打到了服务器 B。如果记忆存在服务器 A 的内存里，服务器 B 是拿不到的，大模型就会“失忆”。
2. **数据丢失**：每次重新发布代码或容器重启，内存里的聊天记录就会瞬间清空。

**资深架构方案**：将 Agent 的大脑（逻辑）和海马体（记忆）物理拆分。我们引入 **分布式缓存（Redis）** 或 **关系型数据库（Postgres/MySQL）** 来作为全局持久化层。

**🛡️ 多租户架构与 Session 隔离**

在 2C 的产品中，可能有上万个用户同时在和你的 Agent 聊天。我们必须做到绝对的**数据隔离**，确保张三绝对不能通过系统漏洞看到李四的聊天记录。

在 LangChain 中，实现这种隔离的核心机制是 **`RunnableWithMessageHistory`** 配合 **`session_id`**。

**工程化代码实操：基于 Redis 的分布式会话隔离**

```Python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_openai import ChatOpenAI

# 1. 构建基础链 (注意 MessagesPlaceholder 的占位)
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个专业的后端工程师助手。"),
    MessagesPlaceholder(variable_name="chat_history"), 
    ("human", "{question}")
])
chain = prompt | ChatOpenAI(model="gpt-3.5-turbo")

# 2. 核心工厂函数：动态获取指定 Session 的持久化记忆
def get_redis_history(session_id: str):
    """
    当请求到来时，LangChain 会自动调用这个函数。
    session_id 是实现多租户隔离的唯一标识 (例如: user_1001_chat_001)
    """
    return RedisChatMessageHistory(
        session_id=session_id,
        url="redis://localhost:6379/0" 
    )

# 3. 包装器：将基础链升级为带分布式记忆的链
# 它会自动拦截输入，去 Redis 拿历史记录；执行完毕后，再自动把新对话存回 Redis。
conversational_chain = RunnableWithMessageHistory(
    runnable=chain,
    get_session_history=get_redis_history,
    input_messages_key="question",
    history_messages_key="chat_history", 
)

# ================= 生产环境运行模拟 =================

# 租户 A (张三) 的请求打过来了
response_A = conversational_chain.invoke(
    {"question": "我的项目是用 FastAPI 写的。"},
    # 这里的 config 是通过后端的 JWT Token 解析出来的当前用户身份
    config={"configurable": {"session_id": "tenant_zhangsan_01"}}
)

# 租户 B (李四) 的请求同时打过来了
response_B = conversational_chain.invoke(
    {"question": "你知道我刚才说我用了什么框架吗？"},
    config={"configurable": {"session_id": "tenant_lisi_99"}}
)
# AI 会回答李四：不知道。因为李四的 session_id 在 Redis 里是空的。
```

**⚖️ 选型权衡：Redis vs Postgres**

在实际工程中，你会面临选哪种数据库存记忆的问题：

- **Redis (内存型)**：
  - *优势*：极速的读写性能（毫秒级），非常适合高并发的实时聊天场景。
  - *劣势*：内存昂贵，不适合永久存储用户几年前的废话。
- **Postgres / MySQL (关系型)**：
  - *优势*：持久化安全，方便做复杂的数据分析（比如写 SQL 统计“哪个用户本月聊得最多”）。
  - *劣势*：高并发下磁盘 I/O 容易成为系统瓶颈。

**生产级混合架构**：通常我们会用 Redis 存储**最近 24 小时**的活跃会话（热数据），然后通过后台定时任务（如 Celery），将不活跃的对话异步落盘迁移到 Postgres 中（冷数据归档）。

------

这就完成了记忆的物理层设计。大模型不仅拥有了记忆，而且这些记忆能在分布式集群中安全流转了。

针对我们刚才讨论的 Redis 方案，思考一个生产环境中的隐患：

如果你有 100 万个活跃用户，每天产生海量的对话，如果都无脑堆积在 Redis 里，极其昂贵的服务器内存很快就会被撑爆（OOM）。在初始化 Redis 存储机制或者设计这个系统时，我们通常需要利用 Redis 的什么特性来防御这种内存溢出危机？

### 5.3 长期长期记忆：知识与经验的检索

“死狗问题”（昨天说有狗，今天说狗死了，系统怎么处理）切中了长期记忆架构中最核心的痛点：**状态突变与知识冲突**。简单的 RAG 只是“追加（Append-Only）”数据的垃圾桶，而真正的企业级长期记忆，必须是一个支持 **CRUD（增删改查）** 的事务型数据库。

在设计大型智能体系统时，我们通常将长期记忆在逻辑上划分为两层：**情景记忆（Episodic Memory）** 和 **语义/实体记忆（Semantic/Entity Memory）**。它们的选型、存储和更新机制截然不同。

**一、 架构选型与存储引擎**

1. **情景记忆 (Episodic Memory)：存储“经历与经验”**

这部分记忆用于回答：“我们上个月是怎么讨论那个架构方案的？”

- **数据特征：** 非结构化、长文本、重语境、无明显冲突（经历过的事情就是经历过了）。
- **核心痛点：** 召回率（不能漏掉关键经验）和 Token 成本。
- **存储选型指南：**
  - **入门级/中小体量：** `Chroma`, `FAISS`。适合单机部署，无需复杂运维。
  - **企业级/云原生：** `Milvus`, `Pinecone`, `Qdrant`。支持百亿级向量、多租户隔离（Namespace）、极其重要的 **Metadata Filtering（元数据过滤）**能力（如按 `user_id` 和 `timestamp` 过滤后再进行向量检索）。
  - **首选（务实路线）：** **PostgreSQL + `pgvector` 插件**。
    - *为什么推荐？* 在绝大多数 ToB 场景中，引入一个独立的向量数据库会带来严重的“脑裂”问题（关系型数据和向量数据的一致性难以维护）。使用 Postgres，你可以用一条 SQL 语句同时完成用户鉴权、时间过滤和向量相似度计算。

2. **实体/语义记忆 (Entity Memory)：存储“客观事实”**

这部分用于回答：“这个用户的架构栈是什么？”、“他的狗还活着吗？”

- **数据特征：** 结构化、强逻辑、存在状态覆盖（State Overrides）。
- **核心痛点：** 冲突消解（Conflict Resolution）。**向量检索在这里会彻底失效**，因为“我喜欢猫”和“我讨厌猫”在向量空间里的余弦相似度极高。
- **存储选型指南：**
  - **关系型数据库 (PostgreSQL/MySQL)：** 适合属性扁平的用户画像（User Profile）。通过定义明确的表结构（如 `user_preferences` 表）来存储。
  - **图数据库 (Neo4j / Memgraph)：** 当实体间的关系极度复杂时（例如：Agent 需要记住“A 是 B 的上司，B 负责 C 项目，C 项目的截止日期是明天”），图数据库是唯一的解。LangChain 提供了 `GraphCypherQAChain` 可以直接将自然语言转化为 Cypher 查询语句。

------

**二、 核心痛点攻坚：冲突消解与事实覆写**

回到那个经典的并发工程问题：如何处理“昨天有狗，今天狗死了”的冲突？

如果我们只是无脑把用户的聊天记录向量化存入 RAG 库，检索时会同时把“我有狗”和“狗死了”都召回，大模型大概率会精神分裂。

**资深架构方案：将大模型降级为“事件溯源生成器 (Event Sourcing Generator)”**

我们不让模型直接改数据库，而是让后台的信息抽取模型输出**标准化的数据库操作指令**。这就要求我们在 Prompt 和 Pydantic Schema 的设计上引入 **操作符 (Operators)** 的概念。

**核心代码设计架构：**

```Python
from pydantic import BaseModel, Field
from typing import Literal, List

# 1. 定义带有“操作语义”的契约
class FactOperation(BaseModel):
    # 强制模型明确它是在新增、更新还是删除事实
    operation: Literal["INSERT", "UPDATE", "DELETE"] = Field(
        description="操作类型。如果事实发生改变（如原本喜欢变讨厌，活的变死的），使用 UPDATE；如果事实不再存在，使用 DELETE。"
    )
    subject: str = Field(description="事实主体，例如 '宠物', '职位'")
    fact: str = Field(description="事实的具体内容")
    confidence: float = Field(description="你认为这是用户随口一说，还是确凿事实？0.0 - 1.0")

class MemoryUpdateList(BaseModel):
    updates: List[FactOperation]

# 2. 抽取链的 Prompt 设计（极其关键）
extraction_prompt = """
你是一个底层知识图谱的维护引擎。
请分析用户最新的发言，并对比目前的已知事实，输出更新指令。

当前已知事实：
{current_facts}

用户最新发言：
"{user_input}"

规则：
1. 如果用户发言与已知事实冲突，且代表了最新的状态（例如：辞职、宠物离世、搬家），你必须输出 UPDATE 或 DELETE 指令。
2. 忽略临时的情绪发泄，只记录客观事实。
"""
```

**运行流转：**

1. 昨天：用户说“我养了一只柴犬”。大模型输出 `operation: "INSERT", subject: "宠物", fact: "养了一只柴犬"`。存入 DB。
2. 今天：提取 DB，告诉抽取模型当前事实：`{"宠物": "养了一只柴犬"}`。
3. 今天用户说：“我的柴犬上周因病去世了，我好难过”。
4. 抽取模型比对后，输出：`operation: "UPDATE", subject: "宠物", fact: "曾经养过一只柴犬，已离世"`。
5. 后端接收到 JSON，执行真正的 SQL 或 Cypher 更新语句。

这种架构下，记忆库里永远只有**一份最新的 Truth（真相）**。

------

**三、 现代记忆网关 (Memory Gateways)**

在真实的微服务架构中，我们很少自己在业务代码里手搓上述的一大套逻辑。行业内目前演进出了独立的 **Memory Service（记忆微服务）**。

- **Zep (开源/商业化)：** 这是一个专为 LLM 打造的记忆网关。你只需要把聊天记录丢给它的 API，它在底层自动用小模型帮你做摘要归档、实体提取、甚至帮你计算哪些记忆因为太久远已经“衰减”而不需要召回了。
- **Mem0：** 另一个新兴的记忆层抽象，主打跨 Application 的记忆共享。

**架构师建议：** 在项目早期，使用 `PostgreSQL + pgvector` 手写简单的抽取逻辑；当你的 Agent 面对几十万 DAU（日活）时，将记忆模块独立剥离，部署一套专用的 Zep 或类似网关。

------

通过区分情景与实体，并引入类似数据库事务的抽取机制，我们的 Agent 终于有了一个既能回忆往昔，又不会混淆现实的稳定大脑。

现在我们理解了如何用图数据库和事件溯源来管理长期记忆。那么，考虑这样一个场景：

如果你的 Agent 正在与用户进行长期的投资咨询。由于图数据库（实体记忆）只保留了**最新**的真相（例如：用户当前只有“低风险承受能力”），但为了分析用户的投资行为，系统其实需要知道用户过去两年风险偏好的**变化轨迹**。在不破坏当前实体记忆“唯一真相”原则的前提下，我们应该如何设计存储模型，既能让大模型快速读取当前状态，又能保留历史演变的过程？

## 6 Agent

在处理“查一下今天天气”这类简单请求时，大模型可以直接调用工具。但面对诸如“深度调研竞品，生成对比图表并发送分析邮件”这种**长程任务 (Long-horizon Task)**，简单的调用往往会导致模型陷入死循环或耗尽 Token。

为了解决这个问题，工业界演进出了三种核心的底层架构模式：

1️⃣ **ReAct (Reason + Act)：边想边做模式**

- **机制：** 这是一个 `思考 -> 行动 -> 观察` 的不断循环。模型在每一步都会基于当前的观察结果来决定下一步做什么。
- **工程痛点：** 像一个没有全局规划的执行者。如果任务步骤超过 5 步，它极易在某一步报错时卡死（一直尝试调用同一个错误的工具），最终触发 `max_iterations` 导致整个程序崩溃。

2️⃣ **Plan-and-Execute (规划与执行)：包工头模式**

- **机制：** 将系统拆分为独立的大脑。首先，**Planner（规划器）** 纵观全局，输出一个严格的 JSON 任务队列（如：1. 搜集数据 2. 数据清洗 3. 绘图）。然后，**Executor（执行器）** 逐一执行这些原子任务。
- **工程优势：** 完美解决了大模型面对复杂任务时“注意力涣散”的问题，极大地提高了长程任务的成功率。

3️⃣ **Self-Reflection (自我反思)：审查员模式**

- **机制：** 强制在工作流中引入“对抗”。生成节点 (Generator) 给出初步结果后，将其传递给批评节点 (Critic)。Critic 负责挑错并给出修改建议，将任务打回重做，直到结果通过校验。
- **适用场景：** 对准确率要求极高的代码生成、财务核对或合同撰写。

### 6.2 中间件

在最新的 LangChain 架构中，`create_agent` 被赋予了全新的能力。仅仅靠 LCEL 的 Callbacks 无法优雅地处理“改变 Agent 内部状态”的需求（比如动态修改 Prompt、截断上下文、或者强行叫停 Agent）。与 FastAPI 拦截外部 HTTP 请求的中间件不同，LangChain 的 Agent Middleware 是**拦截 Agent 内部的思考循环 (Agent Loop)**。

一个标准的 Agent 循环是：`调用模型 -> 选择工具 -> 执行工具 -> 再次调用模型`。

Middleware 为你提供了钩子（Hooks），可以在这个循环的每一个缝隙插入逻辑：

- `before_agent` / `after_agent`：整个 Agent 任务开始和结束时。
- `before_model` / `after_model`：模型每次思考前后（极度适合用来**拦截溢出的 Token** 或动态注入 Prompt）。
- `wrap_tool_call`：拦截工具调用（适合用来做**重试机制**、权限校验）。

**代码级注入方式极其简洁：**

```Python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware, HumanInTheLoopMiddleware

# 通过 middleware 参数将拦截器组成洋葱模型
agent = create_agent(
    model="gpt-4o", 
    tools=[...], 
    middleware=[ 
        SummarizationMiddleware(...), # 负责拦截和压缩上下文
        HumanInTheLoopMiddleware(...) # 负责拦截高危操作
    ]
)
```

**常用的中间件：**

1. **`SummarizationMiddleware` (防爆掉的守护者)**
   - **痛点**：多轮对话后，历史记录 + 工具返回的海量 JSON 会瞬间撑爆 `gpt-4o` 的 128k 窗口，触发 API 报错。
   - **作用**：这个中间件会在 `before_model` 钩子处静默计算 Token。一旦发现即将超载，它会**自动**调用一个小模型，把前 10 轮的历史记录压缩成一段摘要，从而永远保持上下文的安全。
2. **`TodoListMiddleware` (防迷失的规划师)**
   - **作用**：它会自动给 Agent 注入一个隐藏的 `write_todos` 工具，并修改 System Prompt。当 Agent 面对复杂任务时，这个中间件会逼迫 Agent 先建立一个 Todo List，做完一步划掉一步（pending -> in_progress -> completed），极大降低了长程任务的出错率。

3. **HumanInTheLoopMiddleware (HITL)**

大模型绝对不能在没有人类授权的情况下执行敏感操作（如：发送外部邮件、执行 DELETE SQL、进行真实转账）。

**底层逻辑：如何让 Python 停下来？**

如果是在普通的 Python 脚本里，你可能会用 `input()` 来等待人类。但在高并发的后端服务器中，这是灾难，会导致线程全部阻塞。`HumanInTheLoopMiddleware` 完美解决了这个问题，它的核心依赖是 **Checkpointer（检查点/持久化）**。

```Python
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.checkpoint.memory import InMemorySaver # 生产中用 PostgresSaver
from langchain_core.tools import tool

# 1. 定义一个高危工具
@tool
def transfer_money(amount: float, target_account: str):
    """转账给目标账户。这是一个敏感操作。"""
    return f"已成功向 {target_account} 转账 {amount} 元。"

# 2. 初始化持久化引擎 (Agent 挂起时，状态存在这里)
checkpointer = InMemorySaver()

# 3. 初始化 HITL 中间件
# 配置策略：只有在调用 transfer_money 这个特定工具前，才强制拦截！
hitl_middleware = HumanInTheLoopMiddleware(
    interrupt_on_tools=["transfer_money"] 
)

# 4. 创建受中间件保护的 Agent
agent = create_agent(
    model=llm,
    tools=[transfer_money, search_weather], # 天气工具不会被拦截
    middleware=[hitl_middleware],
    checkpointer=checkpointer # 必须传入 checkpointer
)

# ================= 运行流转演示 =================

# 指定一个线程 ID，实现多租户与会话隔离
config = {"configurable": {"thread_id": "user_101_tx_001"}}

# 第一阶段：Agent 开始思考，发现需要转账，触发 HITL 中间件！
print("--- 第一阶段：Agent 发起请求 ---")
response = agent.invoke({"input": "给张三转账 500 块"}, config=config)

# 此时！Agent 进程彻底中止，释放服务器资源。
# 中间件抛出中断状态，你可以在 response 中拿到挂起的请求信息。
print(f"当前 Agent 状态: 已挂起等待审批...")

# 第二阶段：人类在前端点击了“批准”
print("\n--- 第二阶段：人类介入并批准 ---")
# 我们拿着同样的 thread_id，告诉 Agent："人类同意了，请继续"
response = agent.invoke(
    {"human_approval": "approved"}, # 注入人类决策
    config=config
)

print(f"Agent 最终执行结果: {response['output']}")
```

**HITL 中间件的工程价值：** 彻底解耦了“AI 的思考速度”和“人类的审批速度”。哪怕人类第二天早上才来点击批准，只要 Postgres 数据库还在，Agent 就能从昨天被冻结的那一秒钟瞬间“复活”并继续执行。

------



