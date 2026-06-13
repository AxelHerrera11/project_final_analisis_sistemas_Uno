<template>
  <router-link :to="ruta" class="module-card">
    <div class="module-card__icon" v-html="icon"></div>
    <div class="module-card__body">
      <span class="module-card__name">{{ nombre }}</span>
      <span class="module-card__desc">{{ descripcion }}</span>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  ruta: { type: String, required: true },
})
</script>

<style scoped>
.module-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-decoration: none;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}
.module-card:hover {
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
  transform: translateY(-2px);
}
.module-card__icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}
.module-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
}
.module-card__name {
  font-weight: 600;
  font-size: 0.95rem;
}
.module-card__desc {
  font-size: 0.8rem;
  color: #64748b;
}
</style>
