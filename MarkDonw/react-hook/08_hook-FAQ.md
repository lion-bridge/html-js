Hooks FAQ
Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.

This page answers some of the frequently asked questions about Hooks.

Adoption Strategy

Which versions of React include Hooks?
Do I need to rewrite all my class components?
What can I do with Hooks that I couldn’t with classes?
How much of my React knowledge stays relevant?
Should I use Hooks, classes, or a mix of both?
Do Hooks cover all use cases for classes?
Do Hooks replace render props and higher-order components?
What do Hooks mean for popular APIs like Redux connect() and React Router?
Do Hooks work with static typing?
How to test components that use Hooks?
What exactly do the lint rules enforce?
From Classes to Hooks

How do lifecycle methods correspond to Hooks?
How can I do data fetching with Hooks?
Is there something like instance variables?
Should I use one or many state variables?
Can I run an effect only on updates?
How to get the previous props or state?
Why am I seeing stale props or state inside my function?
How do I implement getDerivedStateFromProps?
Is there something like forceUpdate?
Can I make a ref to a function component?
How can I measure a DOM node?
What does const [thing, setThing] = useState() mean?
Performance Optimizations

Can I skip an effect on updates?
Is it safe to omit functions from the list of dependencies?
What can I do if my effect dependencies change too often?
How do I implement shouldComponentUpdate?
How to memoize calculations?
How to create expensive objects lazily?
Are Hooks slow because of creating functions in render?
How to avoid passing callbacks down?
How to read an often-changing value from useCallback?
Under the Hood

How does React associate Hook calls with components?
What is the prior art for Hooks?
Adoption Strategy
Which versions of React include Hooks?
Starting with 16.8.0, React includes a stable implementation of React Hooks for:

React DOM
React DOM Server
React Test Renderer
React Shallow Renderer
Note that to enable Hooks, all React packages need to be 16.8.0 or higher. Hooks won’t work if you forget to update, for example, React DOM.

React Native will fully support Hooks in its next stable release.

Do I need to rewrite all my class components?
No. There are no plans to remove classes from React — we all need to keep shipping products and can’t afford rewrites. We recommend trying Hooks in new code.

What can I do with Hooks that I couldn’t with classes?
Hooks offer a powerful and expressive new way to reuse functionality between components. “Building Your Own Hooks” provides a glimpse of what’s possible. This article by a React core team member dives deeper into the new capabilities unlocked by Hooks.

How much of my React knowledge stays relevant?
Hooks are a more direct way to use the React features you already know — such as state, lifecycle, context, and refs. They don’t fundamentally change how React works, and your knowledge of components, props, and top-down data flow is just as relevant.

Hooks do have a learning curve of their own. If there’s something missing in this documentation, raise an issue and we’ll try to help.

Should I use Hooks, classes, or a mix of both?
When you’re ready, we’d encourage you to start trying Hooks in new components you write. Make sure everyone on your team is on board with using them and familiar with this documentation. We don’t recommend rewriting your existing classes to Hooks unless you planned to rewrite them anyway (e.g. to fix bugs).

You can’t use Hooks inside of a class component, but you can definitely mix classes and function components with Hooks in a single tree. Whether a component is a class or a function that uses Hooks is an implementation detail of that component. In the longer term, we expect Hooks to be the primary way people write React components.

Do Hooks cover all use cases for classes?
Our goal is for Hooks to cover all use cases for classes as soon as possible. There are no Hook equivalents to the uncommon getSnapshotBeforeUpdate and componentDidCatch lifecycles yet, but we plan to add them soon.

It is an early time for Hooks, and some third-party libraries might not be compatible with Hooks at the moment.

Do Hooks replace render props and higher-order components?
Often, render props and higher-order components render only a single child. We think Hooks are a simpler way to serve this use case. There is still a place for both patterns (for example, a virtual scroller component might have a renderItem prop, or a visual container component might have its own DOM structure). But in most cases, Hooks will be sufficient and can help reduce nesting in your tree.

What do Hooks mean for popular APIs like Redux connect() and React Router?
You can continue to use the exact same APIs as you always have; they’ll continue to work.

In the future, new versions of these libraries might also export custom Hooks such as useRedux() or useRouter() that let you use the same features without needing wrapper components.

Do Hooks work with static typing?
Hooks were designed with static typing in mind. Because they’re functions, they are easier to type correctly than patterns like higher-order components. The latest Flow and TypeScript React definitions include support for React Hooks.

Importantly, custom Hooks give you the power to constrain React API if you’d like to type them more strictly in some way. React gives you the primitives, but you can combine them in different ways than what we provide out of the box.

How to test components that use Hooks?
From React’s point of view, a component using Hooks is just a regular component. If your testing solution doesn’t rely on React internals, testing components with Hooks shouldn’t be different from how you normally test components.

For example, let’s say we have this counter component:

function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
We’ll test it using React DOM. To make sure that the behavior matches what happens in the browser, we’ll wrap the code rendering and updating it into ReactTestUtils.act() calls:

import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Test first render and effect
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Test second render and effect
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
The calls to act() will also flush the effects inside of them.

If you need to test a custom Hook, you can do so by creating a component in your test, and using your Hook from it. Then you can test the component you wrote.

To reduce the boilerplate, we recommend using react-testing-library which is designed to encourage writing tests that use your components as the end users do.

What exactly do the lint rules enforce?
We provide an ESLint plugin that enforces rules of Hooks to avoid bugs. It assumes that any function starting with ”use” and a capital letter right after it is a Hook. We recognize this heuristic isn’t perfect and there may be some false positives, but without an ecosystem-wide convention there is just no way to make Hooks work well — and longer names will discourage people from either adopting Hooks or following the convention.

In particular, the rule enforces that:

Calls to Hooks are either inside a PascalCase function (assumed to be a component) or another useSomething function (assumed to be a custom Hook).
Hooks are called in the same order on every render.
There are a few more heuristics, and they might change over time as we fine-tune the rule to balance finding bugs with avoiding false positives.

From Classes to Hooks
How do lifecycle methods correspond to Hooks?
constructor: Function components don’t need a constructor. You can initialize the state in the useState call. If computing the initial state is expensive, you can pass a function to useState.

getDerivedStateFromProps: Schedule an update while rendering instead.

shouldComponentUpdate: See React.memo below.

render: This is the function component body itself.

componentDidMount, componentDidUpdate, componentWillUnmount: The useEffect Hook can express all combinations of these (including less common cases).

componentDidCatch and getDerivedStateFromError: There are no Hook equivalents for these methods yet, but they will be added soon.

How can I do data fetching with Hooks?
Here is a small demo to get you started. To learn more, check out this article about data fetching with Hooks.

Is there something like instance variables?
Yes! The useRef() Hook isn’t just for DOM refs. The “ref” object is a generic container whose current property is mutable and can hold any value, similar to an instance property on a class.

You can write to it from inside useEffect:

function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
If we just wanted to set an interval, we wouldn’t need the ref (id could be local to the effect), but it’s useful if we want to clear the interval from an event handler:

  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
Conceptually, you can think of refs as similar to instance variables in a class. Unless you’re doing lazy initialization, avoid setting refs during rendering — this can lead to surprising behavior. Instead, typically you want to modify refs in event handlers and effects.

Should I use one or many state variables?
If you’re coming from classes, you might be tempted to always call useState() once and put all state into a single object. You can do it if you’d like. Here is an example of a component that follows the mouse movement. We keep its position and size in the local state:

function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
Now let’s say we want to write some logic that changes left and top when the user moves their mouse. Note how we have to merge these fields into the previous state object manually:

  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Spreading "...state" ensures we don't "lose" width and height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Note: this implementation is a bit simplified
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
This is because when we update a state variable, we replace its value. This is different from this.setState in a class, which merges the updated fields into the object.

If you miss automatic merging, you can write a custom useLegacyState Hook that merges object state updates. However, instead we recommend to split state into multiple state variables based on which values tend to change together.

For example, we could split our component state into position and size objects, and always replace the position with no need for merging:

function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
Separating independent state variables also has another benefit. It makes it easy to later extract some related logic into a custom Hook, for example:

function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
Note how we were able to move the useState call for the position state variable and the related effect into a custom Hook without changing their code. If all state was in a single object, extracting it would be more difficult.

Both putting all state in a single useState call, and having a useState call per each field can work. Components tend to be most readable when you find a balance between these two extremes, and group related state into a few independent state variables. If the state logic becomes complex, we recommend managing it with a reducer or a custom Hook.

Can I run an effect only on updates?
This is a rare use case. If you need it, you can use a mutable ref to manually store a boolean value corresponding to whether you are on the first or a subsequent render, then check that flag in your effect. (If you find yourself doing this often, you could create a custom Hook for it.)

How to get the previous props or state?
Currently, you can do it manually with a ref:

function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
This might be a bit convoluted but you can extract it into a custom Hook:

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
Note how this would work for props, state, or any other calculated value.

function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
It’s possible that in the future React will provide a usePrevious Hook out of the box since it’s a relatively common use case.

See also the recommended pattern for derived state.

Why am I seeing stale props or state inside my function?
Any function inside a component, including event handlers and effects, “sees” the props and state from the render it was created in. For example, consider code like this:

function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
If you first click “Show alert” and then increment the counter, the alert will show the count variable at the time you clicked the “Show alert” button. This prevents bugs caused by the code assuming props and state don’t change.

If you intentionally want to read the latest state from some asynchronous callback, you could keep it in a ref, mutate it, and read from it.

Finally, another possible reason you’re seeing stale props or state is if you use the “dependency array” optimization but didn’t correctly specify all the dependencies. For example, if an effect specifies [] as the second argument but reads someProp inside, it will keep “seeing” the initial value of someProp. The solution is to either remove the dependency array, or to fix it. Here’s how you can deal with functions, and here’s other common strategies to run effects less often without incorrectly skipping dependencies.

Note

We provide an exhaustive-deps ESLint rule as a part of the eslint-plugin-react-hooks package. It warns when dependencies are specified incorrectly and suggests a fix.

How do I implement getDerivedStateFromProps?
While you probably don’t need it, in rare cases that you do (such as implementing a <Transition> component), you can update the state right during rendering. React will re-run the component with updated state immediately after exiting the first render so it wouldn’t be expensive.

Here, we store the previous value of the row prop in a state variable so that we can compare:

function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row changed since last render. Update isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
This might look strange at first, but an update during rendering is exactly what getDerivedStateFromProps has always been like conceptually.

Is there something like forceUpdate?
Both useState and useReducer Hooks bail out of updates if the next value is the same as the previous one. Mutating state in place and calling setState will not cause a re-render.

Normally, you shouldn’t mutate local state in React. However, as an escape hatch, you can use an incrementing counter to force a re-render even if the state has not changed:

  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
Try to avoid this pattern if possible.

Can I make a ref to a function component?
While you shouldn’t need this often, you may expose some imperative methods to a parent component with the useImperativeHandle Hook.

How can I measure a DOM node?
In order to measure the position or size of a DOM node, you can use a callback ref. React will call that callback whenever the ref gets attached to a different node. Here is a small demo:

function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
We didn’t choose useRef in this example because an object ref doesn’t notify us about changes to the current ref value. Using a callback ref ensures that even if a child component displays the measured node later (e.g. in response to a click), we still get notified about it in the parent component and can update the measurements.

Note that we pass [] as a dependency array to useCallback. This ensures that our ref callback doesn’t change between the re-renders, and so React won’t call it unnecessarily.

If you want, you can extract this logic into a reusable Hook:

function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>The above header is {Math.round(rect.height)}px tall</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
What does const [thing, setThing] = useState() mean?
If you’re not familiar with this syntax, check out the explanation in the State Hook documentation.

Performance Optimizations
Can I skip an effect on updates?
Yes. See conditionally firing an effect. Note that forgetting to handle updates often introduces bugs, which is why this isn’t the default behavior.

Is it safe to omit functions from the list of dependencies?
Generally speaking, no.

function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 This is not safe (it calls `doSomething` which uses `someProp`)
}
It’s difficult to remember which props or state are used by functions outside of the effect. This is why usually you’ll want to declare functions needed by an effect inside of it. Then it’s easy to see what values from the component scope that effect depends on:

function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ OK (our effect only uses `someProp`)
}
If after that we still don’t use any values from the component scope, it’s safe to specify []:

useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ OK in this example because we don't use *any* values from component scope
Depending on your use case, there are a few more options described below.

Note

We provide the exhaustive-deps ESLint rule as a part of the eslint-plugin-react-hooks package. It help you find components that don’t handle updates consistently.

Let’s see why this matters.

If you specify a list of dependencies as the last argument to useEffect, useMemo, useCallback, or useImperativeHandle, it must include all values used inside that participate in the React data flow. That includes props, state, and anything derived from them.

It is only safe to omit a function from the dependency list if nothing in it (or the functions called by it) references props, state, or values derived from them. This example has a bug:

function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product' + productId); // Uses productId prop
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 Invalid because `fetchProduct` uses `productId`
  // ...
}
The recommended fix is to move that function inside of your effect. That makes it easy to see which props or state your effect uses, and to ensure they’re all declared:

function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // By moving this function inside the effect, we can clearly see the values it uses.
    async function fetchProduct() {
      const response = await fetch('http://myapi/product' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ Valid because our effect only uses productId
  // ...
}
This also allows you to handle out-of-order responses with a local variable inside the effect:

  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }
    return () => { ignore = true };
  }, [productId]);
We moved the function inside the effect so it doesn’t need to be in its dependency list.

Tip

Check out this small demo and this article to learn more about data fetching with Hooks.

If for some reason you can’t move a function inside an effect, there are a few more options:

You can try moving that function outside of your component. In that case, the function is guaranteed to not reference any props or state, and also doesn’t need to be in the list of dependencies.
If the function you’re calling is a pure computation and is safe to call while rendering, you may call it outside of the effect instead, and make the effect depend on the returned value.
As a last resort, you can add a function to effect dependencies but wrap its definition into the useCallback Hook. This ensures it doesn’t change on every render unless its own dependencies also change:
function ProductPage({ productId }) {
  // ✅ Wrap with useCallback to avoid change on every render
  const fetchProduct = useCallback(() => {
    // ... Does something with productId ...
  }, [productId]); // ✅ All useCallback dependencies are specified

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct })
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ All useEffect dependencies are specified
  // ...
}
Note that in the above example we need to keep the function in the dependencies list. This ensures that a change in the productId prop of ProductPage automatically triggers a refetch in the ProductDetails component.

What can I do if my effect dependencies change too often?
Sometimes, your effect may be using state that changes too often. You might be tempted to omit that state from a list of dependencies, but that usually leads to bugs:

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // This effect depends on the `count` state
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Bug: `count` is not specified as a dependency

  return <h1>{count}</h1>;
}
Specifying [count] as a list of dependencies would fix the bug, but would cause the interval to be reset on every change. That may not be desirable. To fix this, we can use the functional update form of setState. It lets us specify how the state needs to change without referencing the current state:

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ This doesn't depend on `count` variable outside
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ Our effect doesn't use any variables in the component scope

  return <h1>{count}</h1>;
}
(The identity of the setCount function is guaranteed to be stable so it’s safe to omit.)

In more complex cases (such as if one state depends on another state), try moving the state update logic outside the effect with the useReducer Hook. This article offers an example of how you can do this. The identity of the dispatch function from useReducer is always stable — even if the reducer function is declared inside the component and reads its props.

As a last resort, if you want something like this in a class, you can use a ref to hold a mutable variable. Then you can write and read to it. For example:

function Example(props) {
  // Keep latest props in a ref.
  let latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    function tick() {
      // Read latest props at any time
      console.log(latestProps.current);
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // This effect never re-runs
}
Only do this if you couldn’t find a better alternative, as relying on mutation makes components less predictable. If there’s a specific pattern that doesn’t translate well, file an issue with a runnable example code and we can try to help.

How do I implement shouldComponentUpdate?
You can wrap a function component with React.memo to shallowly compare its props:

const Button = React.memo((props) => {
  // your component
});
It’s not a Hook because it doesn’t compose like Hooks do. React.memo is equivalent to PureComponent, but it only compares props. (You can also add a second argument to specify a custom comparison function that takes the old and new props. If it returns true, the update is skipped.)

React.memo doesn’t compare state because there is no single state object to compare. But you can make children pure too, or even optimize individual children with useMemo.

How to memoize calculations?
The useMemo Hook lets you cache calculations between multiple renders by “remembering” the previous computation:

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
This code calls computeExpensiveValue(a, b). But if the dependencies [a, b] haven’t changed since the last value, useMemo skips calling it a second time and simply reuses the last value it returned.

Remember that the function passed to useMemo runs during rendering. Don’t do anything there that you wouldn’t normally do while rendering. For example, side effects belong in useEffect, not useMemo.

You may rely on useMemo as a performance optimization, not as a semantic guarantee. In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without useMemo — and then add it to optimize performance. (For rare cases when a value must never be recomputed, you can lazily initialize a ref.)

Conveniently, useMemo also lets you skip an expensive re-render of a child:

function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
Note that this approach won’t work in a loop because Hook calls can’t be placed inside loops. But you can extract a separate component for the list item, and call useMemo there.

How to create expensive objects lazily?
useMemo lets you memoize an expensive calculation if the dependencies are the same. However, it only serves as a hint, and doesn’t guarantee the computation won’t re-run. But sometimes you need to be sure an object is only created once.

The first common use case is when creating the initial state is expensive:

function Table(props) {
  // ⚠️ createRows() is called on every render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
To avoid re-creating the ignored initial state, we can pass a function to useState:

function Table(props) {
  // ✅ createRows() is only called once
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
React will only call this function during the first render. See the useState API reference.

You might also occasionally want to avoid re-creating the useRef() initial value. For example, maybe you want to ensure some imperative class instance only gets created once:

function Image(props) {
  // ⚠️ IntersectionObserver is created on every render
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
useRef does not accept a special function overload like useState. Instead, you can write your own function that creates and sets it lazily:

function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver is created lazily once
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // When you need it, call getObserver()
  // ...
}
This avoids creating an expensive object until it’s truly needed for the first time. If you use Flow or TypeScript, you can also give getObserver() a non-nullable type for convenience.

Are Hooks slow because of creating functions in render?
No. In modern browsers, the raw performance of closures compared to classes doesn’t differ significantly except in extreme scenarios.

In addition, consider that the design of Hooks is more efficient in a couple ways:

Hooks avoid a lot of the overhead that classes require, like the cost of creating class instances and binding event handlers in the constructor.

Idiomatic code using Hooks doesn’t need the deep component tree nesting that is prevalent in codebases that use higher-order components, render props, and context. With smaller component trees, React has less work to do.

Traditionally, performance concerns around inline functions in React have been related to how passing new callbacks on each render breaks shouldComponentUpdate optimizations in child components. Hooks approach this problem from three sides.

The useCallback Hook lets you keep the same callback reference between re-renders so that shouldComponentUpdate continues to work:

// Will not change unless `a` or `b` changes
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
The useMemo Hook makes it easier to control when individual children update, reducing the need for pure components.

Finally, the useReducer Hook reduces the need to pass callbacks deeply, as explained below.

How to avoid passing callbacks down?
We’ve found that most people don’t enjoy manually passing callbacks through every level of a component tree. Even though it is more explicit, it can feel like a lot of “plumbing”.

In large component trees, an alternative we recommend is to pass down a dispatch function from useReducer via context:

const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Note: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
Any child in the tree inside TodosApp can use the dispatch function to pass actions up to TodosApp:

function DeepChild(props) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
This is both more convenient from the maintenance perspective (no need to keep forwarding callbacks), and avoids the callback problem altogether. Passing dispatch down like this is the recommended pattern for deep updates.

Note that you can still choose whether to pass the application state down as props (more explicit) or as context (more convenient for very deep updates). If you use context to pass down the state too, use two different context types — the dispatch context never changes, so components that read it don’t need to rerender unless they also need the application state.

How to read an often-changing value from useCallback?
Note

We recommend to pass dispatch down in context rather than individual callbacks in props. The approach below is only mentioned here for completeness and as an escape hatch.

Also note that this pattern might cause problems in the concurrent mode. We plan to provide more ergonomic alternatives in the future, but the safest solution right now is to always invalidate the callback if some value it depends on changes.

In some rare cases you might need to memoize a callback with useCallback but the memoization doesn’t work very well because the inner function has to be re-created too often. If the function you’re memoizing is an event handler and isn’t used during rendering, you can use ref as an instance variable, and save the last committed value into it manually:

function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // Write it to the ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Read it from the ref
    alert(currentText);
  }, [textRef]); // Don't recreate handleSubmit like [text] would do

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
This is a rather convoluted pattern but it shows that you can do this escape hatch optimization if you need it. It’s more bearable if you extract it to a custom Hook:

function Form() {
  const [text, updateText] = useState('');
  // Will be memoized even if `text` changes:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
In either case, we don’t recommend this pattern and only show it here for completeness. Instead, it is preferable to avoid passing callbacks deep down.

Under the Hood
How does React associate Hook calls with components?
React keeps track of the currently rendering component. Thanks to the Rules of Hooks, we know that Hooks are only called from React components (or custom Hooks — which are also only called from React components).

There is an internal list of “memory cells” associated with each component. They’re just JavaScript objects where we can put some data. When you call a Hook like useState(), it reads the current cell (or initializes it during the first render), and then moves the pointer to the next one. This is how multiple useState() calls each get independent local state.

What is the prior art for Hooks?
Hooks synthesize ideas from several different sources:

Our old experiments with functional APIs in the react-future repository.
React community’s experiments with render prop APIs, including Ryan Florence’s Reactions Component.
Dominic Gannaway’s adopt keyword proposal as a sugar syntax for render props.
State variables and state cells in DisplayScript.
Reducer components in ReasonReact.
Subscriptions in Rx.
Algebraic effects in Multicore OCaml.
Sebastian Markbåge came up with the original design for Hooks, later refined by Andrew Clark, Sophie Alpert, Dominic Gannaway, and other members of the React team.