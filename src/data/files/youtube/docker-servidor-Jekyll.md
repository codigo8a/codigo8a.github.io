Fecha: 14/02/2026
---
tags: Tutoriales Linux
---

# Cómo ejecutar un proyecto Jekyll localmente


Paso a paso para correr un proyecto Jeckyll localmente y poder editarlo.

En [mi canal de youtube](https://youtu.be/WRT0RgIEXus) hay un video del paso a paso:

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
