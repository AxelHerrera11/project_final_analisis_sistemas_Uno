<template>
  <div class="stat-card" :style="{ borderLeftColor: color }">
    <div class="stat-card__icon" v-html="icon"></div>
    <div class="stat-card__body">
      <span class="stat-card__value">{{ valor }}</span>
      <span class="stat-card__label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  valor: { type: [Number, String], required: true },
  color: { type: String, default: '#2563eb' },
})
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  border-left: 4px solid;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}
.stat-card__icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}
.stat-card__body {
  display: flex;
  flex-direction: column;
}
.stat-card__value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  color: #0f172a;
}
.stat-card__label {
  font-size: 0.85rem;
  color: #64748b;
}
</style>
