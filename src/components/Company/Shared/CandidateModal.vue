<template>
  <div
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
              :src="postulacion.datosUsuario.fotoPerfil"
              alt="Logo empresa"
              class="img-thumbnail me-3"
              style="width: 80px; height: 80px; object-fit: cover"
            />
            <div>
              <h5 class="modal-title mb-1 fw-bold">
                {{ postulacion.datosUsuario.nombres }}
                {{ postulacion.datosUsuario.apellidos }}
              </h5>
              <div class="mt-1">
                <span class="text-muted me-1">Estado:</span>
                <span class="badge" :class="estadoClase(postulacion.estado)">
                  {{ postulacion.estado }}
                </span>
              </div>
              <small class="text-muted">
                Fecha de postulación:
                <strong>{{ formatearFecha(postulacion.fechaCreacion) }}</strong>
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
                :class="{ active: tabActivo === 'candidato' }"
                @click="tabActivo = 'candidato'"
              >
                Datos del candidato
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link"
                :class="{ active: tabActivo === 'info' }"
                @click="tabActivo = 'info'"
              >
                {{ tituloTab }}
              </button>
            </li>
          </ul>

          <!-- Contenido del candidato -->
          <div v-if="tabActivo === 'candidato'">
            <!-- Descripción -->
            <section class="mb-4">
              <h6><strong>Descripción personal:</strong></h6>
              <p class="text-muted">
                {{
                  postulacion.datosUsuario?.descripcion ||
                  "Sin descripción disponible."
                }}
              </p>
            </section>

            <!-- Datos de identificación -->
            <section class="row">
              <div class="col-md-6">
                <h6><strong>Tipo de documento:</strong></h6>
                <p>
                  {{ postulacion.datosUsuario?.tipoDocumento || "No definido" }}
                </p>
              </div>
              <div class="col-md-6">
                <h6><strong>Número de documento:</strong></h6>
                <p>
                  {{
                    postulacion.datosUsuario?.numeroDocumento || "No definido"
                  }}
                </p>
              </div>
            </section>

            <!-- Contacto -->
            <section>
              <h6><strong>Correo electrónico:</strong></h6>
              <p>{{ postulacion.datosUsuario?.correo || "No definido" }}</p>

              <div class="row">
                <div class="col-md-6">
                  <h6><strong>Teléfono / WhatsApp:</strong></h6>
                  <p>
                    {{ postulacion.datosUsuario?.whatsapp || "No definido" }}
                  </p>
                </div>
                <div class="col-md-6">
                  <h6><strong>Ubicación:</strong></h6>
                  <p>
                    {{
                      postulacion.datosUsuario?.ciudad || "Ciudad desconocida"
                    }},
                    {{ postulacion.datosUsuario?.pais || "País desconocido" }}
                  </p>
                </div>
              </div>
            </section>

            <!-- Habilidades -->
            <section class="mb-4">
              <h6><strong>Habilidades:</strong></h6>
              <div>
                <span
                  v-for="(lang, i) in postulacion.datosUsuario.habilidades"
                  :key="'lang-' + i"
                  class="badge me-1 soft-badge"
                >
                  {{ lang }}
                </span>
                <span
                  v-if="!postulacion.datosUsuario.habilidades?.length"
                  class="text-muted"
                  >No definido</span
                >
              </div>
            </section>

            <!-- Tecnologías -->
            <section class="mb-4">
              <h6><strong>Tecnologías / Programación:</strong></h6>
              <div>
                <span
                  v-for="(lang, i) in postulacion.datosUsuario.tecnologias"
                  :key="'lang-' + i"
                  class="badge me-1 soft-badge"
                >
                  {{ lang }}
                </span>
                <span
                  v-if="!postulacion.datosUsuario.tecnologias?.length"
                  class="text-muted"
                  >No definido</span
                >
              </div>
            </section>

            <!-- Preferencias de trabajo -->
            <section>
              <h6><strong>Preferencias de trabajo:</strong></h6>
              <div>
                <span
                  v-for="(lang, i) in postulacion.datosUsuario
                    .preferenciasTrabajo"
                  :key="'lang-' + i"
                  class="badge me-1 soft-badge"
                >
                  {{ lang }}
                </span>
                <span
                  v-if="!postulacion.datosUsuario.preferenciasTrabajo?.length"
                  class="text-muted"
                  >No definido</span
                >
              </div>
            </section>
          </div>

          <!-- Contenido del reto o vacante -->
          <div v-else-if="tabActivo === 'info'">
            <!-- Nombre del reto o vacante -->
            <h6>
              <strong>{{ tipo }}:</strong>
            </h6>
            <p>
              {{
                postulacion.devChallenge?.nombreVacante ||
                postulacion.devChallenge?.nombreReto
              }}
            </p>
            <!-- Descripción -->
            <section class="mb-4">
              <h6><strong>Descripción:</strong></h6>
              <p class="text-muted">
                {{ postulacion.devChallenge?.descripcion }}
              </p>
            </section>

            <!-- Lenguajes -->
            <section class="mb-4">
              <h6><strong>Lenguajes:</strong></h6>
              <div>
                <span
                  v-for="(lang, i) in postulacion.devChallenge.lenguajes"
                  :key="'lang-' + i"
                  class="badge me-1 soft-badge"
                >
                  {{ lang }}
                </span>
                <span
                  v-if="!postulacion.devChallenge?.lenguajes.length"
                  class="text-muted"
                  >No definido</span
                >
              </div>
            </section>

            <!-- Tecnologias -->
            <section class="mb-4">
              <h6><strong>Tecnologías:</strong></h6>
              <div>
                <span
                  v-for="(lang, i) in postulacion.devChallenge.tecnologias"
                  :key="'lang-' + i"
                  class="badge me-1 soft-badge"
                >
                  {{ lang }}
                </span>
                <span
                  v-if="!postulacion.devChallenge?.tecnologias.length"
                  class="text-muted"
                  >No definido</span
                >
              </div>
            </section>

            <!-- Programacion -->
            <section class="mb-4">
              <h6><strong>Programación:</strong></h6>
              <div>
                <span
                  v-for="(lang, i) in postulacion.devChallenge.programacion"
                  :key="'lang-' + i"
                  class="badge me-1 soft-badge"
                >
                  {{ lang }}
                </span>
                <span
                  v-if="!postulacion.devChallenge?.programacion.length"
                  class="text-muted"
                  >No definido</span
                >
              </div>
            </section>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  postulacion: Object,
  tipo: String,
});

const tabActivo = ref("candidato");

const tituloTab = computed(() => {
  if (props.tipo === "vacante") return "Datos de la vacante";
  if (props.tipo === "reto") return "Datos del reto";
  return "Datos";
});

const tipo = computed(() => {
  if (props.tipo === "vacante") return "Nombre de la vacante";
  if (props.tipo === "reto") return "Nombre del reto";
  return "Datos";
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
