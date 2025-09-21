# Typewriter

![npm version](https://img.shields.io/npm/v/Typewriter.svg)  
![npm downloads](https://img.shields.io/npm/dm/Typewriter.svg)  
![license](https://img.shields.io/npm/l/Typewriter.svg?cacheBust=1)  

A simple **frontend library** to create typewriter effects on web pages.  
**Note:** This library runs in the browser and is not intended for server-side Node.js execution.

---

## Installation

```bash
npm install Typewriter
```

---

## Usage

### CommonJS (for bundlers like Webpack)

```js
const Typewriter = require('Typewriter');

// Example usage
const { runTypewriters } = Typewriter;

// Dynamically create HTML
document.querySelector('.container').innerHTML = `
  <div class="typewriter" data-speed="20">Hello and welcome!</div>
  <div class="typewriter" data-speed="15">Line two appears next.</div>
`;

// Run the typewriter effect
runTypewriters("sequential");  // "sequential" = one line after another, "simultaneous" = all lines at once
```

### ES Modules

```js
import { runTypewriters } from 'Typewriter';

document.querySelector('.container').innerHTML = `
  <div class="typewriter" data-speed="20">Hello and welcome!</div>
  <div class="typewriter" data-speed="15">Line two appears next.</div>
`;

// Run the typewriter effect
runTypewriters("simultaneous");  // All lines start typing at once
```

---

## Parameters

* **mode**: `"sequential"` or `"simultaneous"`

  * `"sequential"` → types one line at a time  
  * `"simultaneous"` → types all lines at the same time  

* **data-speed**: Typing speed in characters per second (higher = faster). Default = 10 cps.  

  Example: `<div class="typewriter" data-speed="20">Text here</div>`

---

## Browser Usage Notes

- Include the script in a browser environment.  
- Works on any modern browser that supports ES Modules.  
- Does not require a backend; all typing happens on the client side.

---

## License

MI
