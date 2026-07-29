# Nota de entrega · continuidad mensual

**Fecha:** 29 de julio de 2026  
**Rama integrada:** `master`
**Commit de merge:** `94752b0`
**Estado:** desplegado y verificado en producción.

## Implementado

- Los cinco sistemas existentes se presentan como **el mapa**.
- El cierre de la sesión entrega el mapa priorizado.
- El bloque de precios distingue sesión suelta, primer mes y continuidad.
- La sesión suelta mantiene el precio piloto de 75 €.
- La suscripción cobra 199 € el primer mes y 149 €/mes después.
- FAQ, metadatos, comunicaciones de compra y condiciones están actualizados.
- Página de gracias y correo de bienvenida enlazan al portal seguro de Stripe.
- Intake, webhook, Brevo y panel administrativo distinguen suscripción, modalidad histórica y sesión suelta.
- El panel consulta el estado live de Stripe: renovación automática, cancelación al final del periodo y pago pendiente.

## Stripe live

- Precio recurrente: `price_1TyUcwHBqq0IP9Iawcxyo0Xk` · 149 €/mes.
- Cargo inicial único: `price_1TyUcxHBqq0IP9IaZQqnJoH7` · 50 €.
- Payment Link: `plink_1TyUdYHBqq0IP9IaePZYy78D`.
- Checkout público: `https://buy.stripe.com/4gM4gzdGd6OYesx0E88og0p`.
- Primer pago: 149 € + 50 € = 199 €.
- Renovaciones: 149 €/mes.
- Límite del Payment Link recurrente: 4 altas nuevas.
- Portal: `bpc_1TyUe2HBqq0IP9Iajh0YXwhU`.
- Login del portal: `https://billing.stripe.com/p/login/5kQ28rfOl8X698d72w8og00`.
- Cancelación: al final del periodo y sin prorrateo.
- Portal: actualización de método de pago e historial de facturas.
- Webhook productivo: `we_1TJtRPHBqq0IP9IawH4YQ0T9`.
- Eventos: checkout completado, Payment Intent pagado/fallido, alta/actualización/baja de suscripción y factura pagada/fallida.
- Snapshot previo privado `0600`: `/home/amartin/.hermes/backups/stripe/iaf-before-subscription-20260729T102035Z.json`.

## Capacidad

- Piloto limitado a **5 plazas**.
- Stripe contiene 1 reserva comercial y 1 compra interna de prueba en el enlace legacy.
- La compra interna legacy queda excluida del inventario comercial.
- Quedan **4 plazas**, visibles en producción.
- El enlace histórico `plink_1TsqhSHBqq0IP9IaUPaBVmzO` está desactivado y `syncAdvisoryCapacity` no puede reactivarlo.
- Los links vendibles de sesión suelta y suscripción están activos con límite de cuatro altas adicionales.

> Nota operativa: Stripe aplica el límite por Payment Link. El cálculo compartido se resincroniza tras cada checkout, pero no constituye una reserva transaccional común entre los dos links. En este piloto de bajo volumen debe vigilarse la última plaza si dos modalidades se compran simultáneamente.

## Seguridad y compatibilidad

- Una suscripción sólo se acepta con el conjunto exacto `monthly + setup` y `mode=subscription`, en cualquier orden.
- `monthly` aislado, `setup` aislado o la combinación en `mode=payment` se rechazan.
- La modalidad histórica exige sus Price IDs históricos y `mode=payment`.
- Gracias, intake y webhook exigen sesión completa y pagada.
- La excepción `no_payment_required` sólo existe con metadata explícita `qa=true`.
- Las claves idempotentes de bienvenida se basan en `checkout_session_id`.
- Los checkouts QA no alteran el inventario comercial y se excluyen del panel.
- Se verificaron dos compras históricas Live reales en producción sin modificar sus datos.

## E2E Live sin cobro

- Checkout real Live con ambos precios y cupón QA del 100 %.
- Total inicial: 0 €; no se solicitó tarjeta.
- Redirección correcta a `/gracias-asesoria?session_id=…`.
- Sesión Stripe: `complete`, `paid`, `mode=subscription` y ambos Price IDs.
- Suscripción QA: `active`; factura inicial `paid` por 0 €.
- Webhook: metadata `iaf_booking_notification_sent=true`.
- Intake: HTTP 200, metadata `intake_submitted=true` y reentrada sin formulario duplicado.
- Portal autenticado: factura, periodo, método de pago y cancelación visibles.
- Cancelación por UI: `cancel_at_period_end=true`; acceso conservado hasta el final del periodo.
- Lifecycle reflejado por webhook en metadata de la sesión.
- Las dos suscripciones y clientes QA se cancelaron/eliminaron.
- Coupon, Promotion Code, Payment Link y webhook QA se desactivaron o eliminaron.
- El contacto QA de Brevo, variables temporales, alias y deployments de preview fueron eliminados.

## Gates finales

- `npm test`: **23/23**.
- `npm run build`: correcto en local y Vercel.
- TypeScript: correcto.
- `git diff --check`: correcto.
- Sin secretos ni credenciales en Git.
- Producción Vercel: deployment `dpl_HiUKJkHwXj6DYWDbH2Mv3akJX29v`, estado `Ready`.
- Dominio: `https://www.iaparafilmmakers.es`.
- Smoke desktop y móvil: CTA nuevo, enlace antiguo ausente, 4 plazas, 199 € y 149 €/mes; cero errores de consola.
- Checkout productivo inspeccionado sin enviarlo: primer mes, mensualidad y botón de suscripción correctos.
- Portal público, condiciones y dos compras históricas: correctos.

## Condiciones

- Se retiró el marcador técnico `PENDIENTE REVISIÓN LEGAL` tras la aprobación expresa del propietario.
- La redacción incluye cancelación al final del periodo, ausencia de permanencia, alcance limitado, costes de terceros y conservación del precio mientras la suscripción siga activa.
- La aprobación operativa no sustituye una revisión jurídica profesional externa, que sigue siendo recomendable.

## Evidencias

- Estado E2E: `/home/amartin/.hermes/backups/stripe/iaf-qa-evidence-20260729.json`.
- Portal E2E: `/home/amartin/.hermes/backups/stripe/iaf-qa-portal-evidence-20260729.json`.
- Estado y limpieza QA: `/home/amartin/.hermes/backups/stripe/iaf-qa-state-20260729.json`.
- Capturas fuera del repositorio: `/home/amartin/.hermes/backups/stripe/iaf-subscription-20260729/`.
