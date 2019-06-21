## 介绍React Hook

`Hooks`是React 16.8的新特性，允许你不创建`class`组件也能使用`state`和其他react特性
```JavaScript
import React, { useState } from 'react';

function Example() {
  //声明一个`count` state变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
`useState`方法就是我们要讨论的第一个`Hook`方法，这个只是一个简单的例子，下面深入理解。

你可以跳转到下一篇文章去开始学习`Hooks`，本文，我们主要介绍为什么要引入`React Hooks`,它如何帮助你优化程序。

> 注意：`React 16.8.0`是`Hooks`的第一个`release`版本，更新依赖包时，别忘记更新所有的包，包含`React DOM`。`React Native`将在下一个稳定的`release`版本中支持`Hooks`。



### 无破坏性变更
开始之前，要注意`Hooks`以下几点：

- 可选功能。在一些组件中使用`Hooks`无需重写代码。如果不想用也没有必要学习`Hooks`。
- 100%向下兼容。`Hooks`不会导致任何破坏性变更
- 开箱即用。`React 16.8.0`现在已经支持`Hooks`了

**react不会移除`class`**。你可以阅读本文下方的`Hooks`逐步使用策略。

**`Hoooks`不会替代React原有的概念**。相反，`Hooks`针对你所了解的react知识提供了更直接的API，例如`porps，state，context, refs,生命周期`等。

如果只想使用`Hooks`，可以直接进入下一篇！本篇继续讲为什么要引入`Hooks`，如何在不用重写应用的情况下使用`Hooks`


### 动机

`Hooks`旨在解决一些看起来在React中无关紧要的问题，这些问题是我们过去五年来维护成千上万个组件过程中出现的难题。无论你是否在学习react，还是每一天都在使用，甚至在使用一些类似的组件模型的JS库，你都有可能会发现这些难题。

#### 在组件之间使用状态逻辑比较困难
React没有提供一种可复用组件的方式（例如：将组件关联到`store`中），如果使用React一段时间，你会发现一些组合方案像`props`和`高阶组件`能以解决此类问题。但是，使用这种组合就得重构组件，
这是一种笨重且属于硬编码的方式。使用`Dev Tools`工具查看一些典型的React代码，你会发现组件（`provider， 自定义组件、高阶组件以及其他抽象组件`）陷入“嵌套地狱”。当你在`Dev Tools`中查看组件，你会发现一个深层次的根本性问题：
React迫切需要一种原生功能来共享`state`状态逻辑。

使用`Hooks`可以从组件中抽取状态逻辑，以便于独立测试以及复用。`Hooks`允许在不改变组件层级的情况下复用状态逻辑，这就使得`Hooks`在组件或交互中的共享变的容易。

#### 复杂组件难以理解

我们经常会维护一些组件，他们从简单的例子逐渐变成一种庞大的组件，导致无法管理的状态逻辑，而且还有很多副作用。每一个生命周期方法往往都混合了一些不相关的逻辑。例如，组件可能会在`componentDidMount`和`componentDidUpdate`中
执行网络请求，然而同样是`componentDidMount`，也可能会包含不相关的逻辑，例如设置一些监听（`listener`），并且在`componentWillUnmount`中取消监听。互相关联的代码被分隔，但是完全无关的代码却整合在了一个方法中。这很容易导致粗线bug和矛盾。

大部分情况下无法将这类组件差分为小组件，以为状态逻辑到处都是。测试起来也很困难。这就是为什么一些人宁愿将React和独立管理`state`的JS库结合使用的原因了，这样会增加很多概念，也会让你在不同文件中来回跳转，最终导致组件更难复用。

为了解决此类问题，`Hooks`允许你将组件根据相关逻辑拆分为几个方法（例如：设置`subscription`或者网络请求），而不是像之前那样根据生命周期强迫拆分代码了。你也可以选择使用`reducer`管理组件自身的状态使组件变的可控。

#### 类（Class）混淆了人和机器

除了代码难以复用和管理以外，我们发现`class`成为学习React的负担。你必须得理解class是如何在JS中运行的，在不同的语言中区别还很大。你必须得记得`bind`事件的`handlers`。缺乏动态的语法提示，代码变的冗长难理解。开发者对
`props，state，自伤而下的数据流`这些概念理解不深，但是仍然要跟`class`挣扎。React中function组件和class组件的区别，以及何时使用哪一个，不同的React开发者都有争议。


Additionally, React has been out for about five years, and we want to make sure it stays relevant in the next five years. As Svelte, Angular, Glimmer, and others show, ahead-of-time
 compilation of components has a lot of future potential. Especially if it’s not limited to templates. Recently, we’ve been experimenting with component folding using Prepack, and 
 we’ve seen promising early results. However, we found that class components can encourage unintentional patterns that make these optimizations fall back to a slower path. Classes 
 present issues for today’s tools, too. For example, classes don’t minify very well, and they make hot reloading flaky and unreliable. We want to present an API that makes it more 
 likely for code to stay on the optimizable path.

To solve these problems, Hooks let you use more of React’s features without classes. Conceptually, React components have always been closer to functions. Hooks embrace functions, 
but without sacrificing the practical spirit of React. Hooks provide access to imperative escape hatches and don’t require you to learn complex functional or reactive programming 
techniques.

Examples

Hooks at a Glance is a good place to start learning Hooks.

Gradual Adoption Strategy
TLDR: There are no plans to remove classes from React.

We know that React developers are focused on shipping products and don’t have time to look into every new API that’s being released. Hooks are very new, and it might be better to 
wait for more examples and tutorials before considering learning or adopting them.

We also understand that the bar for adding a new primitive to React is extremely high. For curious readers, we have prepared a detailed RFC that dives into motivation with more 
details, and provides extra perspective on the specific design decisions and related prior art.

Crucially, Hooks work side-by-side with existing code so you can adopt them gradually. There is no rush to migrate to Hooks. We recommend avoiding any “big rewrites”, especially 
for existing, complex class components. It takes a bit of a mindshift to start “thinking in Hooks”. In our experience, it’s best to practice using Hooks in new and non-critical 
components first, and ensure that everybody on your team feels comfortable with them. After you give Hooks a try, please feel free to send us feedback, positive or negative.

We intend for Hooks to cover all existing use cases for classes, but we will keep supporting class components for the foreseeable future. At Facebook, we have tens of thousands of 
components written as classes, and we have absolutely no plans to rewrite them. Instead, we are starting to use Hooks in the new code side by side with classes.

Frequently Asked Questions
We’ve prepared a Hooks FAQ page that answers the most common questions about Hooks.

Next Steps
By the end of this page, you should have a rough idea of what problems Hooks are solving, but many details are probably unclear. Don’t worry! Let’s now go to the next page where 
we start learning about Hooks by example.