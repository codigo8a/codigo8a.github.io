Fecha: 28/09/2019
---
tags: Trucos Windows
---

# Quitar | Desactivar alerta de HP Client Security

Paso a paso para lograr Quitar | Desactivar alerta de HP Client Security:
Al instalar todos los drivers en un portatil HP necesarios para activar la huella digital y poder iniciar sesión sin necesidad de escribir una contraseña ... empieza a salir un molesto mensaje de alerta que hasta el día en que escribo este post, no existe manera de quitarlo por configuración. 

La única opción que encontré para desactivar esta molesta alerta fue forzarlo por medio de un archivo de configuración que modifique el registro de Windows.

La solución es muy rápida, pues cuenta solo con dos pasos.

En [mi canal de youtube](https://youtu.be/fp5xfIOVwR8) hay un video del paso a paso:

```
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\DigitalPersona\Applications\OTAppSettings]
"ShowTrainingPrompt"=dword:00000000

[HKEY_CURRENT_USER\Software\DigitalPersona\Applications\OTAppSettings\BrowserIntegration]
"Firefox_notice"="-1"
"Chrome_notice"="-1"
```
1. Se crea un archivo de texto con las lineas anteriores
2. Se abre el registro de windows
3. Se importa el archivo
