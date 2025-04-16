# Aclaraciones sobre la prueba técnica

## 📅 "Último mes"

La consigna pedía listar:

- Empresas que hicieron transferencias en el “último mes”
- Empresas que se adhirieron en el “último mes”

Se asumió que “último mes” se refiere al **mes calendario anterior completo**.

### Ejemplo

Si hoy es 16 de abril, entonces el mes calendario anterior es **marzo**, por lo tanto el intervalo usado fue:

```
startOfMonth(subMonths(new Date(), 1)) → 1 de marzo
endOfMonth(subMonths(new Date(), 1))   → 31 de marzo
```

> ⚠️ No se usa “últimos 30 días”, ya que eso cambia día a día y puede incluir días de dos meses distintos.

---

## 🧪 Datos mockeados

Se incluyó un archivo `seed-test.ts` que permite poblar la base de datos de test con:

- Una empresa de CUIT `20111111111`, llamada “Empresa Test”
- Una transferencia asociada a esa empresa, con importe `$5000.5`

Este seed se ejecuta automáticamente antes de correr `npm run test:e2e`.

---

## ❗ Otras decisiones tomadas

- Se creó una clase `BaseController` y `BaseService` con funciones `performOperation` para centralizar logs y manejo de errores.
- Se creó una clase `ErrorManager` para traducir errores de la DB (como `23505` o `23503`) a excepciones de dominio (`DuplicateResourceException`, etc).
- Se utilizó `raw query` optimizada para evitar el problema N+1 en la consulta de empresas con transferencias.
- Se documentó todo el código (clases, métodos, DTOs, interfaces) con comentarios tipo JSDoc.
- Se aplicó rate limiting global con `@nestjs/throttler`.

---

## 🙋‍♂️ Preguntas o cambios pendientes

- ¿Cómo interpretan ustedes “último mes”? ¿Debería ser calendario o últimos 30 días?
- ¿Se esperaba otra estructura distinta a la arquitectura hexagonal?
