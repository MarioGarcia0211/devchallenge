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
          <h5 class="modal-title text-white">Confirmar eliminación</h5>
          <button type="button" class="btn-close" @click="cancelar" />
        </div>

        <!-- Body -->
        <div class="modal-body text-center">
          <i class="bi bi-exclamation-triangle-fill text-danger fs-2 mb-3"></i>
          <p class="mb-0">{{ mensaje }}</p>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelar">Cancelar</button>
          <button class="btn btn-danger" @click="confirmar">
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  mensaje: {
    type: String,
    default:
      "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.",
  },
});

const emit = defineEmits(["confirmar", "cancelar"]);

const confirmar = () => emit("confirmar");
const cancelar = () => emit("cancelar");
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
}
.modal-body {
  background-color: #f9fafb;
  font-size: 1rem;
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
.btn-danger {
  background-color: var(--color-danger);
  border-color: var(--color-danger);
}
.btn-danger:hover {
  background-color: darkred;
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
