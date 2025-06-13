<template>
  <Navbar />
  <div class="cont-fluid mt-3">hola</div>
  <Footer />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { obtenerDatosUsuario } from "../services/userServices";

import Navbar from "../components/Navbar/Navbar.vue";
import Footer from "../components/Footer/Footer.vue";
const persona = ref({
  tipoUsuario: "",
  nombres: "",
  apellidos: "",
  tipoDocumento: "",
  numeroDocumento: "",
  fotoPerfil: "",
  ciudad: "",
  pais: "",
  descripcion: "",
  tecnologias: [],
  habilidades: [],
  recursos: [],
  preferenciasTrabajo: [],
  hojaDeVida: "",
  whatsapp: "",
  correo: "",
  contrasena: "",
});
const loading = ref(true);

onMounted(async () => {
  try {
    persona.value = await obtenerDatosUsuario();
    //console.log("Datos del persona:", persona.value);
  } catch (error) {
    console.error("Error cargando persona:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
