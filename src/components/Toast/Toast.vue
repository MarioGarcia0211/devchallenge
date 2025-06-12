<template>
  <div style="display: none"></div>
</template>

<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();

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

defineExpose({ mostrarToast });
</script>
