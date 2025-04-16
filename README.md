# Interbanking Challenge · Backend

Este repositorio contiene la solución al challenge técnico para el puesto de desarrollador backend en Interbanking.

## 🧠 Stack Tecnológico

- **Node.js** con **NestJS** (Typescript)
- **PostgreSQL** con TypeORM
- **Arquitectura Hexagonal**
- **Jest** para testing (unitarios + e2e)
- **Swagger** para documentación
- **Docker Compose** (opcional para local)
- Validación de datos (`class-validator`)
- Rate limiting (`@nestjs/throttler`)
- Logs de auditoría
- Manejo estructurado de errores

## 📁 Estructura

```
src/
├── application/           ← Casos de uso (business logic)
├── core/                  ← Entidades, repositorios (puertos)
├── infrastructure/        ← Adaptadores (TypeORM)
├── presentation/          ← Controladores, DTOs
├── shared/                ← Utilidades, excepciones, logs
├── main.ts                ← Bootstrap de NestJS
```

## 📌 Endpoints

- `GET /api/empresas/actividad`  
  Empresas con transferencias el mes calendario anterior

- `GET /api/empresas/adhesion`  
  Empresas que se adhirieron el mes calendario anterior

- `POST /api/empresas`  
  Crear una nueva empresa

## 🔐 Seguridad y Calidad

- Validaciones de DTO
- Lógica de errores personalizada (`ErrorManager`)
- Rate limiting global (`5 reqs / minuto`)
- Middleware de logs de auditoría
- Cobertura de tests >90% (`npm run test:cov`)

## ✅ Testing

- `npm run test` → unitarios + e2e
- `npm run test:unit`
- `npm run test:e2e`
- `npm run test:cov`

## 🧪 Seed para test

Antes de correr los tests e2e:

```bash
npm run seed:test
```

Esto pobla la DB de test con una empresa de CUIT `20111111111` y una transferencia asociada.

## ⚙️ Variables de entorno

`.dev.env` y `.test.env` incluidos como ejemplo. Se cargan con `@nestjs/config`.

## 📝 Notas de la prueba

Ver [`NOTAS.md`](./NOTAS.md)

## 🚀 Swagger

Una vez iniciado:

```
http://localhost:3000/docs
```

---

_Desarrollado por Rodrigo Quintero 🛡️_
