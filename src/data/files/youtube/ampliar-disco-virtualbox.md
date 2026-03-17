Fecha: 20/03/2019
---
tags: Error VirtualBox Linux Windows
---

# Resize Disk - VirtualBox - Linux - Windows

<p>Dos sencillos pasos para ampliar el disco de virtualbox desde Linux para Windows.</p>
<p>En [mi canal de youtube](https://bit.ly/2wSo5iD) hay un video del paso a paso: </p>

```csharp
vboxmanage modifyhd "/home/ochoa/VirtualBox VMs/win10/win10.vdi" --resize 102400
```
y en windows:

1. Click derecho sobre el boton de inicio
2. Administración de discos
3. Click derecho extender volumen
