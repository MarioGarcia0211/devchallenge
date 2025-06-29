<template>
  <div>
    <ul class="nav nav-tabs custom-tabs">
      <li class="nav-item" v-for="tab in tabs" :key="tab.name">
        <button
          class="nav-link"
          :class="['tab-' + tab.name, { active: activeTab === tab.name }]"
          @click="activeTab = tab.name"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>

    <div class="mt-3">
      <component
        :is="getComponent(activeTab)"
        :empresa="empresa"
        :tipo="tipo"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Props genéricos
const props = defineProps({
  empresa: Object,
  tipo: String,
  tabs: {
    type: Array,
    required: true, // [{ name: 'pendientes', label: 'Pendientes' }, ...]
  },
  componentsMap: {
    type: Object,
    required: true, // { pendientes: PendienteComponent, ... }
  },
  initialTab: {
    type: String,
    default: "", // nombre del tab activo por defecto
  },
});

const activeTab = ref(props.initialTab || props.tabs[0]?.name);

// Obtener el componente dinámicamente
const getComponent = (tab) => props.componentsMap[tab] || null;
</script>

<style scoped>
.custom-tabs .nav-link {
  color: #6b7280; /* gris neutro */
  font-weight: 500;
  border: none;
  background-color: transparent;
  transition: all 0.3s ease;
}

.custom-tabs .nav-link.active {
  color: white;
  border-radius: 8px 8px 0 0;
}

/* Colores personalizados para cada tab activo */
.custom-tabs .tab-pendientes.active {
  background-color: var(--color-warning);
}
.custom-tabs .tab-revision.active {
  background-color: var(--color-review);
}
.custom-tabs .tab-proceso.active {
  background-color: var(--color-process);
}
.custom-tabs .tab-aceptado.active {
  background-color: var(--color-success);
}
.custom-tabs .tab-rechazado.active {
  background-color: var(--color-reject);
}
</style>
