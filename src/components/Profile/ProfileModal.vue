<template>
  <div
    v-if="visible"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title">
            Editar
            {{ campo === "logo" ? "logo de la empresa" : "foto de perfil" }}
          </h5>
          <button type="button" class="btn-close" @click="cerrarModal" />
        </div>

        <!-- Body -->
        <div class="modal-body">
          <input
            type="file"
            accept="image/*"
            class="form-control"
            @change="seleccionarArchivo"
          />
          <div v-if="imagenPreview" class="text-center mt-4">
            <img
              :src="imagenPreview"
              class="img-thumbnail shadow-sm"
              style="max-height: 150px; border-radius: 16px"
              alt="Vista previa"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">
            Cancelar
          </button>
          <button
            class="btn btn-primary"
            @click="subirImagen"
            :disabled="!archivoSeleccionado"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Toast -->
  <Toast ref="toastRef" />
</template>

<script setup>
import { ref } from "vue";
import { subirImagenCloudinary } from "../../services/cloudinary";
import { actualizarFotoPerfil } from "../../services/userServices";
import Toast from "../Toast/Toast.vue";

const props = defineProps({
  visible: Boolean,
  usuario: Object,
  campo: String,
});
const emit = defineEmits(["cerrar", "actualizado"]);

const archivoSeleccionado = ref(null);
const imagenPreview = ref(null);
const toastRef = ref(null);

const seleccionarArchivo = (e) => {
  const file = e.target.files[0];
  if (file) {
    archivoSeleccionado.value = file;
    imagenPreview.value = URL.createObjectURL(file);
  }
};

const subirImagen = async () => {
  try {
    const url = await subirImagenCloudinary(archivoSeleccionado.value);
    await actualizarFotoPerfil(
      props.usuario.uid,
      props.usuario.tipoUsuario,
      url,
      props.campo
    );
    emit("actualizado", url);
    toastRef.value?.mostrarToast(
      "success",
      "Imagen actualizada correctamente."
    );
    cerrarModal();
  } catch (error) {
    console.error("Error al subir imagen:", error);
    alert("Hubo un error al subir la imagen.");
  }
};

const cerrarModal = () => {
  archivoSeleccionado.value = null;
  imagenPreview.value = null;
  emit("cerrar");
};
</script>

<style scoped>
.modal-content {
  border-radius: 1rem;
  overflow: hidden;
  border: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.modal-header {
  background-color: var(--color-primary);
  border-bottom: none;
  color: white;
}
.modal-body {
  background-color: #f9fafb;
}
.modal-footer {
  background-color: var(--color-gray-light);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: none;
}
.btn {
  border-radius: 999px;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
}
.modal.fade.show .modal-dialog {
  animation: fadeInUp 0.35s ease-out;
}
@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
