Fecha: 11/11/2023
---
tags: Tutoriales AWS Framework CSharp NetCore
---

# Cómo hacer deploy App Net Core en AWS


Código paso a paso para desplegar un proyecto API Net Core en AWS Elastic Beanstalk.

En [mi canal de youtube](https://youtu.be/9yIJg7i-Xxo) hay un video del paso a paso:

1. Crear Aplicación Elastic Beanstalk
- Application Name / Enviroment / Domain / Platform Linux
- Create Service Role
- Create EC2 Intance Profile / IAM
- Create Role / AWS Service / UseCase = EC2
- Add Policies = WebTier / WorkerTier / MulticontainerDocker
- VPC / Public IP Address = Activated / Instance Subnets 
- EC2 Security Gropus = default
 
2. Configurar Visual Studio
- Crear Usuario / Crear Grupo / Crear Role = administrator
- Descargar e Instalar = AWS Toolkit for Visual Studio
- Crear perfil / Access Key / Secret Key
