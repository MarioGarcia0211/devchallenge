<template>
  <div
    v-if="visible"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditing ? `Editar ${label}` : `Crear ${label}` }}
          </h5>
          <button type="button" class="btn-close" @click="cerrarModal" />
        </div>

        <div class="modal-body">
          <!-- Nombre -->
          <div class="mb-3">
            <label class="form-label">Nombre del {{ label }}</label>
            <input v-model="formData.nombre" type="text" class="form-control" />
          </div>

          <!-- Descripción -->
          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea
              v-model="formData.descripcion"
              class="form-control"
              rows="3"
            ></textarea>
          </div>

          <!-- Estado -->
          <div class="mb-3">
            <label class="form-label">Estado</label>
            <select v-model="formData.estado" class="form-select">
              <option value="">Seleccione...</option>
              <option value="abierto">Abierto</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>

          <!-- Tecnologías necesarias -->
          <div class="mb-3">
            <label class="form-label">Tecnologías necesarias</label>
            <div class="dropdown w-100 position-relative">
              <button
                class="form-control text-start dropdown-toggle d-flex justify-content-between align-items-center text-truncate"
                type="button"
                data-bs-toggle="dropdown"
                :title="formData.tecnologias.join(', ')"
              >
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="tec in formData.tecnologias"
                    :key="tec"
                    class="badge bg-primary text-light"
                  >
                    {{ tec }}
                  </span>
                  <span
                    v-if="formData.tecnologias.length === 0"
                    class="text-muted"
                  >
                    Selecciona tecnologías
                  </span>
                </div>
              </button>

              <ul
                class="dropdown-menu w-100 shadow-sm"
                style="max-height: 200px; overflow-y: auto"
              >
                <li v-for="tec in tecnologiasDisponibles" :key="tec">
                  <div class="dropdown-item">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :id="`tec-${tec}`"
                        :value="tec"
                        v-model="formData.tecnologias"
                      />
                      <label class="form-check-label" :for="`tec-${tec}`">
                        {{ tec }}
                      </label>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Enfoque de programación -->
          <div class="mb-3">
            <label class="form-label">Enfoque de programación</label>
            <div class="dropdown w-100 position-relative">
              <button
                class="form-control text-start dropdown-toggle d-flex justify-content-between align-items-center text-truncate"
                type="button"
                data-bs-toggle="dropdown"
                :title="formData.programacion.join(', ')"
              >
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="prog in formData.programacion"
                    :key="prog"
                    class="badge bg-primary text-light"
                  >
                    {{ prog }}
                  </span>
                  <span
                    v-if="formData.programacion.length === 0"
                    class="text-muted"
                  >
                    Selecciona enfoques
                  </span>
                </div>
              </button>

              <ul
                class="dropdown-menu w-100 shadow-sm"
                style="max-height: 200px; overflow-y: auto"
              >
                <li v-for="prog in programacionDisponible" :key="prog">
                  <div class="dropdown-item">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :id="`prog-${prog}`"
                        :value="prog"
                        v-model="formData.programacion"
                      />
                      <label class="form-check-label" :for="`prog-${prog}`">
                        {{ prog }}
                      </label>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Lenguajes aceptados -->
          <div class="mb-3">
            <label class="form-label">Lenguajes aceptados</label>
            <div class="dropdown w-100 position-relative">
              <button
                class="form-control text-start dropdown-toggle d-flex justify-content-between align-items-center text-truncate"
                type="button"
                data-bs-toggle="dropdown"
                :title="formData.lenguajes.join(', ')"
              >
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="lang in formData.lenguajes"
                    :key="lang"
                    class="badge bg-primary text-light"
                  >
                    {{ lang }}
                  </span>
                  <span
                    v-if="formData.lenguajes.length === 0"
                    class="text-muted"
                  >
                    Selecciona lenguajes
                  </span>
                </div>
              </button>

              <ul
                class="dropdown-menu w-100 shadow-sm"
                style="max-height: 200px; overflow-y: auto"
              >
                <li v-for="lang in lenguajesDisponibles" :key="lang">
                  <div class="dropdown-item">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :id="`lang-${lang}`"
                        :value="lang"
                        v-model="formData.lenguajes"
                      />
                      <label class="form-check-label" :for="`lang-${lang}`">
                        {{ lang }}
                      </label>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">
            Cancelar
          </button>
          <button
            class="btn btn-primary"
            @click="guardar"
            :disabled="!formData.nombre || !formData.estado"
          >
            {{ isEditing ? `Actualizar ${label}` : `Guardar ${label}` }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <Toast ref="toastRef" />
</template>

<script setup>
import { ref, computed, watch } from "vue";
import {
  crearVacante,
  actualizarVacante,
} from "../../../services/vacantServices";
import { crearReto, actualizarReto } from "../../../services/challengeServices";
import Toast from "../../Toast/Toast.vue";

const props = defineProps({
  visible: Boolean,
  empresa: Object,
  tipo: String,
  datos: Object,
});
const emit = defineEmits(["cerrar", "guardado"]);

const label = computed(() => (props.tipo === "vacante" ? "vacante" : "reto"));
const isEditing = computed(() => !!props.datos?.id);
const toastRef = ref(null);

const formData = ref({
  nombre: "",
  descripcion: "",
  estado: "",
  tecnologias: [],
  programacion: [],
  lenguajes: [],
});

// Cargar datos al mostrar modal
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      const d = props.datos || {};
      formData.value = {
        nombre:
          props.tipo === "vacante" ? d.nombreVacante || "" : d.nombreReto || "",
        descripcion: d.descripcion || "",
        estado: d.estado || "",
        tecnologias: [...(d.tecnologias || [])],
        programacion: [...(d.programacion || [])],
        lenguajes: [...(d.lenguajes || [])],
      };
    }
  },
  { immediate: true }
);

const tecnologiasDisponibles = [
  "React",
  "Vue.js",
  "Angular",
  "Marketing Digital",
  "Soporte",
  "Svelte",
  "Ember.js",
  "Backbone.js",
  "Django",
  "Flask",
  "Ruby on Rails",
  "Spring",
  "Laravel",
  "ASP.NET",
  "Express.js",
  "NestJS",
  "Google Cloud",
  "AWS",
  "Azure",
  "Firebase",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "SQLite",
  "Redis",
  "DynamoDB",
];

const programacionDisponible = [
  "Frontend",
  "Backend",
  "Fullstack",
  "Mobile",
  "Desktop",
  "Web",
  "API",
  "Microservicios",
  "Monolítico",
  "Serverless",
  "Cloud",
  "On-premise",
];
const lenguajesDisponibles = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "Rust",
  "Scala",
  "Perl",
  "R",
  "Haskell",
  "Lua",
  "Dart",
  "Objective-C",
  "Clojure",
  "F#",
  "Erlang",
  "Julia",
  "COBOL",
  "Fortran",
  "Ada",
  "Lisp",
  "Scheme",
  "Prolog",
  "Smalltalk",
  "Pascal",
  "Basic",
  "Assembly",
  "C",
  "C++",
];

const cerrarModal = () => emit("cerrar");

const guardar = async () => {
  // Armar base del payload sin el nombre aún
  const basePayload = {
    descripcion: formData.value.descripcion,
    estado: formData.value.estado,
    tecnologias: formData.value.tecnologias,
    programacion: formData.value.programacion,
    lenguajes: formData.value.lenguajes,
    idUsuarioEmpresa: props.empresa?.uid || null,
  };

  // Agregar dinámicamente el campo de nombre correcto
  const payload = {
    ...basePayload,
    [props.tipo === "vacante" ? "nombreVacante" : "nombreReto"]:
      formData.value.nombre,
  };

  try {
    if (props.tipo === "vacante") {
      if (isEditing.value) {
        await actualizarVacante(props.datos.id, payload);
      } else {
        const id = await crearVacante(payload);
        payload.id = id;
      }
    } else {
      if (isEditing.value) {
        await actualizarReto(props.datos.id, payload);
      } else {
        const id = await crearReto(payload);
        payload.id = id;
      }
    }
    toastRef.value?.mostrarToast(
      "success",
      `${label.value} guardado correctamente`
    );
    emit("guardado", payload);
    cerrarModal();
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
.modal-content {
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: none;
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  background-color: var(--color-primary);
  border-bottom: none;
}

.modal-title {
  font-weight: 700;
  color: white;
  font-size: 1.25rem;
}

.btn-close {
  filter: brightness(0) invert(1);
}

.modal-body {
  padding: 1.5rem;
  background-color: #f9fafb;
  color: var(--color-gray-dark);
  font-size: 0.95rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  background-color: var(--color-gray-light);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: none;
}

/* Inputs */
.form-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}

.form-control,
.form-select {
  border-radius: 0.5rem;
  font-size: 0.95rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  transition: border-color 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.15rem rgba(59, 130, 246, 0.25);
}

/* Dropdown */
.dropdown-toggle {
  background-color: #fff;
  border: 1px solid #d1d5db;
}

.dropdown-menu {
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-height: 200px;
  overflow-y: auto;
  z-index: 9999;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.badge {
  font-size: 0.75rem;
  padding: 0.4em 0.75em;
  border-radius: 999px;
  font-weight: 600;
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.badge:hover {
  background-color: var(--color-primary);
  color: white;
}

/* Botones */
.btn {
  border-radius: 999px;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
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

/* Animación */
.modal.fade.show .modal-dialog {
  animation: fadeInUp 0.35s ease-out;
}

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive */
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
