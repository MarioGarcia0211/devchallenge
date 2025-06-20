<template>
  <div>
    <h5>{{ titulo }}</h5>

    <!-- Cargando -->
    <div v-if="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Contenido -->
    <div v-else>
      <div v-if="retos.length > 0" class="row">
        <div
          class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4"
          v-for="reto in retos"
          :key="reto.id"
        >
          <PersonCard :reto="reto" @ver-detalle="abrirDetalle" />
        </div>
      </div>
      <p v-else>No hay {{ tipoPlural }} registrados.</p>
    </div>

    <!-- Modal reutilizable -->
    <PersonDetailModal
      :visible="mostrarDetalle"
      :item="itemSeleccionado"
      :tipo="props.tipo"
      @cerrar="cerrarDetalle"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { obtenerRetosPorPersonaYEstado } from "../../../services/challengeServices";
import { obtenerVacantesPorPersonaYEstado } from "../../../services/vacantServices";
import PersonCard from "./PersonCard.vue";
import PersonDetailModal from "./PersonDetailModal.vue";

const props = defineProps({
  persona: Object,
  tipo: String, // 'reto' o 'vacante'
});

const retos = ref([]);
const loading = ref(true);
const mostrarDetalle = ref(false);
const itemSeleccionado = ref(null);

const estado = "aceptado";

const titulo = computed(() => {
  const tipoCapitalizado =
    props.tipo?.charAt(0).toUpperCase() + props.tipo?.slice(1) || "";
  const estadoCapitalizado = estado.charAt(0).toUpperCase() + estado.slice(1);
  return `${tipoCapitalizado}s ${estadoCapitalizado}`;
});

const tipoPlural = computed(() =>
  props.tipo === "vacante" ? "vacantes" : "retos"
);

// Cargar los datos cuando llega la persona
watch(
  () => props.persona,
  async (nuevaPersona) => {
    if (nuevaPersona?.uid) {
      loading.value = true;
      try {
        retos.value =
          props.tipo === "vacante"
            ? await obtenerVacantesPorPersonaYEstado(nuevaPersona.uid, estado)
            : await obtenerRetosPorPersonaYEstado(nuevaPersona.uid, estado);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        loading.value = false;
      }
    }
  },
  { immediate: true }
);

// Manejo del modal
function abrirDetalle(reto) {
  itemSeleccionado.value = reto;
  mostrarDetalle.value = true;
}
function cerrarDetalle() {
  mostrarDetalle.value = false;
  itemSeleccionado.value = null;
}
</script>
