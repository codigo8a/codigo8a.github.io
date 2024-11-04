---
layout: post
title:  "Cómo instalar tienda de windows Microsoft Store"
description: "Cómo instalar o re-instalar Microsoft Store"
comments: true
category: tutoriales
tags: trucos windows herramientas
youtube: https://youtu.be/ScwqUMKhNm4
---
Código paso a paso para instalar la tienda de windows "Microsoft Store".

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:
 
1. Abrir Power Shell.

2. Ejecutar codigo
```csharp
Get-AppxPackage -allusers Microsoft.WindowsStore | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\AppXManifest.xml"}
``` 
