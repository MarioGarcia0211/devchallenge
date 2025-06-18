<template>
  <button class="btn custom-btn mb-3 shadow" @click="abrirNuevoReto">
    Crear reto
  </button>

  <!-- Modal para crear o editar reto -->
  <CompanyForm
    :visible="mostrarModal"
    :empresa="empresa"
    tipo="reto"
    :datos="retoAEditar"
    @cerrar="cerrarModal"
    @guardado="onRetoGuardado"
  />

  <!-- Loading -->
  <div v-if="cargando" class="text-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando retos...</span>
    </div>
    <p class="mt-3 text-muted">Cargando retos...</p>
  </div>

  <!-- Lista o mensaje de "no hay retos" -->
  <div v-else>
    <div v-if="retos.length" class="row">
      <div
        class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4"
        v-for="reto in retos"
        :key="reto.id"
      >
        <CompanyCard
          :item="reto"
          :empresa="empresa"
          tipo="reto"
          @editar="editarReto"
          @eliminar="eliminarReto"
          @ver-detalle="verDetalle"
        />
      </div>
    </div>

    <div v-else class="text-muted text-center mt-4">
      No hay retos registrados.
    </div>
  </div>

  <!-- Modal de detalle -->
  <CompanyDetailModal
    :visible="mostrarDetalle"
    :item="itemSeleccionado"
    tipo="reto"
    @cerrar="mostrarDetalle = false"
  />
</template>

<script setup>
import { ref, watch } from "vue";
import {
  obtenerRetosPorEmpresa,
  eliminarRetoPorID,
} from "../../../services/challengeServices";
import CompanyForm from "../Shared/CompanyForm.vue";
import CompanyCard from "../Shared/CompanyCard.vue";
import CompanyDetailModal from "../Shared/CompanyDetailModal.vue";

const props = defineProps({
  empresa: Object,
});

const retos = ref([]);
const mostrarModal = ref(false);
const retoAEditar = ref(null);
const cargando = ref(true);
const mostrarDetalle = ref(false);
const itemSeleccionado = ref(null);

// Abrir nuevo reto
const abrirNuevoReto = () => {
  retoAEditar.value = null;
  mostrarModal.value = true;
};

const verDetalle = (item) => {
  itemSeleccionado.value = item;
  mostrarDetalle.value = true;
};

// Cerrar modal
const cerrarModal = () => {
  mostrarModal.value = false;
  retoAEditar.value = null;
};

// Recargar lista tras guardar reto
const onRetoGuardado = async () => {
  await cargarRetos();
  cerrarModal();
};

// Cargar retos por empresa
const cargarRetos = async () => {
  cargando.value = true;
  if (props.empresa?.uid) {
    try {
      retos.value = await obtenerRetosPorEmpresa(props.empresa.uid);
      console.log(retos.value);
    } catch (error) {
      console.error("Error al cargar retos:", error);
    } finally {
      cargando.value = false;
    }
  } else {
    cargando.value = false;
  }
};

// Editar reto
const editarReto = (reto) => {
  retoAEditar.value = reto;
  mostrarModal.value = true;
};

// Eliminar reto
const eliminarReto = async (reto) => {
  if (confirm(`¿Estás seguro de eliminar el reto "${reto.nombre}"?`)) {
    try {
      await eliminarRetoPorID(reto.id);
      await cargarRetos();
    } catch (error) {
      console.error("Error al eliminar el reto:", error);
    }
  }
};

// Reaccionar a cambios en la empresa
watch(
  () => props.empresa,
  async (nuevaEmpresa) => {
    if (nuevaEmpresa?.uid) {
      await cargarRetos();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.custom-btn {
  background-color: var(--color-primary);
  color: white;
}

.custom-btn:hover {
  background-color: var(--color-primary-dark);
  color: white;
}
</style>
