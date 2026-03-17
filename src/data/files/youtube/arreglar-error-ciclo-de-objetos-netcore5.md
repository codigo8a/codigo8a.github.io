Fecha: 14/01/2022
---
tags: Error CSharp Framework Trucos NetCore
---

# Cómo arreglar error ciclos objetos para NetCore 5

Paso a paso para arreglar el error "System.Text.Json.JsonException: A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles." para .NetCore 5

En [mi canal de youtube](https://youtu.be/EbKw0Dcaf6o) hay un video del paso a paso:

```csharp
services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);
```
