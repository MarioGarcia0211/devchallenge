<template>
  <div
    v-if="visible && item"
    class="modal d-block fade show"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content">
        <!-- Encabezado -->
        <div class="modal-header">
          <h5 class="modal-title">
            Detalles del {{ tipo === "vacante" ? "vacante" : "reto" }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('cerrar')" />
        </div>

        <!-- Cuerpo -->
        <div class="modal-body">
          <div class="mb-3">
            <h4>{{ item.nombre || item.nombreVacante }}</h4>
            <p class="text-muted">{{ item.descripcion }}</p>
          </div>

          <div class="mb-3">
            <strong>Estado: </strong>
            <span
              class="badge"
              :class="item.estado === 'abierto' ? 'bg-success' : 'bg-danger'"
            >
              {{ item.estado }}
            </span>
          </div>

          <div class="mb-3">
            <strong>Tecnologías:</strong>
            <div class="d-flex flex-wrap gap-2 mt-1">
              <span
                v-for="tec in item.tecnologias"
                :key="tec"
                class="badge bg-primary text-light"
              >
                {{ tec }}
              </span>
              <span v-if="!item.tecnologias?.length" class="text-muted"
                >No definido</span
              >
            </div>
          </div>

          <div class="mb-3">
            <strong>Enfoque de programación:</strong>
            <div class="d-flex flex-wrap gap-2 mt-1">
              <span
                v-for="prog in item.programacion"
                :key="prog"
                class="badge bg-primary text-light"
              >
                {{ prog }}
              </span>
              <span v-if="!item.programacion?.length" class="text-muted"
                >No definido</span
              >
            </div>
          </div>

          <div class="mb-3">
            <strong>Lenguajes aceptados:</strong>
            <div class="d-flex flex-wrap gap-2 mt-1">
              <span
                v-for="lang in item.lenguajes"
                :key="lang"
                class="badge bg-primary text-light"
              >
                {{ lang }}
              </span>
              <span v-if="!item.lenguajes?.length" class="text-muted"
                >No definido</span
              >
            </div>
          </div>

          <div class="mt-4 text-muted">
            Fecha de creación:
            {{ formatearFecha(item.fechaCreacion) }}
          </div>
        </div>

        <!-- Pie -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('cerrar')">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  item: Object,
  tipo: String,
});

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
.modal-content {
  border-radius: 16px;
  background: var(--color-white);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  border: none;
  overflow: hidden;
  animation: fadeInUp 0.3s ease-out;
}

.modal-header {
  background: linear-gradient(
    90deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  color: var(--color-white);
  border-bottom: 3px solid var(--color-primary-light);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.btn-close {
  filter: invert(1);
}

.modal-body {
  background-color: var(--color-gray-light);
  padding: 1.5rem;
}

.modal-footer {
  background-color: var(--color-gray-light);
  border-top: 1px solid var(--color-gray);
}

.badge {
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
}

.bg-primary {
  background-color: var(--color-primary) !important;
}

.bg-success {
  background-color: var(--color-success) !important;
}

.bg-danger {
  background-color: var(--color-danger) !important;
}

.text-light {
  color: var(--color-white) !important;
}

.text-muted {
  color: var(--color-gray-dark) !important;
}
</style>
