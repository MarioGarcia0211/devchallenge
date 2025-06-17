<template>
  <button class="btn custom-btn mb-3" @click="mostrarModal = true">
    Crear vacante
  </button>

  <!-- Loading -->
  <div v-if="cargando" class="text-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando vancantes...</span>
    </div>
    <p class="mt-3 text-muted">Cargando vacantes...</p>
  </div>

  <!-- Lista de vacantes -->
  <div v-else-if="vacantes.length" class="row">
    <div
      class="col-12 col-sm-6 col-lg-4 mb-4 d-flex"
      v-for="vacante in vacantes"
      :key="vacante.id"
    ></div>
  </div>

  <!-- No hay vacantes -->
  <div v-else class="text-muted text-center mt-4">
    No hay vacantes registrados.
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  obtenerVacantesPorEmpresa,
  eliminarVacantePorID,
} from "../../../services/vacantServices";
const props = defineProps({
  empresa: Object,
});

const vacantes = ref([]);
const mostrarModal = ref(false);
const cargando = ref(true);
const vacanteAEditar = ref(null);

// Recargar lista tras guardar vacante
const onVancanteGuardado = async () => {
  await cargarVacantes();
  mostrarModal.value = false;
  vacanteAEditar.value = null;
};

// Función para cargar vacantes
const cargarVacantes = async () => {
  cargando.value = true;
  if (props.empresa?.uid) {
    try {
      vacantes.value = await obtenerVacantesPorEmpresa(props.empresa.uid);
      console.log("Vacantes: ", vacantes.value);
    } catch (error) {
      console.error("Error al cargar vacantes:", error);
    } finally {
      cargando.value = false;
    }
  } else {
    cargando.value = false;
  }
};

// Acciones de tarjeta
const editarVacante = (vacante) => {
  console.log("Editar vacante", vacante);
  vacanteAEditar.value = vacante;
  mostrarModal.value = true;
};

const eliminarVacante = async (vacante) => {
  if (confirm(`¿Estás seguro de eliminar el vacante "${vacante.id}"?`)) {
    try {
      await eliminarVacantePorID(vacante.id);
      console.log("vacante eliminado:", vacante);
      await cargarVacantes();
    } catch (error) {
      console.error("Error al eliminar el vacante:", error);
    }
  }
};

// Cargar vacantes cuando cambia empresa
watch(
  () => props.empresa,
  async (nuevaEmpresa) => {
    if (nuevaEmpresa?.uid) {
      await cargarVacantes();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.custom-btn {
  background-color: #8b5cf6;
  border: none;
  color: white;
  transition: background-color 0.2s ease;
}

.custom-btn:hover {
  background-color: #7c3aed;
  color: white;
}
</style>
