# 初识react

### state

使用useState钩子向组件添加状态变量，变化时会触发重新渲染，类似vue的ref（vue的ref与react的ref不同）

```jsx
const [state, setState] = useState(initialState);
```

使用set函数来进行变量值的改变：

```jsx
const [text, setText] = useState('');
//...
function handleChange(e) {
    setText(e.target.value);
}
//...
```



### context上下文

类似vue的Provide/inject（注入），无需props传参，向组件树深层传递数据。

其中，`createContext()`函数创建一个创建一个上下文的容器 ，可以理解为创建了一个组件。可以传递默认值（defaultValue）

```jsx
import { createContext, useContext } from "react";

const DemoContext = createContext(null);

function Demo() {
  return (
    <>
      <Button />
    </>
  );
}

function Button() {
  const demoContextValue = useContext(DemoContext);
  return (
    <>
      <button>{demoContextValue}</button>
    </>
  );
}

export default function MyApp() {
  return (
    <DemoContext.Provider value={"上下文传值"}>
      <Demo />
    </DemoContext.Provider>
  );
}
```



### ref 引用值

当你希望组件“记住”某些信息，但又不想让这些信息触发新的渲染时，可以使用 `ref` 。

与vue不同，**改变 ref 不会触发重新渲染**（也不像是 state 变量会触发重新渲染）。

我们可以用来在重新渲染之间 **存储信息**（不像是普通对象，每次渲染都会重置）。

```jsx
import { useState } from "react";

export default function Counter() {
  const [value, setValue] = useState("");
  let count = 0;

  function handleClick() {
    count += 1;
    alert("You clicked " + count + " times!");
  }

  return (
    <>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <button onClick={handleClick}>Click me!</button>
    </>
  );
}
```

在上面例子中，没有使用useRef钩子前。每次在表单中输入值会触发重新渲染（因为是state变量），count的值无法被保存。

而使用useRef将可以**在每次重新渲染之间储存信息：**

```jsx
import { useRef, useState } from "react";

export default function Counter() {
  const [value, setValue] = useState("");
  let count = useRef(0);

  function handleClick() {
    count.current += 1;
    alert("You clicked " + count.current + " times!");
  }

  return (
    <>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <button onClick={handleClick}>Click me!</button>
    </>
  );
}
```

此外，ref可以用来存储一个intervalID，比如：

```jsx
//...
<button onClick={() => {
  clearTimeout(timeoutID.current);
  timeoutID.current = setTimeout(() => {
    onClick();
  }, 1000);
}}>
  {children}
</button>
//...
```



state运作起来就像快照，因此无法从 timeout 等异步操作中读取最新的 state。但是，我们可以在 ref 中保存最新的输入文本。

```jsx
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const refText = useRef(text)

  function handleSend() {
    setTimeout(() => {
      alert('正在发送：' + refText.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => {
          setText(e.target.value)
          refText.current = text
        }}
      />
      <button
        onClick={handleSend}>
        发送
      </button>
    </>
  );
}
```



### effect

类似vue的watch，useEffect用于执行**副作用函数**，参数1为回调函数，参数2为一个数组，为依赖项。当依赖项更改，执行参数1的回调函数。其中：

- vue 的 watch 属性只能订阅一个数据源，而 react useEffect 的 hook，可以指定多个依赖；

- useEffect 会在首次渲染的时候执行一次，watch 也支持，不过需要指定 immediate 的 config；如果 useEffect 想在首次渲染时不执行，可以利用 useRef 在组件的整个周期的不变性进行条件控制；



可以用来保持连接，下面例子中，切换房间和url地址都会重新连接：

```jsx
import { useState, useEffect } from "react";

function createConnection(serverUrl, roomId) {
  // 真正的实现会实际连接到服务器
  return {
    connect() {
      console.log(
        '✅ Connecting to "' + roomId + '" room at ' + serverUrl + "..."
      );
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState("https://localhost:1234");

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState("general");
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{" "}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? "Close chat" : "Open chat"}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

有些时候useEffect是不必要的：

```jsx
// 🔴 避免：多余的 state 和不必要的 Effect
const [fullName, setFullName] = useState('');
useEffect(() => {
setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);
// ...
```

**如果一个值可以基于现有的 props 或 state 计算得出，不要把它作为一个 state，而是在渲染期间直接计算这个值：**

```jsx
import { useState } from "react";

export default function Demo() {
  const [firstName, setFirstName] = useState("Taylor");
  const [lastName, setLastName] = useState("Swift");
  const fullName = firstName + " " + lastName;

  return (
    <>
      <label>
        firstName：
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <label>
        lastName：
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </label>
      <h1>{fullName}</h1>
    </>
  );
}
```



### 受控与非受控组件

**可控数据**是指组件的**数据**被使用者所控制。**不可控数据**是指组件的**数据**不由使用者来控制而是由组件内部控制。