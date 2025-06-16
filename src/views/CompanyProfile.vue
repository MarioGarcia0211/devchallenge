<template>
  <Navbar />
  <div class="cont-fluid mt-3">
    <ProfileHeader :perfil="empresa" tipo="empresa" />

    <ProfileTabs :tabs="companyTabs" />
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

const empresa = ref({
  tipoUsuario: "",
  tipoEmpresa: "",
  nombreEmpresa: "",
  nit: "",
  ciudad: "",
  pais: "",
  industria: "",
  otraIndustria: "",
  logo: "",
  paginaWeb: "",
  descripcion: "",
  contacto: "",
  whatsapp: "",
  correo: "",
});

const companyTabs = [
  {
    label: "Perfil",
    icon: "bi bi-person-check",
    route: "/company-profile/profile",
  },
  {
    label: "Retos",
    icon: "bi bi-flag-fill",
    route: "/company-profile/challenge",
  },
  {
    label: "Vacantes",
    icon: "bi bi-briefcase",
    route: "/company-profile/vacant",
  },
  {
    label: "Candidatos",
    icon: "bi bi-people-fill",
    route: "/company-profile/candidatos",
  },
];

onMounted(async () => {
  empresa.value = await obtenerDatosUsuario();
});
</script>
