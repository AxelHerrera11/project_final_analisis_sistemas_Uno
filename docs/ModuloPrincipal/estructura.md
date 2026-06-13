# Módulo Panel Principal (Dashboard)

## Propósito

Pantalla principal del sistema que muestra un resumen ejecutivo de indicadores
y proporciona acceso rápido a los módulos según el rol del usuario.

## Estructura de archivos

```
resources/js/
├── modules/
│   └── dashboard/
│       ├── pages/
│       │   └── DashboardPage.vue        ← Página principal del panel
│       ├── components/
│       │   ├── StatCard.vue             ← Card de métrica (svg + valor + label)
│       │   └── ModuleCard.vue           ← Card de acceso a módulo (svg + nombre + desc)
│       └── data/
│           └── modules.js               ← Config de módulos con roles permitidos

app/Http/Controllers/Api/V1/
└── DashboardController.php              ← Endpoint /api/v1/dashboard/summary

routes/api.php                           ← Ruta del endpoint (api/v1/dashboard/summary)
```

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `resources/js/router/index.js` | Se agregó ruta `/dashboard` con `meta: { requiresAuth: true }` |
| `resources/js/shared/components/AppLayout.vue` | Navegación condicional según autenticación; link a Panel y botón Salir |

## Componentes

### DashboardPage.vue
- **Ruta**: `/dashboard` (protegida por `requiresAuth`)
- **Consume**: `authStore` (user, token, rol) y `api` (GET /dashboard/summary)
- **Secciones**:
  1. **WelcomeSection** (inline): saludo con nombre del usuario y tenant
  2. **StatCards** (3): Citas hoy, Camas disponibles, Admisiones activas
  3. **ModuleCards**: grilla de módulos filtrados por rol del usuario

### StatCard.vue
- Props: `icon` (svg string), `label`, `valor`, `color` (border-left)
- Diseño: card blanca con borde izquierdo coloreado

### ModuleCard.vue
- Props: `icon` (svg string), `nombre`, `descripcion`, `ruta`
- Comportamiento: `router-link` que navega a la ruta del módulo
- Diseño: card con hover elevación

## API

### `GET /api/v1/dashboard/summary`

Requiere cabeceras:
- `Authorization: Bearer <token>`
- `X-Tenant-ID: <id>`

Respuesta:
```json
{
  "citas_hoy": 0,
  "camas_disponibles": 0,
  "admisiones_activas": 0
}
```

> Los valores retornan 0 mientras no existan los módulos correspondientes.

## Roles y visibilidad de módulos

La configuración está en `resources/js/modules/dashboard/data/modules.js`.
Cada módulo define un array `roles` que indica qué roles pueden verlo.

| Módulo | Admin | Médico | Enfermera | TecnicoLab | Recepcionista |
|---|---|---|---|---|---|
| Pacientes | ✅ | ✅ | ✅ | ❌ | ✅ |
| Citas | ✅ | ✅ | ❌ | ❌ | ✅ |
| Admisiones | ✅ | ❌ | ✅ | ❌ | ✅ |
| Expediente Médico | ✅ | ✅ | ✅ | ❌ | ❌ |
| Laboratorio | ✅ | ✅ | ❌ | ✅ | ❌ |
| Camas | ✅ | ❌ | ✅ | ❌ | ✅ |
| Prescripciones | ✅ | ✅ | ❌ | ❌ | ❌ |
| Usuarios | ✅ | ❌ | ❌ | ❌ | ❌ |

## Flujo de datos

```
Login exitoso
  → auth store: token, user, tenant_id, rol
  → Navegación a /dashboard
  → DashboardPage onMounted
      → api.get('/dashboard/summary') (con Bearer + X-Tenant-ID)
      → Actualiza stats reactivas
  → Filtra modules[] según user.rol
  → Renderiza StatCards + ModuleCards
```

## Diseño visual

- Sin librerías externas de iconos; todos los SVG son inline.
- Esquema de colores: azul (#2563eb) para citas, verde (#059669) para camas,
  ámbar (#d97706) para admisiones.
- Cards con sombra ligera, bordes redondeados (12px).
