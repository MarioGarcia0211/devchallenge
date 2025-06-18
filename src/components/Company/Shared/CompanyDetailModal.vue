<template>
  <div
    v-if="visible && item"
    class="modal d-block fade show"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    @click.self="$emit('cerrar')"
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
            <i class="bi bi-calendar-event"></i>
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
  border-radius: 10px;
}
</style>
