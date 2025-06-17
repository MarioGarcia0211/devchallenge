<template>
  <Navbar />
  <div class="cont-fluid mt-3">
    <ProfileHeader :perfil="persona" tipo="persona" />

    <ProfileTabs :tabs="personaTabs" />

    <!-- Contenido dinámico (según la pestaña seleccionada) -->
    <div class="mt-4">
      <router-view :persona="persona" />
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { obtenerDatosUsuario } from "../services/userServices";
import Navbar from "../components/Navbar/Navbar.vue";
import Footer from "../components/Footer/Footer.vue";
import ProfileHeader from "../components/Profile/ProfileHeader.vue";
import ProfileTabs from "../components/Profile/ProfileTabs.vue";

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

const personaTabs = [
  {
    label: "Perfil",
    icon: "bi bi-person-check",
    route: "/user-profile/profile",
  },
  {
    label: "Mis Retos",
    icon: "bi bi-flag-fill",
    route: "/user-profile/challenge",
  },
  {
    label: "Mis Vacantes",
    icon: "bi bi-briefcase",
    route: "/user-profile/vacant",
  },
];

onMounted(async () => {
  persona.value = await obtenerDatosUsuario();
});
</script>
