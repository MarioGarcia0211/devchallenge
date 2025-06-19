<template>
  <Navbar />

  <div class="cont-fluid mt-3">
    <ProfileHeader
      :perfil="persona"
      tipo="persona"
      @editar-foto="abrirModalEditarFoto"
    />

    <ProfileTabs :tabs="personaTabs" />

    <div class="mt-4">
      <router-view :persona="persona" />
    </div>
  </div>

  <!-- Modal reutilizable para persona -->
  <ProfileModal
    :visible="mostrarModal"
    :usuario="persona"
    campo="fotoPerfil"
    @cerrar="cerrarModal"
    @actualizado="actualizarImagen"
  />

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

// Datos del usuario tipo persona
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

// Tabs
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

// Cargar datos al montar
onMounted(async () => {
  persona.value = await obtenerDatosUsuario();
});

// === MODAL ===
const mostrarModal = ref(false);

const abrirModalEditarFoto = () => {
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const actualizarImagen = (url) => {
  persona.value.fotoPerfil = url;
};
</script>
