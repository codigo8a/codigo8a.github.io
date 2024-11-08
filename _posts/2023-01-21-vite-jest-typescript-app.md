---
layout: post
title:  "Cómo crear y configurar prueba unitaria Jest en React con Vite y Typescript"
description: Cómo configurar jest en React con vite y typescript
comments: true
category: Paso a paso
tags: Tutoriales Framework React
youtube: https://youtu.be/62yuvCMZHco
---
Paso a paso para crear una prueba unitaria basica con Jest en React con Vite y Typescript.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

```react
yarn add --dev jest babel-jest @babel/preset-env @babel/preset-react 
yarn add --dev @testing-library/react @testing-library/dom @testing-library/user-event @types/jest jest-environment-jsdom
yarn add --dev jest-svg-transformer
pnpm i --save-dev @babel/core @babel/preset-typescript
pnpm i --save-dev identity-obj-proxy
```
package.json
```react
"test": "jest --watchAll=false --coverage --CI=true"
```

babel.config.js 
```react
module.exports = {
    presets: [
        [ '@babel/preset-env', { targets: { esmodules: true } } ],
        [ '@babel/preset-react', { runtime: 'automatic' } ],
        '@babel/preset-typescript',
    ],
};
```

jest.config.js
```react
module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: ['./jest.setup.js'],
    moduleNameMapper: {
        "^.+\\.svg$": "jest-svg-transformer",
	"\\.(css|less|scss)$": "identity-obj-proxy",
  }
}
```
jest.setup.js

App.test.tsx
```react
import { render, screen } from '@testing-library/react';
import App from '../App';

test('Renders main page correctly', async () => {
  render(<App />);
  const buttonCount = await screen.findByRole('button');
  expect(buttonCount.innerHTML).toBe('count is 0');
  expect(true).toBeTruthy();
});
```
