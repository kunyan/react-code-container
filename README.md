# react-code-container

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-code-container.svg)](https://www.npmjs.com/package/react-code-container) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![image](.github/screenshot.png)

## Install

```bash
npm install --save react-code-container
```

## Usage

```tsx
import React, { useState } from 'react';
import 'react-code-container/dist/styles/base.css';
import 'react-virtualized/styles.css';
import 'highlight.js/styles/atom-one-dark.css'; // Find any highlight style you need
import ReactCodeContainer from 'react-code-container';

export default () => {
  const [language, setLanguage] = useState('jsx');
  const [showLineNumber, setShowLineNumber] = useState(true);

  const code = `export function hello() => {
    console.log("Hello world")
  }`;
  return (
    <ReactCodeContainer
      code={code}
      showLineNumber={showLineNumber} // optional
      language={language} // optional
      onLineNumberClick={handleLineNumberClicked} // optional
    />
  );
};
```

## Configuration

| Option              | Required | Default | Description                                     |
| ------------------- | -------- | ------- | ----------------------------------------------- |
| `code`              | required |         | Your code which want to display                 |
| `showLineNumber`    | optional | `true`  | You can turn on / off line number               |
| `language`          | optional |         | Leave empty will use auto detect                |
| `onLineNumberClick` | optional |         | The callback function if you clicked lineNumber |

## License

MIT © [Kun Yan](https://github.com/kunyan)
