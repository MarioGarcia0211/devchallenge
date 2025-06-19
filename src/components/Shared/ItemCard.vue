<template>
  <div
    @click="abrirModal"
    :title="'Haz clic para ver más detalles de ' + tipo"
    class="card shadow rounded overflow-hidden h-100 d-flex flex-column"
  >
    <div class="card-body d-flex flex-column h-100">
      <!-- Encabezado con logo y nombre -->
      <div class="d-flex align-items-center mb-3">
        <img
          :src="item.empresa?.logo"
          alt="Logo de la empresa"
          class="img-thumbnail me-3"
          style="width: 60px; height: 60px; object-fit: cover"
        />
        <div class="flex-grow-1">
          <h5 class="mb-1">{{ nombreItem }}</h5>

          <!-- Programación -->
          <div class="mb-2 d-flex align-items-center">
            <i class="bi bi-cpu me-2"></i>
            <div>
              <span
                v-for="(prog, index) in item.programacion?.slice(0, 3)"
                :key="'prog-' + index"
                class="badge me-1 soft-badge"
              >
                {{ prog }}
              </span>
              <span
                v-if="item.programacion?.length > 3"
                class="badge soft-badge extra-badge"
              >
                +{{ item.programacion.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Descripción -->
      <div class="mb-2">
        <p class="text-truncated descripcion-truncada mb-1">
          {{ item.descripcion }}
        </p>
        <button class="btn-ver-mas">Ver más</button>
      </div>

      <!-- Tecnologías -->
      <div class="mb-2 d-flex align-items-center">
        <i class="bi bi-display me-2"></i>
        <div>
          <span
            v-for="(tec, index) in item.tecnologias?.slice(0, 3)"
            :key="'tec-' + index"
            class="badge me-1 soft-badge"
          >
            {{ tec }}
          </span>
          <span
            v-if="item.tecnologias?.length > 3"
            class="badge soft-badge extra-badge"
          >
            +{{ item.tecnologias.length - 3 }}
          </span>
        </div>
      </div>

      <!-- Lenguajes -->
      <div class="mb-2 d-flex align-items-center">
        <i class="bi bi-code-slash me-2"></i>
        <div>
          <span
            v-for="(lang, index) in item.lenguajes?.slice(0, 3)"
            :key="'lang-' + index"
            class="badge me-1 soft-badge"
          >
            {{ lang }}
          </span>
          <span
            v-if="item.lenguajes?.length > 3"
            class="badge soft-badge extra-badge"
          >
            +{{ item.lenguajes.length - 3 }}
          </span>
        </div>
      </div>

      <!-- Estado + Participación -->
      <div class="mt-auto d-flex justify-content-between align-items-center">
        <div>
          Estado:
          <span
            class="badge"
            :class="item.estado === 'abierto' ? 'bg-success' : 'bg-danger'"
          >
            {{ item.estado }}
          </span>
        </div>

        <div v-if="estaParticipando">
          <span class="badge bg-primary" title="Estás participando">
            Participando
          </span>
        </div>
      </div>
      <hr />

      <div class="mt-auto text-start">
        Fecha de publicación: {{ formatearFecha(item.fechaCreacion) }}
      </div>
    </div>
  </div>

  <!-- Modal reutilizable -->
  <ItemModal
    :visible="mostrarModal"
    :item="item"
    :tipo="tipo"
    :persona="persona"
    @cerrar="mostrarModal = false"
    @registroExitoso="chequearParticipacion"
  />
</template>

<script setup>
import { ref, computed, watch } from "vue";
import ItemModal from "./ItemModal.vue";
import { verificarRegistro } from "../../services/challengeServices";

const props = defineProps({
  item: Object,
  tipo: String,
  persona: Object,
});

const mostrarModal = ref(false);
const estaParticipando = ref(false);

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

function abrirModal() {
  mostrarModal.value = true;
}

const nombreItem = computed(() =>
  props.tipo === "reto" ? props.item.nombreReto : props.item.nombreVacante
);

async function chequearParticipacion() {
  if (props.item?.id && props.persona?.uid) {
    try {
      estaParticipando.value = await verificarRegistro(
        props.item.id,
        props.persona.uid,
        props.tipo
      );
    } catch (error) {
      console.error("Error al verificar participación:", error);
      estaParticipando.value = false;
    }
  } else {
    estaParticipando.value = false;
  }
}

watch(() => [props.item, props.persona], chequearParticipacion, {
  immediate: true,
});
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

.bg-danger {
  background-color: var(--color-danger) !important;
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

.card {
  cursor: pointer;
}

.card:hover {
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
}

.card:active {
  transform: scale(0.97);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}
</style>
