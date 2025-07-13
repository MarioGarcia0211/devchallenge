<template>
  <div
    v-if="visible"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header align-items-start flex-column border-0 pb-0">
          <div class="d-flex align-items-center w-100">
            <img
              :src="item.empresa.logo"
              alt="Logo empresa"
              class="img-thumbnail me-3"
              style="width: 80px; height: 80px; object-fit: cover"
            />
            <div>
              <h5 class="modal-title mb-1 fw-bold">{{ nombreItem }}</h5>
              <small class="text-muted">
                Publicado por <strong>{{ item.empresa.nombreEmpresa }}</strong>
              </small>
              <div class="mt-1">
                <span class="text-muted me-1">Estado:</span>
                <span
                  class="badge"
                  :class="{
                    'bg-success': item.estado.toLowerCase() === 'abierto',
                    'bg-danger': item.estado.toLowerCase() === 'cerrado',
                    'bg-secondary':
                      item.estado.toLowerCase() !== 'abierto' &&
                      item.estado.toLowerCase() !== 'cerrado',
                  }"
                >
                  {{ item.estado }}
                </span>
              </div>
            </div>
          </div>
          <br />
        </div>

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

          <!-- Contenido según tab -->
          <div v-if="tabActivo === 'detalle'">
            <p><strong>Descripción:</strong></p>
            <div>{{ item.descripcion }}</div>

            <!-- Lenguajes -->
            <p class="mt-3"><strong>Lenguajes:</strong></p>
            <div>
              <span
                v-for="(lang, index) in item.lenguajes"
                :key="'lang-' + index"
                class="badge me-1 soft-badge"
              >
                {{ lang }}
              </span>
            </div>

            <!-- Tecnologías -->
            <p class="mt-3"><strong>Tecnologías:</strong></p>
            <div>
              <span
                v-for="(tec, index) in item.tecnologias"
                :key="'tec-' + index"
                class="badge me-1 soft-badge"
              >
                {{ tec }}
              </span>
            </div>

            <!-- Programación -->
            <p class="mt-3"><strong>Programación:</strong></p>
            <div>
              <span
                v-for="(prog, index) in item.programacion"
                :key="'prog-' + index"
                class="badge me-1 soft-badge"
              >
                {{ prog }}
              </span>
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

            <div class="row">
              <div class="col-md-6">
                <p><strong>Tipo de empresa: </strong></p>
                <p>{{ item.empresa.tipoEmpresa }}</p>
              </div>

              <div class="col-md-6">
                <p><strong>Industria: </strong></p>
                <p>{{ item.empresa.industria }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">Cerrar</button>

          <button
            v-if="!estaRegistrado"
            class="btn btn-primary d-flex justify-content-center align-items-center"
            @click="participar"
            :disabled="item.estado.toLowerCase() === 'cerrado' || loading"
            :title="
              item.estado.toLowerCase() === 'cerrado'
                ? 'No puedes participar en un ' + tipo + ' cerrado'
                : ''
            "
            style="min-width: 120px; height: 38px"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>Participar</span>
          </button>

          <button v-else class="btn btn-success" disabled>Participando</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Toast -->
  <Toast ref="toastRef" />
</template>

<script setup>
import { ref, watch, computed } from "vue";
import {
  verificarRegistroReto,
  registrarParticipacionReto,
} from "../../services/challengeServices";
import {
  registrarParticipacionVacante,
  verificarRegistroVacante,
} from "../../services/vacantServices";
import Toast from "../Toast/Toast.vue";

const props = defineProps({
  visible: Boolean,
  item: Object,
  tipo: String, // "reto" o "vacante"
  persona: Object,
});

const emit = defineEmits(["cerrar", "registroExitoso"]);

const estaRegistrado = ref(false);
const tabActivo = ref("detalle");
const toastRef = ref(null);
const loading = ref(false);

const cerrarModal = () => {
  emit("cerrar");
  estaRegistrado.value = false;
};

const nombreItem = computed(() =>
  props.tipo === "reto" ? props.item?.nombreReto : props.item?.nombreVacante
);

watch(
  () => [props.visible, props.item, props.persona],
  async ([visible, item, persona]) => {
    if (visible && item && persona) {
      try {
        if (props.tipo === "reto") {
          estaRegistrado.value = await verificarRegistroReto(
            item.id,
            persona.uid
          );
        } else {
          estaRegistrado.value = await verificarRegistroVacante(
            item.id,
            persona.uid
          );
        }
      } catch (error) {
        console.error("Error verificando registro:", error);
      }
    } else {
      estaRegistrado.value = false;
    }
  },
  { immediate: true }
);

const participar = async () => {
  const uid = props.persona?.uid;
  const id = props.item?.id;

  if (estaRegistrado.value) {
    alert("Ya estás registrado en este " + props.tipo + ".");
    return;
  }

  if (props.item?.estado?.toLowerCase() === "cerrado") {
    alert("Este " + props.tipo + " está cerrado. No puedes registrarte.");
    return;
  }

  loading.value = true;

  try {
    if (props.tipo === "reto") {
      await registrarParticipacionReto(id, uid);
    } else {
      await registrarParticipacionVacante(id, uid);
    }
    emit("registroExitoso");
    estaRegistrado.value = true;
    toastRef.value?.mostrarToast("success", "Te has registrado exitosamente.");
  } catch (error) {
    console.error("Error al participar:", error);
    alert("Ocurrió un error al registrarte.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.img-thumbnail {
  border: 2px solid var(--color-primary);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h5 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-primary-dark);
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

.bg-danger {
  background-color: var(--color-danger) !important;
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

.btn-primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-success {
  background-color: var(--color-success);
  border-color: var(--color-success);
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

.modal.fade.show .modal-dialog {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 576px) {
  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
  }
}
</style>
