Fecha: 15/07/2021
---
tags: Error Framework CSharp NetCore Trucos
---

# Solucionar problema CORS en .Net Core 5

Un par de lineas para solucionar el problema de CORS en API .Net Core 5

En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:

- Poner en el archivo startup en la seccion de servicios
```csharp
services.AddCors(options =>
{
    options.AddDefaultPolicy(builder => { 
        builder
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod(); 
    });
});
```

- Poner en el archivo startup en la seccion de aplicaciones
```csharp
app.UseCors();
```
