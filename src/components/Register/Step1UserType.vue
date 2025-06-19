<template>
  <div>
    <!-- Subtitulo -->
    <h6 class="text-end">Paso 1 de 4</h6>

    <!-- Tipo de usuario -->
    <label class="form-label">Selecciona tu tipo de usuario:</label>

    <!-- Persona -->
    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        value="persona"
        v-model="tipo"
        id="persona"
      />
      <label class="form-check-label" for="persona">Persona</label>
    </div>

    <!-- Empresa -->
    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        value="empresa"
        v-model="tipo"
        id="empresa"
      />
      <label class="form-check-label" for="empresa">Empresa</label>
    </div>

    <!-- Tipo de empresa (solo si se selecciona 'empresa') -->
    <div v-if="tipo === 'empresa'" class="mt-3">
      <label class="form-label">Selecciona el tipo de empresa:</label>
      <div class="form-check" v-for="opcion in tiposEmpresa" :key="opcion">
        <input
          class="form-check-input"
          type="radio"
          :id="`tipo-${opcion}`"
          :value="opcion"
          v-model="tipoEmpresa"
        />
        <label class="form-check-label" :for="`tipo-${opcion}`">{{
          opcion
        }}</label>
      </div>
    </div>

    <!-- Botones -->
    <div class="d-flex justify-content-end mt-3">
      <button
        class="btn btn-primary"
        :disabled="!tipo || (tipo === 'empresa' && !tipoEmpresa)"
        @click="emitirSeleccion"
      >
        Continuar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["seleccionar-tipo"]);

const tipo = ref("");
const tipoEmpresa = ref("");

const tiposEmpresa = ["Startup", "Empresa Tradicional", "Gobierno"];

const emitirSeleccion = () => {
  emit("seleccionar-tipo", {
    tipo: tipo.value,
    tipoEmpresa: tipo.value === "empresa" ? tipoEmpresa.value : null,
  });
};
</script>
