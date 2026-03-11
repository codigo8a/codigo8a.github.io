---
layout: post
title:  "Cómo ejecutar un proyecto Jekyll localmente"
description: Cómo ejecutar un proyecto Jekyll localmente
comments: true
category: Youtube
tags: Tutoriales Linux
youtube: https://youtu.be/WRT0RgIEXus
---
<span class="post-date-header">Febrero 14 de 2026</span>

Paso a paso para correr un proyecto Jeckyll localmente y poder editarlo.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

1. Crear archivo docker-compose.yaml
```csharp
services:
  jekyll:
    image: jekyll/jekyll
    command: jekyll serve --watch --host 0.0.0.0
    ports:
"4000:4000"
    volumes:
.:/srv/jekyll
```
