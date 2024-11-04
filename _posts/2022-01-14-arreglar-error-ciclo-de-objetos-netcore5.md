---
layout: post
title:  "Cómo arreglar error ciclos objetos para NetCore 5"
description: Cómo arreglar el error A possible object cycle was detected en .Net Core 5
comments: true
category: tutoriales
tags: error csharp framework trucos
youtube: https://youtu.be/EbKw0Dcaf6o
---
Paso a paso para arreglar el error "System.Text.Json.JsonException: A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles." para .NetCore 5

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

```csharp
services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);
```
