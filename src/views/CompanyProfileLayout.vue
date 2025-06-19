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
    <ProfileTabs :tabs="companyTabs" />

    <!-- Contenido dinámico -->
    <div class="mt-4">
      <router-view :empresa="empresa" />
    </div>
  </div>
  <Footer />
  <!-- Modal para editar logo -->
  <div
    class="modal fade"
    id="modalEditarLogo"
    tabindex="-1"
    aria-labelledby="modalEditarLogoLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalEditarLogoLabel">Editar Logo</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <input
            type="file"
            @change="seleccionarArchivo"
            accept="image/*"
            class="form-control"
          />
          <div v-if="imagenPreview" class="text-center mt-3">
            <img
              :src="imagenPreview"
              class="img-thumbnail"
              style="max-height: 150px"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            Cancelar
          </button>
          <button class="btn btn-primary" @click="subirLogo">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";
import {
  obtenerDatosUsuario,
  actualizarFotoPerfil,
} from "../services/userServices";
import { subirImagenCloudinary } from "../services/cloudinary";
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

const archivoSeleccionado = ref(null);
const imagenPreview = ref(null);

const seleccionarArchivo = (e) => {
  const file = e.target.files[0];
  if (file) {
    archivoSeleccionado.value = file;
    imagenPreview.value = URL.createObjectURL(file);
  }
};

const abrirModalEditarLogo = () => {
  const modalElement = document.getElementById("modalEditarLogo");
  const modalInstance = new Modal(modalElement);
  modalInstance.show();
};

const subirLogo = async () => {
  if (!archivoSeleccionado.value) return;

  try {
    const url = await subirImagenCloudinary(archivoSeleccionado.value);
    await actualizarFotoPerfil(
      empresa.value.uid,
      empresa.value.tipoUsuario,
      url,
      "logo"
    );
    empresa.value.logo = url;

    // Limpiar y cerrar modal
    archivoSeleccionado.value = null;
    imagenPreview.value = null;

    document.activeElement.blur();

    const modalElement = document.getElementById("modalEditarLogo");
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  } catch (error) {
    alert("Error al subir el logo");
    console.error(error);
  }
};
</script>
