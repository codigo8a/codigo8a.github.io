Fecha: 31/10/2024
---
tags: Tutoriales React Framework
---

# Cómo manejar errores en React


Código paso a paso para agregar un archivo que nos maneje los errores en un Micro-FrontEnd.

En [mi canal de youtube](https://youtu.be/nm8AcpPduV0) hay un video del paso a paso:
 
1 Crear ErrorBoundary.tsx
```react
import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.log("Derived Error", error)
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log('Error: ', error)
    console.log('Error Info: ', errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Oops! RemoteAPP falló</h1>
    }

    return this.props.children
  }
}

export default ErrorBoundary;
```

2 Envolver app
```react
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

3 Error de ejemplo
```react
  useEffect(() => {
      throw new Error('Este es un error generado intencionalmente');
  }, []);
```
