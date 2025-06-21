<template>
  <div
    v-if="visible && item"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header align-items-start flex-column border-0 pb-0">
          <div class="d-flex align-items-center w-100">
            <img
              :src="item.empresa?.logo"
              alt="Logo empresa"
              class="img-thumbnail me-3"
              style="width: 80px; height: 80px; object-fit: cover"
            />
            <div>
              <h5 class="modal-title mb-1 fw-bold">
                {{ item.nombreReto || item.nombreVacante || "Sin título" }}
              </h5>

              <div class="mt-1">
                <span class="text-muted me-1">Estado:</span>
                <span
                  class="badge"
                  :class="estadoClase(item.estadoPostulacion)"
                >
                  {{ item.estadoPostulacion }}
                </span>
              </div>

              <small class="text-muted">
                Te postulaste el {{ formatearFecha(item.fechaPostulacion) }}
              </small>
            </div>
          </div>
          <br />
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Tabs -->
          <ul class="nav nav-pills nav-fill gap-2 mb-4" id="tabs">
            <li class="nav-item">
              <button
                class="nav-link"
                :class="{ active: tabActivo === 'detalle' }"
                @click="tabActivo = 'detalle'"
              >
                Detalles
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link"
                :class="{ active: tabActivo === 'empresa' }"
                @click="tabActivo = 'empresa'"
              >
                Empresa
              </button>
            </li>
          </ul>
          <!-- Contenido -->
          <div v-if="tabActivo === 'detalle'">
            <p><strong>Descripción:</strong></p>
            <div>{{ item.descripcion || "Sin descripción disponible." }}</div>

            <p class="mt-3"><strong>Lenguajes:</strong></p>
            <div>
              <span
                v-for="(lang, i) in item.lenguajes"
                :key="'lang-' + i"
                class="badge me-1 soft-badge"
              >
                {{ lang }}
              </span>
              <span v-if="!item.lenguajes?.length" class="text-muted"
                >No definido</span
              >
            </div>

            <p class="mt-3"><strong>Tecnologías:</strong></p>
            <div>
              <span
                v-for="(tec, i) in item.tecnologias"
                :key="'tec-' + i"
                class="badge me-1 soft-badge"
              >
                {{ tec }}
              </span>
              <span v-if="!item.tecnologias?.length" class="text-muted"
                >No definido</span
              >
            </div>

            <p class="mt-3"><strong>Programación:</strong></p>
            <div>
              <span
                v-for="(prog, i) in item.programacion"
                :key="'prog-' + i"
                class="badge me-1 soft-badge"
              >
                {{ prog }}
              </span>
              <span v-if="!item.programacion?.length" class="text-muted"
                >No definido</span
              >
            </div>
          </div>

          <div v-else-if="tabActivo === 'empresa'">
            <p><strong>Nombre de la empresa:</strong></p>
            <p>{{ item.empresa.nombreEmpresa }}</p>

            <p><strong>Descripción:</strong></p>
            <p>
              {{ item.empresa.descripcion || "Sin descripción disponible." }}
            </p>

            <p><strong>Sitio web:</strong></p>
            <p>
              <a
                v-if="item.empresa.paginaWeb"
                :href="item.empresa.paginaWeb"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ item.empresa.paginaWeb }}
              </a>
              <span v-else>No disponible</span>
            </p>

            <p><strong>Ubicación:</strong></p>
            <p>
              {{ item.empresa.ciudad || "No especificada" }},
              {{ item.empresa.pais }}
            </p>
          </div>
        </div>

        <!-- Footer -->
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
import { ref } from "vue";

const props = defineProps({
  visible: Boolean,
  item: Object,
  empresa: Object,
});

const tabActivo = ref("detalle");

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
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.soft-badge {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  padding: 0.4em 0.75em;
  font-size: 0.75rem;
  border-radius: 999px;
  font-weight: 600;
  margin-bottom: 4px;
  display: inline-block;
  transition: background-color 0.2s ease;
}

.soft-badge:hover {
  background-color: var(--color-primary);
  color: white;
}

.badge {
  padding: 0.4rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
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

.bg-secondary {
  background-color: var(--color-gray) !important;
  color: var(--color-black);
}

.nav-pills .nav-link {
  background-color: var(--color-gray-light);
  color: var(--color-primary-dark);
  font-weight: 600;
  border-radius: 999px;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s ease;
}

.nav-pills .nav-link:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.nav-pills .nav-link.active {
  background-color: var(--color-primary);
  color: white;
}

.modal-content {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  background-color: var(--color-gray-light);
}

.modal-body {
  padding: 1.5rem;
  font-size: 0.95rem;
  color: var(--color-gray-dark);
}

.modal-footer {
  padding: 1rem 1.5rem;
  background-color: var(--color-gray-light);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: none;
}

.btn {
  border-radius: 999px;
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  transition: all 0.2s ease-in-out;
}

.btn-secondary {
  background-color: var(--color-gray);
  border-color: var(--color-gray-dark);
  color: var(--color-black);
}

.btn-secondary:hover {
  background-color: var(--color-gray-dark);
  color: white;
}
</style>
