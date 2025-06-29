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
          <p>
            <strong>Participante:</strong>
            {{ postulacion.datosUsuario.nombres }}
            {{ postulacion.datosUsuario.apellidos }}
          </p>

          <div class="mb-3">
            <label class="form-label">Nuevo estado</label>
            <select v-model="nuevoEstado" class="form-select">
              <option disabled value="">Seleccione un estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en proceso">En proceso</option>
              <option value="en revisión">En revisión</option>
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
</template>

<script setup>
import { ref } from "vue";
import {
  editarPostulacionReto,
  editarPostulacionVacante,
} from "../../../services/candidateServices";

const props = defineProps({
  postulacion: Object,
  tipo: String, // 'reto' o 'vacante'
});

const emit = defineEmits(["close", "actualizado"]);

const nuevoEstado = ref(props.postulacion.estado);

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

    emit("actualizado", nuevoEstado.value);
    emit("close");
  } catch (error) {
    console.error("Error al actualizar estado:", error);
  }
};
</script>
