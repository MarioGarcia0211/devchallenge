<!-- ChangeStatusModal.vue -->
<template>
  <div
    class="modal fade show d-block"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Encabezado -->
        <div class="modal-header">
          <h5 class="modal-title">Cambiar estado de postulación</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- Cuerpo -->
        <div class="modal-body">
          <!-- Participante -->
          <p class="mb-2">
            <strong>Participante:</strong>
            {{ postulacion.datosUsuario.nombres }}
            {{ postulacion.datosUsuario.apellidos }}
          </p>

          <!-- Título del reto o vacante -->
          <p class="mb-3">
            <strong>{{ tipo === "vacante" ? "Vacante" : "Reto" }}:</strong>
            {{
              tipo === "vacante"
                ? postulacion.devChallenge?.nombreVacante
                : postulacion.devChallenge?.nombreReto
            }}
          </p>

          <div class="mb-3">
            <label class="form-label">Nuevo estado</label>
            <select v-model="nuevoEstado" class="form-select">
              <option disabled value="">Seleccione un estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en revisión">En revisión</option>
              <option value="en proceso">En proceso</option>
              <option value="aceptado">Aceptado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">
            Cancelar
          </button>
          <button
            class="btn btn-primary"
            :disabled="!nuevoEstado"
            @click="cambiarEstado"
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
import {
  editarPostulacionReto,
  editarPostulacionVacante,
} from "../../../services/candidateServices";
import Toast from "../../Toast/Toast.vue";

const props = defineProps({
  postulacion: Object,
  tipo: String, // 'reto' o 'vacante'
});

const emit = defineEmits(["close", "actualizado"]);

const nuevoEstado = ref(props.postulacion.estado);
const toastRef = ref(null);

const cambiarEstado = async () => {
  try {
    const idPadre =
      props.tipo === "vacante"
        ? props.postulacion.idVacante
        : props.postulacion.idReto;
    const editarFn =
      props.tipo === "vacante"
        ? editarPostulacionVacante
        : editarPostulacionReto;

    await editarFn(idPadre, props.postulacion.id, {
      estado: nuevoEstado.value,
    });

    toastRef.value?.mostrarToast(
      "success",
      "Estado actualizado correctamente."
    );

    emit("actualizado", nuevoEstado.value);
    emit("close");
  } catch (error) {
    console.error("Error al actualizar estado:", error);
  }
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
