<template>
  <section class="dashboard">
    <header class="dashboard__welcome">
      <h1 class="dashboard__greeting">
        Bienvenido, {{ userName }}
      </h1>
      <p class="dashboard__tenant">{{ tenantName }}</p>
    </header>

    <div class="dashboard__stats">
      <StatCard
        icon="
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
            <rect x='3' y='4' width='18' height='18' rx='2' ry='2'/>
            <line x1='16' y1='2' x2='16' y2='6'/>
            <line x1='8' y1='2' x2='8' y2='6'/>
            <line x1='3' y1='10' x2='21' y2='10'/>
            <path d='M8 14h.01'/><path d='M12 14h.01'/><path d='M16 14h.01'/><path d='M8 18h.01'/><path d='M12 18h.01'/><path d='M16 18h.01'/>
          </svg>"
        label="Citas de hoy"
        :valor="stats.citas_hoy"
        color="#2563eb"
      />
      <StatCard
        icon="
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
            <path d='M3 7V5a2 2 0 0 1 2-2h2'/><path d='M17 3h2a2 2 0 0 1 2 2v2'/><path d='M21 17v2a2 2 0 0 1-2 2h-2'/><path d='M7 21H5a2 2 0 0 1-2-2v-2'/>
            <rect x='7' y='7' width='10' height='10' rx='1'/>
            <line x1='12' y1='7' x2='12' y2='17'/><line x1='7' y1='12' x2='17' y2='12'/>
          </svg>"
        label="Camas disponibles"
        :valor="stats.camas_disponibles"
        color="#059669"
      />
      <StatCard
        icon="
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
            <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/>
            <circle cx='9' cy='7' r='4'/>
            <path d='M22 21v-2a4 4 0 0 0-3-3.87'/>
            <path d='M16 3.13a4 4 0 0 1 0 7.75'/>
          </svg>"
        label="Admisiones activas"
        :valor="stats.admisiones_activas"
        color="#d97706"
      />
    </div>

    <h2 class="dashboard__section-title">Módulos del sistema</h2>

    <div class="dashboard__modules">
      <ModuleCard
        v-for="mod in visibleModules"
        :key="mod.id"
        :icon="getModuleIcon(mod.id)"
        :nombre="mod.nombre"
        :descripcion="mod.descripcion"
        :ruta="mod.ruta"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { modules } from '@/modules/dashboard/data/modules'
import api from '@/plugins/axios'
import StatCard from '@/modules/dashboard/components/StatCard.vue'
import ModuleCard from '@/modules/dashboard/components/ModuleCard.vue'

const auth = useAuthStore()

const userName = computed(() => auth.user?.name ?? 'Usuario')
const tenantName = computed(() => auth.user?.tenant?.name ?? auth.tenantId ?? '')

const userRole = computed(() => {
  if (!auth.user) return null
  const roles = auth.user.roles ?? []
  return roles.length > 0 ? roles[0].name : null
})

const visibleModules = computed(() => {
  if (!userRole.value) return []
  return modules.filter(m => m.roles.includes(userRole.value))
})

const stats = ref({
  citas_hoy: 0,
  camas_disponibles: 0,
  admisiones_activas: 0,
})

onMounted(async () => {
  try {
    const { data } = await api.get('/dashboard/summary')
    stats.value = data
  } catch {
    // Si el backend aún no tiene datos, se quedan en 0
  }
})

function getModuleIcon(id) {
  const icons = {
    pacientes: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/></svg>`,
    citas: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='4' width='18' height='18' rx='2' ry='2'/><line x1='16' y1='2' x2='16' y2='6'/><line x1='8' y1='2' x2='8' y2='6'/><line x1='3' y1='10' x2='21' y2='10'/></svg>`,
    admision: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 18V5l12-2v13'/><circle cx='6' cy='18' r='3'/><circle cx='18' cy='16' r='3'/></svg>`,
    expedientes: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><polyline points='10 9 9 9 8 9'/></svg>`,
    laboratorio: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M10 2v2'/><path d='M14 2v2'/><path d='M12 5a7 7 0 0 0-7 7v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a7 7 0 0 0-7-7z'/><path d='M9 17v-5'/><path d='M15 17v-5'/></svg>`,
    camas: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 4v16'/><path d='M2 8h18a2 2 0 0 1 2 2v10'/><path d='M2 17h20'/><path d='M6 8v9'/></svg>`,
    prescripciones: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19.14 12.87a2 2 0 0 0-.1-3.34l-6-3.46a2 2 0 0 0-2 0l-5.96 3.44a2 2 0 0 0-.1 3.34'/><path d='M12 2v20'/><path d='M8 12l4-2 4 2'/></svg>`,
    usuarios: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>`,
  }
  return icons[id] ?? icons.pacientes
}
</script>

<style scoped>
.dashboard {
  max-width: 1000px;
}
.dashboard__welcome {
  margin-bottom: 1.5rem;
}
.dashboard__greeting {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}
.dashboard__tenant {
  color: #64748b;
  font-size: 0.9rem;
}
.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.dashboard__section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.dashboard__modules {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}
</style>
