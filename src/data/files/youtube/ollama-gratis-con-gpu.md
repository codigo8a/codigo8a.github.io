Fecha: 10/03/2026
---
tags: Tutoriales Python
---

# Cómo obtener un ollama local con GPU gratis


Paso a paso para correr un ollama local gratuitamente y con acceso a GPU.

En [mi canal de youtube](https://youtu.be/WRT0RgIEXus) hay un video del paso a paso:

1. Obtener un APIKEY de Ngrok.
2. Ejecuta <a target="_blank" href="{{ page.googlecolab }}">setup_and_query_a_ollama_server.ipynb</a> en Google Colab
3. Configura ollama en Claude Code:
```csharp
$env:ANTHROPIC_AUTH_TOKEN="ollama"
$env:ANTHROPIC_BASE_URL="tu-url-de-ngrok"
$env:ANTHROPIC_API_KEY=""
claude --model qwen3-coder
```
