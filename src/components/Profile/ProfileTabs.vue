<template>
  <ul class="nav nav-pills user-tabs d-flex">
    <li
      v-for="tab in tabs"
      :key="tab.label"
      class="nav-item"
      :class="{ dropdown: tab.children }"
    >
      <!-- Dropdown -->
      <div
        v-if="tab.children"
        class="nav-link dropdown-toggle"
        data-bs-toggle="dropdown"
        role="button"
        :class="{ active: isDropdownActive(tab) }"
      >
        <i :class="tab.icon" class="me-1"></i>
        {{ tab.label }}
      </div>

      <ul v-if="tab.children" class="dropdown-menu">
        <li v-for="child in tab.children" :key="child.label">
          <router-link
            class="dropdown-item"
            :to="child.route"
            :class="{ active: $route.path.startsWith(child.route) }"
          >
            {{ child.label }}
          </router-link>
        </li>
      </ul>

      <!-- Tab normal -->
      <router-link
        v-else
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
import { useRoute } from "vue-router";

defineProps({
  tabs: {
    type: Array,
    required: true,
  },
});

const route = useRoute();

const isDropdownActive = (tab) => {
  return tab.children?.some((child) => route.path.startsWith(child.route));
};
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
