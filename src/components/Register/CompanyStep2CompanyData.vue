<template>
  <div>
    <!-- Subtitle -->
    <h6 class="text-end">Paso 2 de 4</h6>
    <div class="row align-items-center">
      <!-- Nombre de la empresa -->
      <div class="col-md-6 mb-3">
        <label for="nombreEmpresa" class="form-label">Empresa</label>
        <input
          id="nombreEmpresa"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errores.nombreEmpresa }"
          v-model="form.nombreEmpresa"
          placeholder="Nombre de la organización"
          @blur="validarCampo('nombreEmpresa', form.nombreEmpresa)"
          @input="limpiarError('nombreEmpresa')"
        />
      </div>

      <!-- Nit o Rut -->
      <div class="col-md-6 mb-3">
        <label for="nit" class="form-label">Nit o Rut</label>
        <input
          id="nit"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errores.nit }"
          v-model="form.nit"
          placeholder="Escribe el Nit o Rut sin código de verificación"
          @blur="validarCampo('nit', form.nit)"
          @input="limpiarError('nit')"
        />
      </div>

      <!-- País -->
      <div class="col-md-6 mb-3">
        <label for="pais" class="form-label">País</label>
        <select id="pais" class="form-select" v-model="form.pais">
          <option value="" disabled>Seleccione un país</option>
          <option v-for="pais in paises" :key="pais" :value="pais">
            {{ pais }}
          </option>
        </select>
      </div>

      <!-- Ciudad -->
      <div class="col-md-6 mb-3">
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

      <!-- Logo -->
      <div class="col-md-12 mb-3">
        <label for="logo" class="form-label">Logo de la empresa</label>
        <input
          id="logo"
          type="file"
          class="form-control"
          @change="handleFileChange"
        />
      </div>

      <!-- Industria -->
      <div class="col-md-6 mb-3">
        <label for="industria" class="form-label">Industria</label>
        <select id="industria" class="form-select" v-model="form.industria">
          <option value="" disabled>Seleccione una industria</option>
          <option
            v-for="industria in industrias"
            :key="industria"
            :value="industria"
          >
            {{ industria }}
          </option>
        </select>
      </div>

      <!-- Otra industria -->
      <div v-if="form.industria === 'Otros'" class="col-md-6 mb-3">
        <label for="otraIndustria" class="form-label"
          >Especifique otra industria</label
        >
        <input
          id="otraIndustria"
          type="text"
          class="form-control"
          v-model="form.otraIndustria"
        />
      </div>

      <!-- Página web -->
      <div class="col-md-6 mb-3">
        <label for="paginaWeb" class="form-label">Página web</label>
        <input
          id="paginaWeb"
          type="url"
          class="form-control"
          placeholder="https://"
          v-model="form.paginaWeb"
        />
      </div>
    </div>

    <!-- Botones -->
    <div class="d-flex justify-content-between mt-4">
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
  <!-- Toast -->
  <Toast ref="toastRef" />
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { verificarNitUnico } from "../../services/authServices";
import { subirImagenCloudinary } from "../../services/cloudinary.js";
import Toast from "../Toast/Toast.vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "siguiente", "anterior"]);
const toastRef = ref(null);

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const errores = reactive({
  nombreEmpresa: "",
  nit: "",
  ciudad: "",
});

function handleFileChange(event) {
  const file = event.target.files[0];
  form.value.logo = file;
}

function validarCampo(nombre, valor) {
  if (!valor.trim()) {
    errores[nombre] = "Este campo es requerido";
  } else {
    errores[nombre] = "";
  }
}

function limpiarError(campo) {
  errores[campo] = "";
}

async function validarYContinuar() {
  validarCampo("nombreEmpresa", form.value.nombreEmpresa);
  validarCampo("nit", form.value.nit);
  validarCampo("ciudad", form.value.ciudad);

  if (!formularioValido.value) return;

  const existe = await verificarNitUnico(form.value.nit);

  if (existe) {
    errores.nit = "Este Nit o Rut ya está registrado.";
    toastRef.value?.mostrarToast("error", errores.nit);
    return;
  }

  if (form.value.logo instanceof File) {
    try {
      const urlLogo = await subirImagenCloudinary(form.value.logo);
      form.value.logo = urlLogo;
    } catch (error) {
      console.error(error);
      toastRef.value?.mostrarToast(
        "error",
        "No se pudo subir el logo de la empresa"
      );
      return;
    }
  }

  emit("siguiente");
}

const formularioValido = computed(() => {
  return (
    form.value.nombreEmpresa.trim() !== "" &&
    form.value.nit.trim() !== "" &&
    form.value.ciudad.trim() !== "" &&
    form.value.pais.trim() !== "" &&
    form.value.industria.trim() !== ""
  );
});

const paises = ["Colombia", "Argentina", "México", "Perú", "Chile", "Ecuador"];

const industrias = [
  "Tecnología",
  "Finanzas y Banca",
  "Retail y Comercio Electrónico",
  "Salud y Biotecnología",
  "Alimentos y Bebidas",
  "Construcción e Infraestructura",
  "Energía y Servicios Públicos",
  "Transporte y Logística",
  "Medios de Comunicación y Entretenimiento",
  "Automotriz",
  "Turismo y Hospitalidad",
  "Educación y Formación",
  "Inmobiliario",
  "Manufactura",
  "Marketing y Publicidad",
  "Otros",
];
</script>

<style scoped>
.form-control,
.form-select {
  height: 45px;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
}
</style>
