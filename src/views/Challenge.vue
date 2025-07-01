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

    <!-- Cargando -->
    <div v-if="loading && retos.length === 0" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Retos -->
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

      <!-- Botón "Cargar más" -->
      <div class="text-center my-4" v-if="hayMas && !loading">
        <button class="btn btn-primary" @click="cargarRetos">
          Cargar más retos
        </button>
      </div>

      <!-- Spinner mientras se cargan más -->
      <div class="text-center my-3" v-if="loading && retos.length > 0">
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
import { obtenerRetosConEmpresa } from "../services/challengeServices";

import Navbar from "../components/Navbar/Navbar.vue";
import Footer from "../components/Footer/Footer.vue";
import ItemCard from "../components/Shared/ItemCard.vue";
import ScrollTopButton from "../components/Shared/ScrollTopButton.vue";

const persona = ref({});
const retos = ref([]);
const loading = ref(false);
const lastVisible = ref(null);
const hayMas = ref(true);
const retosPorPagina = 6;
const router = useRouter();

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/user-profile/profile");
  }
}

const cargarRetos = async () => {
  try {
    loading.value = true;
    const { retos: nuevosRetos, lastVisible: nuevoUltimo } =
      await obtenerRetosConEmpresa(lastVisible.value, retosPorPagina);

    if (nuevosRetos.length < retosPorPagina) {
      hayMas.value = false;
    }

    retos.value.push(...nuevosRetos);
    lastVisible.value = nuevoUltimo;
  } catch (error) {
    console.error("Error al cargar retos paginados:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    persona.value = await obtenerDatosUsuario();
    await cargarRetos();
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
