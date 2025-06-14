<template>
  <div>
    <!-- Subtitulo -->
    <h6 class="text-end">Paso 3 de 4</h6>
    <div class="row align-items-center">
      <!-- Descripción de la empresa -->
      <div class="col-md-12 mb-3">
        <label for="descripcion" class="form-label"
          >Descripción de la Organización</label
        >
        <textarea
          id="descripcion"
          class="form-control"
          :class="{ 'is-invalid': errores.descripcion }"
          v-model="form.descripcion"
          rows="3"
          @input="errores.descripcion = ''"
          @blur="validarCampo('descripcion', form.descripcion)"
        ></textarea>
      </div>

      <!-- Nombre del contacto -->
      <div class="col-md-6 mb-3">
        <label for="contacto" class="form-label">Nombre del contacto</label>
        <input
          id="contacto"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errores.contacto }"
          v-model="form.contacto"
          @input="errores.contacto = ''"
          @blur="validarCampo('contacto', form.contacto)"
        />
      </div>
    </div>

    <!-- Botones -->
    <div class="d-flex justify-content-between">
      <button class="btn btn-secondary" @click="$emit('anterior')">
        Atrás
      </button>
      <button
        class="btn btn-primary"
        @click="validarYContinuar"
        :disabled="!formularioValido"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "siguiente", "anterior"]);

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const errores = reactive({
  descripcion: "",
  contacto: "",
});

function validarCampo(nombre, valor) {
  errores[nombre] = valor.trim() ? "" : "Este campo es requerido";
}

const formularioValido = computed(() => {
  return (
    form.value.descripcion.trim() !== "" && form.value.contacto.trim() !== ""
  );
});

function validarYContinuar() {
  validarCampo("descripcion", form.value.descripcion);
  validarCampo("contacto", form.value.contacto);

  if (formularioValido.value) {
    emit("siguiente");
  }
}
</script>
