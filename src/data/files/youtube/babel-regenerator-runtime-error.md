Fecha: 20/05/2021
---
tags: Error Trucos Node Framework
---

# Cómo solucionar regenerator runtime error nodejs

Un par de lineas necesarias para solucionar el error de node.js (ReferenceError: regeneratorRuntime is not defined) que se presenta cuando se usa Babel.

En [mi canal de youtube](https://youtu.be/5Kk3DcBNROE) hay un video del paso a paso:

```
npm install -D  @babel/plugin-transform-runtime
npm install @babel/runtime
```
Agregar al archivo .babelrc
```react
"plugins": [
    ["@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ],
```
