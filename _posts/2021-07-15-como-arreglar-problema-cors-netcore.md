---
layout: post
title:  "Solucionar problema CORS en .Net Core 5"
description: Cómo Solucionar problema CORS en .Net Core 5
comments: true
category: Código 
tags: Error Framework CSharp NetCore Trucos
youtube: https://youtu.be/CDEaBtEeVwM
---
<span class="post-date-header">Julio 15 de 2021</span>
Un par de lineas para solucionar el problema de CORS en API .Net Core 5

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

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
