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
  background-color: #8b5cf6;
  color: white;
  font-weight: 600;
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.5);
}

.user-tabs .nav-link:hover {
  background-color: #ede9fe;
  color: #6b21a8;
}
</style>
