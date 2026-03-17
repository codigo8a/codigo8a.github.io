Fecha: 15/02/2026
---
tags: Tutoriales Linux IA
---

# Cómo instalar ollama en linux


Paso a paso para instalar Ollama en Linux y poder ejectar nuestros propios modelos localmente.

En [mi canal de youtube](https://youtu.be/HJKoVXKV3Oc) hay un video del paso a paso:

1. Conectar a la consola (Putty o Cockpit).
2. Instalar Ollama (ollama.com).
3. Validar instalación.
```csharp
ollama --version
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
6. Escuchar toda la red
```csharp
sudo systemctl edit ollama
```
```csharp
[Service]
Environment="OLLAMA_HOST=0.0.0.0"
```
```csharp
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

