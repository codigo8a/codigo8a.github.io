---
layout: post
title:  "Cómo desplegar una app React + Vite a Github Pages"
description: "Cómo desplegar una app React + Vite en Github Pages"
comments: true
category: Paso a paso
tags: Tutoriales React Framework
youtube: https://youtu.be/ScwqUMKhNm4
---
Código paso a paso para hacer un deploy de una aplicación React + Vite en Github Pages.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

1. Creamos un proyecto React + Vite 
```react
npm create vite@latest
```

2. Creamos un repositorio en Github
3. Iniciamos y configuramos el git en el nuevo proyecto
4. Agregamos al package.json
```react
homepage: "https://juandavid.site/reactapp" 
"predeploy":"npm run build"
"deploy":"gh-pages -d dist"
```

5. Agregamos al vite.config.ts
```react
base: "https://juandavid.site/reactapp"
```
