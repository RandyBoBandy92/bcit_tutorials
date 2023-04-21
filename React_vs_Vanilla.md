
Using Hooks, methods commonly seen in react
- useState and useEffect
javascript vs react 
- setting up an onClick the old way vs React
- help bridge vanilla JS knowledge into React 
- using debugger with react 


On click event listener
```js
const button = document.getElementById("myButton");
button.addEventListener("click", () => {
  console.log("Button clicked!");
});

```

```js
function App() {
  const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}

```
Updating the DOM
```js
const title = document.getElementById("title");
title.textContent = "Hello, World!";

```

conditional rendering
```js
const button = document.getElementById("myButton");
const secretText = document.getElementById("secretText");

button.addEventListener("click", () => {
  secretText.style.display = "block";
});

```

```js
import { useState } from "react";

function App() {
  const [showSecretText, setShowSecretText] = useState(false);

  return (
    <>
      <button onClick={() => setShowSecretText(true)}>
        Show secret text
      </button>
      {showSecretText && <p id="secretText">This is a secret text.</p>}
    </>
  );
}

```

form input handling
```js
const input = document.getElementById("myInput");
input.addEventListener("input", (event) => {
  console.log(event.target.value);
});

```

```js
import { useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");

  const handleInput = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <input type="text" value={inputValue} onChange={handleInput} />
  );
}

```

Creating elements
```js
const list = document.getElementById("myList");
const newItem = document.createElement("li");
newItem.textContent = "New item";
list.appendChild(newItem);

```

```js
function App() {
  const items = ["New item"];

  return (
    <ul>
      {items.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
}

```

Removing Elements
```js
const button = document.getElementById("myButton");
const itemToRemove = document.getElementById("itemToRemove");

button.addEventListener("click", () => {
  itemToRemove.remove();
});

```

```js
import { useState } from "react";

function App() {
  const [showItem, setShowItem] = useState(true);

  return (
    <>
      <button onClick={() => setShowItem(false)}>
        Remove item
      </button>
      {showItem && <div id="itemToRemove">Item to remove</div>}
    </>
  );
}

```

adding and removing classes

```js
const button = document.getElementById("myButton");
const box = document.getElementById("myBox");

button.addEventListener("click", () => {
  box.classList.toggle("highlight");
});

```

```js
import { useState } from "react";
import "./App.css";

function App() {
  const [highlight, setHighlight] = useState(false);

  return (
    <>
      <button onClick={() => setHighlight(!highlight)}>
        Toggle highlight
      </button>
      <div id="myBox" className={highlight ? "highlight" : ""}>
        Highlight me
      </div>
    </>
  );
}

```


timers and intervals

```js
let counter = 0;

const interval = setInterval(() => {
  console.log(counter);
  counter++;

  if (counter > 9) {
    clearInterval(interval);
  }
}, 1000);

```

```js
import { useEffect, useState } from "react";

function App() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h1>{counter}</h1>
    </div>
  );
}

```