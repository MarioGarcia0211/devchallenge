<template>
  <Navbar />
  <div class="cont-fluid mt-3">
    <button class="btn btn-secondary" @click="goBack">
      <i class="bi bi-arrow-left"></i> Regresar
    </button>

    <h3 class="mt-3">Retos disponibles</h3>

    <div
      class="alert alert-info d-flex align-items-start rounded-3 p-3"
      role="alert"
    >
      <div>
        <h5 class="fw-semibold mb-1 text-info">¿Qué son los retos?</h5>
        <p class="mb-0 text-secondary">
          Los retos son desafíos propuestos por empresas para que los
          estudiantes puedan demostrar sus habilidades en tecnologías,
          programación y lenguajes de programación. Al participar en un reto,
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
      <div v-if="retos.length > 0" class="row">
        <div
          class="col-12 col-sm-12 col-md-6 col-lg-4 mb-4"
          v-for="reto in retos"
          :key="reto.id"
        >
          <ItemCard :item="reto" tipo="reto" :persona="persona" />
        </div>
      </div>
      <p v-else>No hay retos disponibles en este momento.</p>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { obtenerDatosUsuario } from "../services/userServices";
import { obtenerRetosConEmpresa } from "../services/challengeServices";

import Navbar from "../components/Navbar/Navbar.vue";
import Footer from "../components/Footer/Footer.vue";
import ItemCard from "../components/Shared/ItemCard.vue";

const persona = ref({});
const retos = ref([]);
const loading = ref(true);
const router = useRouter();

function goBack() {
  router.back();
}

onMounted(async () => {
  try {
    persona.value = await obtenerDatosUsuario();
    console.log("Datos del usuario:", persona.value);

    retos.value = await obtenerRetosConEmpresa();
    console.log("Retos disponibles:", retos.value);
  } catch (error) {
    console.error("Error al cargar datos:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
