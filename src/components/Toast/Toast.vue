<template>
  <!-- Componente sin interfaz visible -->
  <div style="display: none"></div>
</template>

<script setup>
import { useToast } from "vue-toastification";

// Instancia de toast
const toast = useToast();

// Función expuesta para usar desde otros componentes
const mostrarToast = (tipo = "info", mensaje = "", opciones = {}) => {
  const config = {
    timeout: 4000,
    closeOnClick: true,
    pauseOnHover: true,
    ...opciones,
  };

  switch (tipo) {
    case "success":
      toast.success(mensaje, config);
      break;
    case "error":
      toast.error(mensaje, config);
      break;
    case "warning":
      toast.warning(mensaje, config);
      break;
    default:
      toast.info(mensaje, config);
  }
};

// Expone la función al padre (para usar con ref="toastRef")
defineExpose({ mostrarToast });
</script>
