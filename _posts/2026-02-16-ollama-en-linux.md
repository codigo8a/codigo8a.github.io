---
layout: post
title:  "Cómo instalar ollama en linux"
description: Cómo instalar ollama en linux
comments: true
category: Youtube
tags: Tutoriales Linux IA
youtube: https://youtu.be/rSuEqJ1YvwQ
---
<span class="post-date-header">Febrero 16 de 2026</span>

Paso a paso para instalar Ollama en Linux y poder ejectar nuestros propios modelos localmente.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

1. Conectar a la consola (Putty o Cockpit).
2. Instalar Ollama (ollama.com).
3. Validar instalación.
```csharp
ollama -v
```
4. Cargar módelo (ollama.com/search).
```csharp
ollama pull <modeloName>
```
5. Comandos más usados:
```csharp
ollama list
ollama rm
systemctl status ollama
```