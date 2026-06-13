# Diagramas UML — Panel Principal

---

## 1. Diagrama de Casos de Uso

```mermaid
graph TD
    actor("Usuario") --> UC1{{Ver Panel Principal}}
    actor --> UC2{{Autenticarse}}
    actor --> UC3{{Ver Indicadores}}
    actor --> UC4{{Acceder a Módulo}}

    UC1 --> UC3
    UC1 --> UC4
    UC2 -->|extiende| UC1

    UC3 --> UC3a["Ver Citas de Hoy"]
    UC3 --> UC3b["Ver Camas Disponibles"]
    UC3 --> UC3c["Ver Admisiones Activas"]

    UC4 -->|según rol| UC4a["Admin: 8 módulos"]
    UC4 -->|según rol| UC4b["Médico: 5 módulos"]
    UC4 -->|según rol| UC4c["Enfermera: 4 módulos"]
    UC4 -->|según rol| UC4d["TecnicoLab: 3 módulos"]
    UC4 -->|según rol| UC4e["Recepcionista: 4 módulos"]

    UC4a --> UC5[Gestión de Pacientes]
    UC4a --> UC6[Gestión de Citas]
    UC4a --> UC7[Admisiones]
    UC4a --> UC8[Expediente Médico]
    UC4a --> UC9[Laboratorio]
    UC4a --> UC10[Camas]
    UC4a --> UC11[Prescripciones]
    UC4a --> UC12[Usuarios]
```

**Actores:** Usuario (hereda según su rol: Admin, Médico, Enfermera, TecnicoLab, Recepcionista)

**Casos de uso resumen:**

| ID | Nombre | Actor principal |
|---|---|---|
| UC1 | Ver Panel Principal | Todos (autenticados) |
| UC2 | Autenticarse | Todos (pre-condición) |
| UC3 | Ver Indicadores | Todos |
| UC4 | Acceder a Módulo | Todos (filtrado por rol) |

---

## 2. Diagrama de Clases

```mermaid
classDiagram
    class DashboardPage {
        +userName: string
        +tenantName: string
        +userRole: string
        +visibleModules: array
        +stats: object
        +onMounted()
        +getModuleIcon(id)
    }

    class StatCard {
        +icon: string
        +label: string
        +valor: number
        +color: string
    }

    class ModuleCard {
        +icon: string
        +nombre: string
        +descripcion: string
        +ruta: string
    }

    class modules {
        +id: string
        +nombre: string
        +descripcion: string
        +ruta: string
        +roles: string[]
    }

    class AuthStore {
        +token: string
        +tenantId: string
        +user: object
        +login(credentials)
        +logout()
        +setTenantId(id)
        +persistSession(payload)
    }

    class Api {
        +baseURL: string
        +interceptors: object
        +get(url)
        +post(url, data)
    }

    class DashboardController {
        +summary(Request)
    }

    class TenantMiddleware {
        +handle(Request, Closure)
    }

    class JwtAuth {
        +handle(Request, Closure)
    }

    DashboardPage --> StatCard : compone 3
    DashboardPage --> ModuleCard : compone N
    DashboardPage --> AuthStore : lee user/rol
    DashboardPage --> Api : GET /dashboard/summary
    DashboardPage --> modules : filtra por rol
    AuthStore --> Api : POST /auth/login
    ModuleCard --> modules : lee metadatos
    DashboardController --> TenantMiddleware : pre-filtro
    DashboardController --> JwtAuth : pre-filtro
```

**Paquetes / capas:**

| Capa | Componentes |
|---|---|
| **Presentación (Vue)** | `DashboardPage`, `StatCard`, `ModuleCard` |
| **Estado (Pinia)** | `AuthStore` |
| **Comunicación** | `Api` (Axios) |
| **Config** | `modules` (data estática) |
| **Backend (Laravel)** | `DashboardController`, `TenantMiddleware`, `JwtAuth` |

---

## 3. Diagrama de Secuencia

### Flujo completo: Login → Dashboard

```mermaid
sequenceDiagram
    actor U as Usuario
    participant LP as LoginPage.vue
    participant AS as AuthStore
    participant API as API /api/v1
    participant MW as Middleware
    participant DP as DashboardPage.vue
    participant SC as StatCard.vue
    participant MC as ModuleCard.vue

    U->>LP: Ingresa tenant ID, email, password
    LP->>AS: setTenantId(id)
    LP->>AS: login(credentials)
    AS->>API: POST /auth/login + X-Tenant-ID
    API->>MW: TenantMiddleware
    MW-->>API: tenant válido
    API->>MW: JwtAuth
    MW-->>API: token válido
    API-->>AS: { access_token, user, roles, tenant }
    AS->>AS: persistSession(token, user)
    AS-->>LP: login exitoso
    LP->>U: Redirige a /

    Note over DP: onMounted()

    DP->>AS: Lee user, rol, tenant
    DP->>AS: Lee token
    DP->>API: GET /dashboard/summary
    API->>MW: TenantMiddleware + JwtAuth
    MW-->>API: autorizado
    API-->>DP: { citas_hoy, camas_disponibles, admisiones_activas }
    DP->>DP: stats = response

    DP->>DP: Filtra modules[] según user.rol
    DP->>SC: Renderiza StatCard(v-for)
    DP->>MC: Renderiza ModuleCard(v-for)

    SC-->>U: Muestra métricas
    MC-->>U: Muestra módulos disponibles
```

### Flujo alternativo: Sin sesión

```mermaid
sequenceDiagram
    actor U as Usuario (sin token)
    participant G as authGuard
    participant R as Router
    participant LP as LoginPage.vue

    U->>R: Navega a /
    R->>G: beforeEach()
    G->>G: ¿token en localStorage?
    G-->>R: No → redirigir a /login
    R->>LP: Carga LoginPage
    LP-->>U: Muestra formulario de login
```

### Flujo alternativo: Token inválido

```mermaid
sequenceDiagram
    actor U as Usuario
    participant DP as DashboardPage.vue
    participant API as API /api/v1

    DP->>API: GET /dashboard/summary
    API-->>DP: 401 Token inválido/expirado
    DP->>DP: catch → stats quedan en 0
    DP-->>U: Dashboard con métricas en 0
```
