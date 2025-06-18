<template>
  <div class="card shadow rounded overflow-hidden h-100 d-flex flex-column">
    <div class="card-body d-flex flex-column h-100">
      <!-- Logo y nombre -->
      <div class="d-flex align-items-center mb-3">
        <img
          :src="empresa.logo"
          alt="Logo de la empresa"
          class="img-thumbnail me-3"
          style="width: 60px; height: 60px; object-fit: cover"
        />
        <div class="flex-grow-1">
          <h5 class="mb-1">{{ item.nombre || item.nombreVacante }}</h5>
          <div
            class="mb-2 d-flex align-items-center"
            v-if="item.programacion?.length"
          >
            <i class="bi bi-cpu me-2"></i>
            <div>
              <span
                v-for="(prog, index) in item.programacion.slice(0, 3)"
                :key="'prog-' + index"
                class="badge me-1 soft-badge"
              >
                {{ prog }}
              </span>
              <span
                v-if="item.programacion.length > 3"
                class="badge soft-badge extra-badge"
              >
                +{{ item.programacion.length - 3 }}
              </span>
            </div>
          </div>
        </div>

        <!-- Dropdown -->
        <div class="dropdown">
          <button
            class="btn btn-sm"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <button class="dropdown-item" @click="$emit('editar', item)">
                Editar
              </button>
            </li>
            <li>
              <button
                class="dropdown-item text-danger"
                @click="$emit('eliminar', item)"
              >
                Eliminar
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Descripcion -->
      <div class="mb-2">
        <p class="text-truncated descripcion-truncada mb-1">
          {{ item.descripcion }}
        </p>
        <button class="btn-ver-mas" @click="$emit('ver-detalle', item)">
          Ver más
        </button>
      </div>

      <!-- Tecnologías -->
      <div
        class="mb-2 d-flex align-items-center"
        v-if="item.tecnologias?.length"
      >
        <i class="bi bi-display me-2"></i>
        <div>
          <span
            v-for="(tec, index) in item.tecnologias.slice(0, 3)"
            :key="'tec-' + index"
            class="badge me-1 soft-badge"
          >
            {{ tec }}
          </span>
          <span
            v-if="item.tecnologias.length > 3"
            class="badge soft-badge extra-badge"
          >
            +{{ item.tecnologias.length - 3 }}
          </span>
        </div>
      </div>

      <!-- Lenguajes -->
      <div class="mb-2 d-flex align-items-center" v-if="item.lenguajes?.length">
        <i class="bi bi-code-slash me-2"></i>
        <div>
          <span
            v-for="(lang, index) in item.lenguajes.slice(0, 3)"
            :key="'lang-' + index"
            class="badge me-1 soft-badge"
          >
            {{ lang }}
          </span>
          <span
            v-if="item.lenguajes.length > 3"
            class="badge soft-badge extra-badge"
          >
            +{{ item.lenguajes.length - 3 }}
          </span>
        </div>
      </div>

      <!-- Estado -->
      <div class="mt-auto text-end">
        Estado:
        <span
          class="badge"
          :class="item.estado === 'abierto' ? 'bg-success' : 'bg-danger'"
        >
          {{ item.estado }}
        </span>
      </div>

      <hr />

      <div class="mt-auto text-start">
        Fecha de creación: {{ formatearFecha(item.fechaCreacion) }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: Object,
  empresa: Object,
  tipo: String,
});
defineEmits(["editar", "eliminar", "ver-detalle"]);

const formatearFecha = (timestamp) => {
  if (!timestamp?.toDate) return "Fecha no válida";
  const fecha = timestamp.toDate();
  return fecha.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
</script>

<style scoped>
.soft-badge {
  background-color: #f1f5f9;
  color: #334155;
  padding: 0.35em 0.6em;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.extra-badge {
  background-color: #ede9fe;
  color: #6b21a8;
}

.descripcion-truncada {
  min-height: 72px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.btn-ver-mas {
  background: none;
  border: none;
  color: var(--color-primary); /* Usa tu color principal */
  padding: 0;
  margin-top: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s, transform 0.1s;
}

.btn-ver-mas:hover {
  color: var(--color-primary-dark); /* Color más oscuro al pasar el mouse */
  text-decoration: underline;
}

.btn-ver-mas:active {
  transform: scale(0.95);
}
</style>
