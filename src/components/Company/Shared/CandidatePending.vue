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
      <CandidateTable
        :postulaciones="retos"
        :tipo="tipo"
        @recargar="cargarPostulaciones"
      />
    </div>
    <div v-else>
      <p>No hay candidatos pendientes.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
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

const estado = "pendiente";

const titulo = computed(() => {
  const tipoCapitalizado =
    props.tipo?.charAt(0).toUpperCase() + props.tipo?.slice(1) || "";
  const estadoCapitalizado = estado.charAt(0).toUpperCase() + estado.slice(1);
  return `${tipoCapitalizado}s ${estadoCapitalizado}`;
});

const cargarPostulaciones = async () => {
  loading.value = true;
  try {
    retos.value =
      props.tipo === "vacante"
        ? await obtenerPostulacionVacantePorEmpresa(props.empresa.uid, estado)
        : await obtenerPostulacionRetoPorEmpresa(props.empresa.uid, estado);
  } catch (error) {
    console.error("Error al obtener postulaciones:", error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.empresa,
  (nuevaEmpresa) => {
    if (nuevaEmpresa?.uid) {
      cargarPostulaciones();
    }
  },
  { immediate: true }
);
</script>
