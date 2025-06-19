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
        <p class="text-truncated descripcion-truncada">
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
import { verificarRegistroReto } from "../../services/challengeServices";
import { verificarRegistroVacante } from "../../services/vacantServices";

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
      if (props.tipo === "reto") {
        estaParticipando.value = await verificarRegistroReto(
          props.item.id,
          props.persona.uid
        );
      } else {
        estaParticipando.value = await verificarRegistroVacante(
          props.item.id,
          props.persona.uid
        );
      }
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
  border-radius: 1rem;
  width: 60px;
  height: 60px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

h5 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.soft-badge {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  padding: 0.4em 0.75em;
  font-size: 0.75rem;
  border-radius: 999px;
  font-weight: 500;
  margin-bottom: 4px;
  display: inline-block;
  transition: all 0.2s ease-in-out;
}

.soft-badge:hover {
  background-color: var(--color-primary);
  color: white;
}

.extra-badge {
  background-color: var(--color-gray-light);
  color: var(--color-primary-dark);
  font-weight: bold;
  border-radius: 999px;
}

.badge {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
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

.bg-primary {
  background-color: var(--color-primary) !important;
  color: white;
}

.descripcion-truncada {
  min-height: 72px;
  max-height: 4.5em;
  overflow: hidden;
  position: relative;
  font-size: 0.92rem;
  color: var(--color-gray-dark);
  line-height: 1.5em;
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
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;
}

.btn-ver-mas:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

i.bi {
  font-size: 1rem;
  color: var(--color-primary-dark);
}

.card {
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 1rem;
  transition: all 0.3s ease;
  background-color: white;
}

.card:hover {
  background-color: #fafafa;
  border-color: var(--color-primary-light);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

.card:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
