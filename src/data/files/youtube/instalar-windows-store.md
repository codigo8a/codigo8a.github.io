Fecha: 05/02/2024
---
tags: Trucos Windows
---

# Cómo instalar tienda de windows Microsoft Store


Código paso a paso para instalar la tienda de windows "Microsoft Store".

En [mi canal de youtube](https://youtu.be/-wq8jncHdPI) hay un video del paso a paso:
 
1. Abrir Power Shell.

2. Ejecutar codigo
```csharp
Get-AppxPackage -allusers Microsoft.WindowsStore | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\AppXManifest.xml"}
```
