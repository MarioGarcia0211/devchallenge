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
          Las vacantes son puestos de trabajo publicados por empresas, donde se
          requieren habilidades específicas. Estas oportunidades pueden ser
          contratos laborales, pasantías o prácticas profesionales.
        </p>
      </div>
    </div>

    <!-- Cargando -->
    <div v-if="loading && vacantes.length === 0" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Vacantes -->
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

      <!-- Botón "Cargar más vacantes" -->
      <div class="text-center my-4" v-if="hayMas && !loading">
        <button class="btn btn-primary" @click="cargarVacantes">
          Cargar más vacantes
        </button>
      </div>

      <!-- Spinner mientras se cargan más -->
      <div class="text-center my-3" v-if="loading && vacantes.length > 0">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
    </div>
  </div>
  <ScrollTopButton />
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
import ScrollTopButton from "../components/Shared/ScrollTopButton.vue";

const persona = ref({});
const vacantes = ref([]);
const loading = ref(false);
const lastVisible = ref(null);
const hayMas = ref(true);
const vacantesPorPagina = 6;
const router = useRouter();

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/user-profile/profile");
  }
}

const cargarVacantes = async () => {
  try {
    loading.value = true;
    const { vacantes: nuevasVacantes, lastVisible: nuevoUltimo } =
      await obtenerVacanteConEmpresa(lastVisible.value, vacantesPorPagina);

    if (nuevasVacantes.length < vacantesPorPagina) {
      hayMas.value = false;
    }

    vacantes.value.push(...nuevasVacantes);
    lastVisible.value = nuevoUltimo;
  } catch (error) {
    console.error("Error al cargar vacantes:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    persona.value = await obtenerDatosUsuario();
    await cargarVacantes();
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
