Fecha: 08/04/2021
---
tags: Error Trucos Next Framework GitHub
---

# Cómo hacer Deploy de una app next.js en Heroku

Un par de lineas necesarias para poder hacer deploy correctamente de una aplicación next.js desde Github a Heroku.

En [mi canal de youtube](https://youtu.be/5Kk3DcBNROE) hay un video del paso a paso:

```react
"start": "next start -p $PORT",
"heroku-postbuild": "npm run build"
```
