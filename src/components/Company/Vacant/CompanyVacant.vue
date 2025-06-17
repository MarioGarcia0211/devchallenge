<template>
  <button class="btn custom-btn mb-3" @click="abrirNuevaVacante">
    Crear vacante
  </button>

  <!-- Formulario para crear/editar -->
  <CompanyForm
    :visible="mostrarModal"
    :empresa="empresa"
    tipo="vacante"
    :datos="vacanteAEditar"
    @cerrar="cerrarModal"
    @guardado="onVacanteGuardada"
  />

  <!-- Loading -->
  <div v-if="cargando" class="text-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando vacantes...</span>
    </div>
    <p class="mt-3 text-muted">Cargando vacantes...</p>
  </div>

  <!-- Lista de vacantes -->
  <div v-else-if="vacantes.length" class="row">
    <div
      class="col-12 col-sm-6 col-lg-4 mb-4 d-flex"
      v-for="vacante in vacantes"
      :key="vacante.id"
    >
      <CompanyCard
        :item="vacante"
        :empresa="empresa"
        tipo="vacante"
        @editar="editarVacante"
        @eliminar="eliminarVacante"
        @ver-detalle="verDetalle"
      />

      <CompanyDetailModal
        :visible="mostrarDetalle"
        :item="itemSeleccionado"
        tipo="vacante"
        @cerrar="mostrarDetalle = false"
      />
    </div>
  </div>

  <!-- No hay vacantes -->
  <div v-else class="text-muted text-center mt-4">
    No hay vacantes registradas.
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import CompanyForm from "../Shared/CompanyForm.vue";
import {
  obtenerVacantesPorEmpresa,
  eliminarVacantePorID,
} from "../../../services/vacantServices";
import CompanyCard from "../Shared/CompanyCard.vue";
import CompanyDetailModal from "../Shared/CompanyDetailModal.vue";

const props = defineProps({
  empresa: Object,
});

const vacantes = ref([]);
const mostrarModal = ref(false);
const cargando = ref(true);
const vacanteAEditar = ref(null);
const mostrarDetalle = ref(false);
const itemSeleccionado = ref(null);

// Abrir nueva vacante
const abrirNuevaVacante = () => {
  vacanteAEditar.value = null;
  mostrarModal.value = true;
};

const verDetalle = (item) => {
  itemSeleccionado.value = item;
  mostrarDetalle.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  vacanteAEditar.value = null;
};

const onVacanteGuardada = async () => {
  await cargarVacantes();
  cerrarModal();
};

const cargarVacantes = async () => {
  cargando.value = true;
  if (props.empresa?.uid) {
    try {
      vacantes.value = await obtenerVacantesPorEmpresa(props.empresa.uid);
    } catch (error) {
      console.error("Error al cargar vacantes:", error);
    } finally {
      cargando.value = false;
    }
  } else {
    cargando.value = false;
  }
};

const editarVacante = (vacante) => {
  vacanteAEditar.value = vacante;
  mostrarModal.value = true;
};

const eliminarVacante = async (vacante) => {
  if (confirm(`¿Estás seguro de eliminar la vacante "${vacante.nombre}"?`)) {
    try {
      await eliminarVacantePorID(vacante.id);
      await cargarVacantes();
    } catch (error) {
      console.error("Error al eliminar la vacante:", error);
    }
  }
};

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
