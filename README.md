# Interbanking Challenge · Backend

[![CI](https://github.com/aragornz325/interbanking/actions/workflows/ci.yaml/badge.svg)](https://github.com/aragornz325/interbanking/actions/workflows/ci.yaml)


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
- **CI automatizado con GitHub Actions**

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

- `npm run test` → unitarios
- `npm run test:e2e`
- `npm run test:cov` → cobertura total

Los tests unitarios están basados en mocks del dominio (`EmpresaRepository`), los E2E interactúan con la base real (entorno `test`).

- 📊 **Cobertura Total Aproximada**: 90%

---

## 🧪 Seed para test

Antes de correr los tests E2E:

```bash
npm run seed:test
```

Esto pobla la DB de test con una empresa de CUIT `20111111111` y una transferencia asociada.

> Ver [seed-test.ts](./seed/seed-test.ts)

---

## ⚙️ Variables de entorno

Incluidos:

- `.dev.env`
- `.test.env`

Se cargan automáticamente según `NODE_ENV` usando `@nestjs/config`.

---

## 🚀 Swagger

Una vez iniciado:

[http://localhost:3000/docs](http://localhost:3000/docs)

---

## 🔄 Integración Continua (CI)

El pipeline de CI incluye:

- Levantamiento de PostgreSQL (`interbanking_test`)
- Carga de seed de test
- Ejecución de:
  - Tests unitarios
  - Tests E2E
  - Reporte de cobertura

Archivo: `.github/workflows/ci.yaml`

![CI](https://github.com/tu-usuario/interbanking-challenge/actions/workflows/ci.yaml/badge.svg)

---

## 🐳 Docker / Local Run

```bash
docker-compose up --build
```

> Esto levanta la base de datos y la aplicación backend en modo desarrollo (`.dev.env`).

---

## 🧠 Notas y Decisiones Técnicas

Se puede encontrar una explicación detallada de supuestos, decisiones y estrategias aplicadas en el archivo [`NOTAS.md`](./NOTAS.md).

---

_Desarrollado por Rodrigo Quintero 🛡️_  
**Fecha de entrega:** 16/04/2025

Gracias por la oportunidad.
