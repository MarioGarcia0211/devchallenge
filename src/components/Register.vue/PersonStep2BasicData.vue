<template>
  <div>
    <!-- Subtitulo -->
    <h6 class="text-end">Paso 2 de 4</h6>
    <div class="row align-items-center">
      <!-- Nombre(s) -->
      <div class="col-md-6 mb-2">
        <label for="nombres" class="form-label">Nombre(s)</label>
        <input
          id="nombres"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errores.nombres }"
          v-model="form.nombres"
          @blur="validarCampo('nombres', form.nombres)"
          @input="limpiarError('nombres')"
        />
      </div>

      <!-- Apellidos -->
      <div class="col-md-6 mb-2">
        <label for="apellidos" class="form-label">Apellidos</label>
        <input
          id="apellidos"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errores.apellidos }"
          v-model="form.apellidos"
          @blur="validarCampo('apellidos', form.apellidos)"
          @input="limpiarError('apellidos')"
        />
      </div>

      <!-- Tipo de documento -->
      <div class="col-md-6 mb-2">
        <label for="tipoDocumento" class="form-label">Tipo de Documento</label>
        <select
          id="tipoDocumento"
          class="form-select"
          v-model="form.tipoDocumento"
        >
          <option disabled value="">Selecciona un tipo</option>
          <option v-for="tipo in tiposDocumento" :key="tipo" :value="tipo">
            {{ tipo }}
          </option>
        </select>
      </div>

      <!-- Número de documento -->
      <div class="col-md-6 mb-2">
        <label for="numeroDocumento" class="form-label"
          >Número de documento</label
        >
        <input
          id="numeroDocumento"
          type="number"
          class="form-control"
          :class="{ 'is-invalid': errores.numeroDocumento }"
          v-model="form.numeroDocumento"
          @blur="validarCampo('numeroDocumento', form.numeroDocumento)"
          @input="limpiarError('numeroDocumento')"
        />
      </div>

      <!-- Foto de perfil -->
      <div class="col-md-12 mb-2">
        <label for="fotoPerfil" class="form-label">Foto de perfil</label>
        <input
          id="fotoPerfil"
          type="file"
          class="form-control"
          @change="handleFoto"
        />
      </div>

      <!-- Ciudad -->
      <div class="col-md-6 mb-2">
        <label for="ciudad" class="form-label">Ciudad</label>
        <input
          id="ciudad"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errores.ciudad }"
          v-model="form.ciudad"
          @blur="validarCampo('ciudad', form.ciudad)"
          @input="limpiarError('ciudad')"
        />
      </div>

      <!-- País -->
      <div class="col-md-6 mb-2">
        <label for="pais" class="form-label">País</label>
        <select id="pais" class="form-select" v-model="form.pais">
          <option disabled value="">Selecciona un país</option>
          <option v-for="pais in paises" :key="pais" :value="pais">
            {{ pais }}
          </option>
        </select>
      </div>
    </div>

    <!-- Botones -->
    <div class="d-flex justify-content-between mt-4">
      <button class="btn btn-secondary" @click="$emit('anterior')">
        Atrás
      </button>
      <button
        class="btn btn-primary"
        :disabled="!formularioValido"
        @click="validarYContinuar"
      >
        Siguiente
      </button>
    </div>
  </div>

  <!-- Toast -->
  <Toast ref="toastRef" />
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import Toast from "../Toast/Toast.vue";
import { verificarDocumentoUnico } from "../../services/authServices";
import { subirImagenCloudinary } from "../../services/cloudinary.js";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "siguiente", "anterior"]);
const toastRef = ref(null);

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const errores = reactive({
  nombres: "",
  apellidos: "",
  numeroDocumento: "",
  ciudad: "",
});

function handleFoto(e) {
  const file = e.target.files[0];
  console.log(file);
  form.value.fotoPerfil = file;
}

function validarCampo(nombre, valor) {
  if (!valor || !valor.toString().trim()) {
    errores[nombre] = "Este campo es requerido";
  } else {
    errores[nombre] = "";
  }
}

function limpiarError(campo) {
  errores[campo] = "";
}

async function validarYContinuar() {
  validarCampo("nombres", form.value.nombres);
  validarCampo("apellidos", form.value.apellidos);
  validarCampo("numeroDocumento", form.value.numeroDocumento);
  validarCampo("ciudad", form.value.ciudad);

  if (!formularioValido.value) return;

  const existe = await verificarDocumentoUnico(form.value.numeroDocumento);

  if (existe) {
    errores.numeroDocumento = "Este número de documento ya está registrado.";
    toastRef.value?.mostrarToast("error", errores.numeroDocumento);
    return;
  }

  if (form.value.fotoPerfil instanceof File) {
    try {
      const urlImagen = await subirImagenCloudinary(form.value.fotoPerfil);
      form.value.fotoPerfil = urlImagen;
    } catch (error) {
      toastRef.value?.mostrarToast(
        "error",
        "No se pudo subir la foto de perfil"
      );
      return;
    }
  }

  emit("siguiente");
}

const formularioValido = computed(() => {
  return (
    form.value.nombres?.trim() &&
    form.value.apellidos?.trim() &&
    form.value.numeroDocumento?.toString().trim() &&
    form.value.tipoDocumento &&
    form.value.pais &&
    form.value.ciudad?.trim()
  );
});

const tiposDocumento = [
  "Cédula de Ciudadanía",
  "Tarjeta de Identidad",
  "Cédula de Extranjería",
  "Pasaporte",
];

const paises = ["Colombia", "Argentina", "México", "Perú", "Chile", "Ecuador"];
</script>

<style scoped>
.form-control:focus,
.form-select:focus {
  border-color: #8b5cf6;
  outline: none;
  box-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
}

.form-select:hover {
  border-color: #8b5cf6;
  box-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.btn-primary:disabled {
  background-color: #8b5cf6 !important;
  border: none;
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
