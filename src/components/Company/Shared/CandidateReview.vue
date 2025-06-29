<template>
  <h5>{{ titulo }}</h5>

  <div v-if="loading">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>

  <div v-else>
    <div
      v-if="retos.length > 0"
      class="contenedor-card my-4 shadow p-4 rounded"
    >
      <CandidateTable :postulaciones="retos" :tipo="tipo" />
    </div>
    <div v-else>
      <p>No hay candidatos en revisión.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onBeforeUnmount } from "vue";
import {
  obtenerPostulacionRetoPorEmpresa,
  obtenerPostulacionVacantePorEmpresa,
} from "../../../services/candidateServices";
import CandidateTable from "./CandidateTable.vue";

const retos = ref([]);
const loading = ref(true);

const props = defineProps({
  empresa: Object,
  tipo: String, // 'reto' o 'vacante'
});

const estado = "en revisión";

const titulo = computed(() => {
  const tipoCapitalizado =
    props.tipo?.charAt(0).toUpperCase() + props.tipo?.slice(1) || "";
  const estadoCapitalizado = estado.charAt(0).toUpperCase() + estado.slice(1);
  return `${tipoCapitalizado}s ${estadoCapitalizado}`;
});

watch(
  () => props.empresa,
  async (nuevaEmpresa) => {
    if (nuevaEmpresa?.uid) {
      loading.value = true;
      try {
        retos.value =
          props.tipo === "vacante"
            ? await obtenerPostulacionVacantePorEmpresa(
                nuevaEmpresa.uid,
                estado
              )
            : await obtenerPostulacionRetoPorEmpresa(nuevaEmpresa.uid, estado);

        console.log("Postulaciones cargadas:", retos.value);
      } catch (error) {
        console.error("Error al obtener postulaciones:", error);
      } finally {
        loading.value = false;
      }
    }
  },
  { immediate: true }
);
</script>
