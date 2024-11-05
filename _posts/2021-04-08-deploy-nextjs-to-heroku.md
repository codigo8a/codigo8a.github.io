---
layout: post
title:  "Cómo hacer Deploy de una app next.js en Heroku"
description: Cómo hacer deploy de una app next.js en Heroku
comments: true
category: Paso a paso
tags: Error Trucos Next Framework GitHub
youtube: https://youtu.be/5Kk3DcBNROE
---
Un par de lineas necesarias para poder hacer deploy correctamente de una aplicación next.js desde Github a Heroku.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

```react
"start": "next start -p $PORT",
"heroku-postbuild": "npm run build"
```
