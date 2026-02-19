---
layout: post
title:  "Cómo desplegar una app React + Vite a Github Pages"
description: "Cómo desplegar una app React + Vite en Github Pages"
comments: true
category: Youtube
tags: Tutoriales React Framework GitHub
youtube: https://youtu.be/QZ7y90shOPY
---
Código paso a paso para hacer un deploy de una aplicación React + Vite en Github Pages.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:
--- 
1 Creamos un proyecto React + Vite 
```react
npm create vite@latest
```

2 Creamos un repositorio en Github

3 Iniciamos y configuramos el git en el nuevo proyecto

4 Agregamos al package.json
```react
"homepage": "https://juandavid.site/reactapp" 
"predeploy":"npm run build",
"deploy":"gh-pages -d dist",
```

5 Agregamos al vite.config.ts
```react
base: "https://juandavid.site/reactapp"
```

6 Instalamos libreria gh-pages
```react
pnpm add gh-pages -D
```

7 Ejecutamos
```react
npm run deploy
```
