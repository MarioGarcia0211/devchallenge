<template>
  <Navbar />

  <div class="cont-fluid mt-3">
    <!-- Header -->
    <ProfileHeader
      :perfil="empresa"
      tipo="empresa"
      @editar-foto="abrirModalEditarLogo"
    />

    <!-- Tabs -->
    <div class="mt-4">
      <ProfileTabs :tabs="companyTabs" />
    </div>

    <!-- Contenido dinámico -->
    <div class="mt-4">
      <router-view :empresa="empresa" />
    </div>
  </div>

  <!-- Modal reutilizable para empresa -->
  <ProfileModal
    :visible="mostrarModalLogo"
    :usuario="empresa"
    campo="logo"
    @cerrar="cerrarModalEditarLogo"
    @actualizado="actualizarLogo"
  />

  <ScrollTopButton />
  <Footer />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { obtenerDatosUsuario } from "../services/userServices";
import Navbar from "../components/Navbar/Navbar.vue";
import Footer from "../components/Footer/Footer.vue";
import ProfileHeader from "../components/Profile/ProfileHeader.vue";
import ProfileTabs from "../components/Profile/ProfileTabs.vue";
import ProfileModal from "../components/Profile/ProfileModal.vue";
import ScrollTopButton from "../components/Shared/ScrollTopButton.vue";

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
    label: "Postulaciones",
    icon: "bi bi-people-fill",
    children: [
      {
        label: "Retos",
        route: "/company-profile/candidatesChallengue",
      },
      {
        label: "Vacantes",
        route: "/company-profile/candidatesVacant",
      },
    ],
  },
];

onMounted(async () => {
  empresa.value = await obtenerDatosUsuario();
});

const mostrarModalLogo = ref(false);

const abrirModalEditarLogo = () => {
  mostrarModalLogo.value = true;
};

const cerrarModalEditarLogo = () => {
  mostrarModalLogo.value = false;
};

const actualizarLogo = (url) => {
  empresa.value.logo = url;
};
</script>
