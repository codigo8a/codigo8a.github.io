---
layout: post
title:  "Cómo hacer deploy de react.js en AWS"
description: "Cómo hacer deploy de react.js en AWS"
comments: true
category: Paso a paso
tags: Tutoriales AWS Framework React
youtube: https://youtu.be/YmArl7GQqCc
---
Código paso a paso para desplegar un proyecto React.JS en AWS Elastic Beanstalk.

En <a target="_blank" href="{{ page.youtube }}">mi canal de youtube</a> hay un video del paso a paso:

1. Crear S3
- Block all public access
- Properties / Static website hosting / index.html
- Bucket policy / S3 / GetObject
- "Principal": "*"
 
2. Crear proyecto Reat.JS
- npx create-react-app reactapp
- npm run build
    
4. Hacer deploy
- login en aws
- https://aws.amazon.com/es/cli/
- aws --version
- aws configure
```csharp
Default region name [None]: us-west-2
Default output format [None]: json
```   
- aws s3 sync build/ s3://reactapp-bucket
