<template>
  <Navbar />
  <div class="cont-fluid mt-3">
    <ProfileHeader
      :perfil="persona"
      tipo="persona"
      @editar-foto="abrirModalEditarFoto"
    />

    <ProfileTabs :tabs="personaTabs" />

    <!-- Contenido dinámico (según la pestaña seleccionada) -->
    <div class="mt-4">
      <router-view :persona="persona" />
    </div>
  </div>
  <Footer />
  <!-- Modal para editar foto de perfil -->
  <div
    class="modal fade"
    id="modalEditarFoto"
    tabindex="-1"
    aria-labelledby="modalEditarFotoLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalEditarFotoLabel">
            Editar Foto de Perfil
          </h5>
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
          <button class="btn btn-primary" @click="subirFoto">Guardar</button>
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

const archivoSeleccionado = ref(null);
const imagenPreview = ref(null);
const uid = ref("");

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
  const datos = await obtenerDatosUsuario();
  persona.value = { ...datos, uid: datos.uid };
});

const abrirModalEditarFoto = () => {
  const modal = new Modal(document.getElementById("modalEditarFoto"));
  modal.show();
};

const seleccionarArchivo = (e) => {
  const file = e.target.files[0];
  if (file) {
    archivoSeleccionado.value = file;
    imagenPreview.value = URL.createObjectURL(file);
  }
};

const subirFoto = async () => {
  if (!archivoSeleccionado.value) return;

  try {
    const url = await subirImagenCloudinary(archivoSeleccionado.value);
    await actualizarFotoPerfil(
      persona.value.uid,
      persona.value.tipoUsuario,
      url
    );
    persona.value.fotoPerfil = url;

    // Limpiar y cerrar modal
    archivoSeleccionado.value = null;
    imagenPreview.value = null;
    const modal = Modal.getInstance(document.getElementById("modalEditarFoto"));
    modal.hide();
  } catch (error) {
    alert("Error al subir la imagen");
    console.error(error);
  }
};
</script>
