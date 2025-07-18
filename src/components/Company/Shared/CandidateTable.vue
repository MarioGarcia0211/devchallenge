<template>
  <div class="table-responsive">
    <table class="table table-bordered text-center align-middle">
      <thead class="table-light">
        <tr>
          <th>Participante</th>
          <th>Estado</th>
          <th>Contacto</th>
          <th>Ubicación</th>
          <th>Fecha de postulación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="postulacion in postulaciones" :key="postulacion.id">
          <!-- Participante -->
          <td class="text-center">
            <div class="d-flex align-items-center gap-2">
              <div
                class="foto-container"
                v-if="postulacion.datosUsuario?.fotoPerfil"
              >
                <img
                  :src="postulacion.datosUsuario.fotoPerfil"
                  alt="Foto perfil"
                  class="foto-perfil"
                />
              </div>

              <div>
                <strong
                  >{{ postulacion.datosUsuario?.nombres }}
                  {{ postulacion.datosUsuario?.apellidos }}</strong
                >
              </div>
            </div>
          </td>
          <!-- Estado -->
          <td>
            <span :class="estadoClass(postulacion.estado)">
              {{ postulacion.estado }}
            </span>
          </td>
          <!-- Contacto -->
          <td class="text-center">
            <!-- Correo -->
            <div class="d-flex align-items-center gap-1">
              <i class="bi bi-envelope text-primary"></i>
              <a
                :title="`Enviar mensaje por correo`"
                class="link-personalizado"
                :href="`mailto:${postulacion.datosUsuario?.correo}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ postulacion.datosUsuario?.correo }}
              </a>
            </div>

            <!-- WhatsApp -->
            <div class="d-flex align-items-center gap-1">
              <i class="bi bi-whatsapp text-success"></i>
              <a
                :title="`Enviar mensaje por whatsapp`"
                class="link-personalizado"
                :href="`https://wa.me/${postulacion.datosUsuario?.whatsapp?.replace(
                  /[^0-9]/g,
                  ''
                )}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ postulacion.datosUsuario?.whatsapp }}
              </a>
            </div>
          </td>

          <!-- Ubicacion -->
          <td class="text-center">
            <div class="d-flex align-items-center gap-1">
              <i class="bi bi-cursor text-purple"></i>
              <span
                >{{ postulacion.datosUsuario?.ciudad }},
                {{ postulacion.datosUsuario?.pais }}</span
              >
            </div>
          </td>
          <!-- Fecha de postulacion -->
          <td>{{ formatearFecha(postulacion.fechaCreacion) }}</td>
          <!-- Acciones -->
          <td>
            <button
              class="btn btn-sm btn-primary me-1"
              @click="abrirModal(postulacion)"
            >
              <i class="bi bi-eye me-1"></i>
              Ver más
            </button>
            <button
              class="btn btn-sm btn-warning"
              @click="abrirModalCambio(postulacion)"
            >
              <i class="bi bi-pencil me-1"></i>
              Cambiar estado
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <CandidateModal
    v-if="postulacionSeleccionada"
    :postulacion="postulacionSeleccionada"
    :tipo="tipo"
    @close="cerrarModal"
  />

  <CandidateStatus
    v-if="postulacionCambio"
    :postulacion="postulacionCambio"
    :tipo="tipo"
    @close="cerrarModalCambio"
    @actualizado="actualizarEstado"
  />
</template>

<script setup>
import { ref } from "vue";
import CandidateModal from "./CandidateModal.vue";
import CandidateStatus from "./CandidateStatus.vue";
const emit = defineEmits(["recargar"]);

const props = defineProps({
  postulaciones: Object,
  tipo: String,
});

const postulacionSeleccionada = ref(null);
const postulacionCambio = ref(null);

const abrirModal = (postulacion) => {
  postulacionSeleccionada.value = postulacion;
};

const cerrarModal = () => {
  postulacionSeleccionada.value = null;
};

const abrirModalCambio = (postulacion) => {
  postulacionCambio.value = postulacion;
};

const cerrarModalCambio = () => {
  postulacionCambio.value = null;
};

const actualizarEstado = () => {
  cerrarModalCambio();
  emit("recargar");
};

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

const estadoClass = (estado) => {
  switch (estado) {
    case "pendiente":
      return "badge bg-warning";
    case "aceptado":
      return "badge bg-success";
    case "rechazado":
      return "badge bg-reject";
    case "en proceso":
      return "badge bg-primary";
    case "en revisión":
      return "badge bg-review";
    default:
      return "badge bg-secondary";
  }
};
</script>

<style scoped>
.table th,
.table td {
  white-space: nowrap;
  vertical-align: middle;
  padding: 1rem 2.1rem;
}

.table th {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-weight: 600;
  font-size: 0.95rem;
  padding: 1rem 1.25rem;
  text-transform: uppercase;
}

.foto-container {
  background-color: var(--color-primary-dark);
  border-radius: 50%;
  padding: 2px;
  display: inline-block;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
}

.foto-perfil {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
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

.text-purple {
  color: #6f42c1;
}

.link-personalizado {
  text-decoration: none;
  font-weight: normal;
  color: black;
}

.link-personalizado:hover {
  text-decoration: underline;
}

.btn-sm {
  font-weight: 500;
  border-radius: 999px;
  padding: 0.4rem 1rem;
}
</style>
