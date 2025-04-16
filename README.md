# Interbanking Challenge · Backend

Este repositorio contiene la solución al challenge técnico para el puesto de **Desarrollador Backend** en **Interbanking**.

---

## 🧠 Stack Tecnológico

- **Node.js** con **NestJS** (`v10+`) en **TypeScript**
- **Arquitectura Hexagonal** y modularizada
- **PostgreSQL** con **TypeORM**
- **Swagger** para documentación
- **Docker Compose** para entorno local (opcional)
- **Validación y DTOs** con `class-validator`
- **Rate limiting** con `@nestjs/throttler`
- **Logs de auditoría**
- **Manejo estructurado de errores**
- **Testing completo:** Unitarios + E2E (Jest)

---

## 📁 Estructura del Proyecto

```
src/
├── app.module.ts            ← Módulo raíz
├── main.ts                  ← Bootstrap de NestJS
├── core/                    ← Middlewares, guards, throttling, valores comunes
├── modules/
│   ├── empresa/             ← Dominio + Casos de Uso + Infra + Presentación
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── presentation/
│   └── database/            ← Configuración DB y TypeORM
├── shared/                  ← Utils, logs, excepciones y contratos compartidos
```

> Cada feature tiene su propio módulo, lo que permite escalar fácilmente agregando nuevos dominios (`cliente`, `usuarios`, etc).

---

## 📌 Endpoints

- `GET /api/empresas/actividad`  
  Empresas con transferencias el mes calendario anterior

- `GET /api/empresas/adhesion`  
  Empresas que se adhirieron el mes calendario anterior

- `POST /api/empresas`  
  Crear una nueva empresa

---

## ✅ Testing

- `npm run test` → unitarios + e2e
- `npm run test:unit`
- `npm run test:e2e`
- `npm run test:cov` → cobertura total

Los tests unitarios están basados en mocks del dominio (`EmpresaRepository`), los E2E interactúan con la base real (entorno `test`).

---

## 🧪 Seed para test

Antes de correr los tests E2E:

```bash
npm run seed:test
```

Esto pobla la DB de test con una empresa de CUIT `20111111111` y una transferencia asociada.

---

## ⚙️ Variables de entorno

Incluidos:

- `.dev.env`
- `.test.env`

Se cargan automáticamente según `NODE_ENV` usando `@nestjs/config`.

---

## 🚀 Swagger

Una vez iniciado:

```
http://localhost:3000/docs
```

---

## 📝 Notas de la prueba

Ver [`NOTAS.md`](./NOTAS.md) para aclaraciones, supuestos y decisiones de diseño.

---

_Desarrollado por Rodrigo Quintero 🛡️_  
**Fecha de entrega:** 16/04/2025

Gracias por la oportunidad.
