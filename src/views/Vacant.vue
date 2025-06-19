<template>
  <Navbar />
  <div class="cont-fluid mt-3">
    <button class="btn btn-secondary" @click="goBack">
      <i class="bi bi-arrow-left"></i> Regresar
    </button>

    <h3 class="mt-3">Vacantes disponibles</h3>

    <div
      class="alert alert-info d-flex align-items-start rounded-3 p-3"
      role="alert"
    >
      <div>
        <h5 class="fw-semibold mb-1 text-info">¿Qué son las vacantes?</h5>
        <p class="mb-0 text-secondary">
          Las vacantes son puestos de trabajo que las empresas han publicado, en
          los cuales se requiere de habilidades específicas para poder ser un
          candidato ideal. Estos pueden ser contratos de trabajo, pasantías,
          prácticas profesionales, entre otros. Dependiendo de tus habilidades y
          experiencia, podrás postularte a las vacantes que más se ajusten a tus
          intereses.
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

<style scoped>
.btn-secondary {
  background-color: var(--color-gray);
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  color: var(--color-black);
}

.btn-secondary:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
}

h3 {
  font-weight: 700;
  color: var(--color-primary-dark);
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.alert-info {
  background-color: #f0f4ff;
  border-left: 6px solid var(--color-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.alert-info h5 {
  color: var(--color-primary-dark);
}

.alert-info p {
  font-size: 0.95rem;
  color: var(--color-gray-dark);
}

.spinner-border {
  margin-top: 2rem;
  width: 3rem;
  height: 3rem;
}

.row {
  margin-top: 1rem;
}

p {
  color: var(--color-gray-dark);
  font-size: 1rem;
}
</style>
