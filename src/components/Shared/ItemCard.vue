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
      <p class="text-truncated descripcion-truncada">{{ item.descripcion }}</p>

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
import ItemModal from "./ItemModal.vue"; // Asegúrate de tener este modal genérico
import { verificarRegistro } from "../../services/challengeServices"; // Puedes hacerlo genérico también

const props = defineProps({
  item: Object,
  tipo: String, // "reto" o "vacante"
  persona: Object,
});

const mostrarModal = ref(false);
const estaParticipando = ref(false);

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
.soft-badge {
  background-color: #f1f5f9;
  color: #334155;
  padding: 0.35em 0.6em;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.extra-badge {
  background-color: #ede9fe;
  color: #6b21a8;
}

.descripcion-truncada {
  min-height: 72px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
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
