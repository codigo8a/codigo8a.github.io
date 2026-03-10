---
layout: post
title:  "Cómo obtener un ollama local con GPU gratis"
description: Cómo obtener un ollama local con GPU gratis
comments: true
category: Youtube
tags: Tutoriales Python
youtube: https://youtu.be/WRT0RgIEXus
googlecolab: https://colab.research.google.com/gist/codigo8a/40938587307acba8f0d1c12557334c33/setup_and_query_a_ollama_server.ipynb
---
<span class="post-date-header">Marzo 10 de 2026</span>

Paso a paso para correr un ollama local gratuitamente y con acceso a GPU.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

1. Obtener un APIKEY de Ngrok.
2. Ejecuta <a target="_blank" href="{{ page.googlecolab }}">setup_and_query_a_ollama_server.ipynb</a> en Google Colab
3. Configura ollama en Claude Code:
```csharp
$env:ANTHROPIC_AUTH_TOKEN="ollama"
$env:ANTHROPIC_BASE_URL="https://unbequeathed-electrophonically-billy.ngrok-free.dev"
$env:ANTHROPIC_API_KEY=""
claude --model qwen3-coder
```
