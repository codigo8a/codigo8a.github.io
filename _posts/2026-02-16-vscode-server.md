---
layout: post
title:  "Cómo instalar VS Code en Linux"
description: Cómo instalar VS Code en Linux
comments: true
category: Youtube
tags: Tutoriales Linux
youtube: https://youtu.be/rSuEqJ1YvwQ
---
<span class="post-date-header">Febrero 16 de 2026</span>

Paso a paso para instalar VS Code en Linux server y poder acceder a el desde cualquier parte por medio de una url.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

1. Descargar y ejecutar
```csharp
curl -fsSL https://code-server.dev/install.sh | sh
```
2. Revisar version.
```csharp
code-server --version
```
3. Ejecutar desde cualquier ip:
```csharp
nano .config/code-server/config.yaml
bind-addr: 0.0.0.0:8080
```
4. Saber contraseña
```csharp
cat ~/.config/code-server/config.yaml
```
5. Ejecutar ip con puerto
```csharp
http://IP_DEL_SERVIDOR:8080
```

