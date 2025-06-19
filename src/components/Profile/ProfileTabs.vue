<template>
  <ul class="nav nav-pills user-tabs d-flex">
    <li v-for="tab in tabs" :key="tab.label" class="nav-item">
      <router-link
        :to="tab.route"
        class="nav-link"
        :class="{ active: $route.path.startsWith(tab.route) }"
      >
        <i :class="tab.icon" class="me-1"></i>
        {{ tab.label }}
      </router-link>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.user-tabs {
  margin-top: 1rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.user-tabs .nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: #6b7280;
  transition: all 0.2s;
  border-radius: 0.5rem;
}

.user-tabs .nav-link.active {
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  box-shadow: 0 0 8px var(--color-primary-light);
}

.user-tabs .nav-link:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.user-tabs .nav-link.active:hover {
  background-color: var(--color-primary-dark);
  color: white;
  font-weight: 600;
}
</style>
