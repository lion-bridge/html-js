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

在组件之间使用状态逻辑比较困难，React没有提供一种可复用组件的方式（例如：将组件关联到`store`中），如果使用React一段时间，你会发现一些组合方案像`props`和`高阶组件`能以解决此类问题。但是，使用这种组合就得重构组件，
这是一种笨重且属于硬编码的方式。

It’s hard to reuse stateful logic between components
React doesn’t offer a way to “attach” reusable behavior to a component (for example, connecting it to a store). If you’ve worked with React for a while, you may be familiar 
with patterns like render props and higher-order components that try to solve this. But these patterns require you to restructure your components when you use them, 
which can be cumbersome and make code harder to follow. If you look at a typical React application in React DevTools, you will likely find a “wrapper hell” of 
components surrounded by layers of providers, consumers, higher-order components, render props, and other abstractions. While we could filter them out in DevTools, 
this points to a deeper underlying problem: React needs a better primitive for sharing stateful logic.

With Hooks, you can extract stateful logic from a component so it can be tested independently and reused. Hooks allow you to reuse stateful logic without changing your component hierarchy. This makes it easy to share Hooks among many components or with the community.

We’ll discuss this more in Building Your Own Hooks.

Complex components become hard to understand
We’ve often had to maintain components that started out simple but grew into an unmanageable mess of stateful logic and side effects. Each lifecycle method often contains a mix of unrelated logic. For example, components might perform some data fetching in componentDidMount and componentDidUpdate. However, the same componentDidMount method might also contain some unrelated logic that sets up event listeners, with cleanup performed in componentWillUnmount. Mutually related code that changes together gets split apart, but completely unrelated code ends up combined in a single method. This makes it too easy to introduce bugs and inconsistencies.

In many cases it’s not possible to break these components into smaller ones because the stateful logic is all over the place. It’s also difficult to test them. This is one of the reasons many people prefer to combine React with a separate state management library. However, that often introduces too much abstraction, requires you to jump between different files, and makes reusing components more difficult.

To solve this, Hooks let you split one component into smaller functions based on what pieces are related (such as setting up a subscription or fetching data), rather than forcing a split based on lifecycle methods. You may also opt into managing the component’s local state with a reducer to make it more predictable.

We’ll discuss this more in Using the Effect Hook.

Classes confuse both people and machines
In addition to making code reuse and code organization more difficult, we’ve found that classes can be a large barrier to learning React. You have to understand how this works in JavaScript, which is very different from how it works in most languages. You have to remember to bind the event handlers. Without unstable syntax proposals, the code is very verbose. People can understand props, state, and top-down data flow perfectly well but still struggle with classes. The distinction between function and class components in React and when to use each one leads to disagreements even between experienced React developers.

Additionally, React has been out for about five years, and we want to make sure it stays relevant in the next five years. As Svelte, Angular, Glimmer, and others show, ahead-of-time compilation of components has a lot of future potential. Especially if it’s not limited to templates. Recently, we’ve been experimenting with component folding using Prepack, and we’ve seen promising early results. However, we found that class components can encourage unintentional patterns that make these optimizations fall back to a slower path. Classes present issues for today’s tools, too. For example, classes don’t minify very well, and they make hot reloading flaky and unreliable. We want to present an API that makes it more likely for code to stay on the optimizable path.

To solve these problems, Hooks let you use more of React’s features without classes. Conceptually, React components have always been closer to functions. Hooks embrace functions, but without sacrificing the practical spirit of React. Hooks provide access to imperative escape hatches and don’t require you to learn complex functional or reactive programming techniques.

Examples

Hooks at a Glance is a good place to start learning Hooks.

Gradual Adoption Strategy
TLDR: There are no plans to remove classes from React.

We know that React developers are focused on shipping products and don’t have time to look into every new API that’s being released. Hooks are very new, and it might be better to wait for more examples and tutorials before considering learning or adopting them.

We also understand that the bar for adding a new primitive to React is extremely high. For curious readers, we have prepared a detailed RFC that dives into motivation with more details, and provides extra perspective on the specific design decisions and related prior art.

Crucially, Hooks work side-by-side with existing code so you can adopt them gradually. There is no rush to migrate to Hooks. We recommend avoiding any “big rewrites”, especially for existing, complex class components. It takes a bit of a mindshift to start “thinking in Hooks”. In our experience, it’s best to practice using Hooks in new and non-critical components first, and ensure that everybody on your team feels comfortable with them. After you give Hooks a try, please feel free to send us feedback, positive or negative.

We intend for Hooks to cover all existing use cases for classes, but we will keep supporting class components for the foreseeable future. At Facebook, we have tens of thousands of components written as classes, and we have absolutely no plans to rewrite them. Instead, we are starting to use Hooks in the new code side by side with classes.

Frequently Asked Questions
We’ve prepared a Hooks FAQ page that answers the most common questions about Hooks.

Next Steps
By the end of this page, you should have a rough idea of what problems Hooks are solving, but many details are probably unclear. Don’t worry! Let’s now go to the next page where we start learning about Hooks by example.