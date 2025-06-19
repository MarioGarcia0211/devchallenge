<template>
  <Navbar />
  <div class="cont-fluid mt-3">
    <button class="btn btn-secondary" @click="goBack">
      <i class="bi bi-arrow-left"></i> Regresar
    </button>

    <h3 class="mt-3">Vacantes disponibles</h3>

    <div
      class="alert alert-danger d-flex align-items-start rounded-3 p-3"
      role="alert"
    >
      <div>
        <h5 class="fw-semibold mb-1 text-danger">¿Qué son las vacantes?</h5>
        <p class="mb-0 text-secondary">
          Los vacantes son desafíos propuestos por empresas para que los
          estudiantes puedan demostrar sus habilidades en tecnologías,
          programación y lenguajes de programación. Al participar en un vacante,
          podrás demostrar tus habilidades y conocimientos, además de tener la
          oportunidad de ser contactado por la empresa para futuras
          colaboraciones.
        </p>
      </div>
    </div>

    <div v-if="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div v-if="vacantes.length > 0" class="row">
        <div
          class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4"
          v-for="vacante in vacantes"
          :key="vacante.id"
        >
          <ItemCard :item="vacante" tipo="vacante" :persona="persona" />
        </div>
      </div>
      <p v-else>No hay vacantes disponibles en este momento.</p>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { obtenerDatosUsuario } from "../services/userServices";
import { obtenerVacanteConEmpresa } from "../services/vacantServices";

import Navbar from "../components/Navbar/Navbar.vue";
import Footer from "../components/Footer/Footer.vue";
import ItemCard from "../components/Shared/ItemCard.vue";

const persona = ref({});
const vacantes = ref([]);
const loading = ref(true);
const router = useRouter();

function goBack() {
  router.back();
}

onMounted(async () => {
  try {
    persona.value = await obtenerDatosUsuario();
    console.log("Datos del usuario:", persona.value);

    vacantes.value = await obtenerVacanteConEmpresa();
    console.log("vacantes disponibles:", vacantes.value);
  } catch (error) {
    console.error("Error al cargar datos:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
