<template>
  <div class="card shadow rounded overflow-hidden h-100 d-flex flex-column">
    <div class="card-body d-flex flex-column h-100">
      <!-- Logo y nombre -->
      <div class="d-flex align-items-center mb-3">
        <img
          :src="reto?.empresa.logo"
          alt="Logo de la empresa"
          class="img-thumbnail me-3"
          style="width: 60px; height: 60px; object-fit: cover"
        />
        <div class="flex-grow-1">
          <h5 class="mb-1">{{ reto.nombreReto || reto.nombreVacante }}</h5>
          <div
            class="mb-2 d-flex align-items-center"
            v-if="reto.programacion?.length"
          >
            <i class="bi bi-cpu me-2"></i>
            <div>
              <span
                v-for="(prog, index) in reto.programacion.slice(0, 3)"
                :key="'prog-' + index"
                class="badge me-1 soft-badge"
              >
                {{ prog }}
              </span>
              <span
                v-if="reto.programacion.length > 3"
                class="badge soft-badge extra-badge"
              >
                +{{ reto.programacion.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Descripcion -->
      <div class="mb-2">
        <p class="text-truncated descripcion-truncada mb-1">
          {{ reto.descripcion }}
        </p>
        <button class="btn-ver-mas" @click="$emit('ver-detalle', reto)">
          Ver más
        </button>
      </div>

      <!-- Tecnologías -->
      <div
        class="mb-2 d-flex align-items-center"
        v-if="reto.tecnologias?.length"
      >
        <i class="bi bi-display me-2"></i>
        <div>
          <span
            v-for="(tec, index) in reto.tecnologias.slice(0, 3)"
            :key="'tec-' + index"
            class="badge me-1 soft-badge"
          >
            {{ tec }}
          </span>
          <span
            v-if="reto.tecnologias.length > 3"
            class="badge soft-badge extra-badge"
          >
            +{{ reto.tecnologias.length - 3 }}
          </span>
        </div>
      </div>

      <!-- Lenguajes -->
      <div class="mb-2 d-flex align-items-center" v-if="reto.lenguajes?.length">
        <i class="bi bi-code-slash me-2"></i>
        <div>
          <span
            v-for="(lang, index) in reto.lenguajes.slice(0, 3)"
            :key="'lang-' + index"
            class="badge me-1 soft-badge"
          >
            {{ lang }}
          </span>
          <span
            v-if="reto.lenguajes.length > 3"
            class="badge soft-badge extra-badge"
          >
            +{{ reto.lenguajes.length - 3 }}
          </span>
        </div>
      </div>

      <!-- Estado -->
      <div class="mt-auto text-end">
        Estado:
        <span class="badge" :class="estadoClase(reto.estadoPostulacion)">
          {{ reto.estadoPostulacion }}
        </span>
      </div>

      <hr />

      <div class="mt-auto text-start">
        Fecha de postulación: {{ formatearFecha(reto.fechaPostulacion) }}
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  reto: Object,
});

defineEmits(["ver-detalle"]);

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

function estadoClase(estado) {
  switch (estado.toLowerCase()) {
    case "pendiente":
      return "bg-warning text-white";
    case "en revisión":
      return "bg-review text-white";
    case "en proceso":
      return "bg-process text-white";
    case "aceptado":
      return "bg-success text-white";
    case "rechazado":
      return "bg-reject text-white";
    default:
      return "bg-secondary text-white";
  }
}
</script>

<style scoped>
.img-thumbnail {
  border: 2px solid var(--color-primary);
  border-radius: 12px;
}

h5 {
  font-size: 1.2rem;
  font-weight: 600;
}

.soft-badge {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  padding: 0.4em 0.7em;
  font-size: 0.75rem;
  border-radius: 12px;
  font-weight: 500;
  display: inline-block;
}

.extra-badge {
  background-color: var(--color-gray-light);
  color: var(--color-primary-dark);
  font-weight: bold;
}

.badge {
  padding: 0.35rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.bg-success {
  background-color: var(--color-success) !important;
  color: white;
}

.bg-warning {
  background-color: var(--color-warning) !important;
  color: white;
}
.bg-review {
  background-color: var(--color-review) !important;
  color: white;
}
.bg-process {
  background-color: var(--color-process) !important;
  color: white;
}

.bg-reject {
  background-color: var(--color-reject) !important;
  color: white;
}

.descripcion-truncada {
  min-height: 72px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.btn-ver-mas {
  background: none;
  border: none;
  color: var(--color-primary);
  padding: 0;
  margin-top: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s, transform 0.1s;
}

.btn-ver-mas:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.btn-ver-mas:active {
  transform: scale(0.95);
}

.btn-ver-mas:active {
  transform: scale(0.95);
}

i.bi {
  font-size: 1rem;
  color: var(--color-primary-dark);
}
</style>
