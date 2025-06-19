<template>
  <div>
    <!-- Subtitulo -->
    <h6 class="text-end">Paso 4 de 4</h6>
    <div class="row align-items-center">
      <!-- WhatsApp -->
      <div class="col-md-6 mb-3">
        <label for="whatsapp" class="form-label">WhatsApp</label>
        <input
          id="whatsapp"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errores.whatsapp }"
          placeholder="+57"
          v-model="form.whatsapp"
          @input="errores.whatsapp = ''"
          @blur="validarCampo('whatsapp', form.whatsapp)"
        />
      </div>

      <!-- Correo -->
      <div class="col-md-6 mb-3">
        <label for="correo" class="form-label">Correo electrónico</label>
        <input
          id="correo"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errores.correo }"
          v-model="form.correo"
          @input="errores.correo = ''"
          @blur="validarCampo('correo', form.correo)"
        />
      </div>

      <div class="col-md-6 mb-2">
        <label for="contrasena" class="form-label">Contraseña</label>
        <div class="input-group">
          <input
            id="contrasena"
            :type="mostrarContrasena ? 'text' : 'password'"
            class="form-control"
            :class="{ 'is-invalid': errores.contrasena }"
            v-model="form.contrasena"
            placeholder="Mínimo 8 caracteres"
            @input="errores.contrasena = ''"
            @blur="validarCampo('contrasena', form.contrasena)"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="mostrarContrasena = !mostrarContrasena"
            :aria-label="
              mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'
            "
          >
            <i :class="mostrarContrasena ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
      </div>

      <!-- Confirmar contraseña -->
      <div class="col-md-6 mb-2">
        <label for="confirmarContrasena" class="form-label"
          >Confirmar contraseña</label
        >
        <div class="input-group">
          <input
            id="confirmarContrasena"
            :type="mostrarConfirmarContrasena ? 'text' : 'password'"
            class="form-control"
            :class="{
              'is-invalid':
                errores.confirmarContrasena || contrasenasNoCoinciden,
            }"
            v-model="confirmarContrasena"
            placeholder="Mínimo 8 caracteres"
            @input="errores.confirmarContrasena = ''"
            @blur="validarCampo('confirmarContrasena', confirmarContrasena)"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="mostrarConfirmarContrasena = !mostrarConfirmarContrasena"
            :aria-label="
              mostrarConfirmarContrasena
                ? 'Ocultar contraseña'
                : 'Mostrar contraseña'
            "
          >
            <i
              :class="
                mostrarConfirmarContrasena ? 'bi bi-eye-slash' : 'bi bi-eye'
              "
            ></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Botones -->
    <div class="d-flex justify-content-between">
      <button class="btn btn-secondary" @click="$emit('anterior')">
        Atrás
      </button>
      <button
        class="btn btn-primary"
        @click="validarYEnviar"
        :disabled="!formularioValido"
      >
        Registrarse
      </button>
    </div>
  </div>

  <!-- Toast -->
  <Toast ref="toastRef" />
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import Toast from "../Toast/Toast.vue";
import { verificarCorreoUnico } from "../../services/authServices";

const confirmarContrasena = ref("");
const mostrarContrasena = ref(false);
const mostrarConfirmarContrasena = ref(false);
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "enviar", "anterior"]);
const toastRef = ref(null);

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const errores = reactive({
  whatsapp: "",
  correo: "",
  contrasena: "",
  confirmarContrasena: "",
});

function validarCampo(nombre, valor) {
  if (!valor.trim()) {
    errores[nombre] = "Este campo es requerido";
  } else if (nombre === "correo" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
    errores[nombre] = "Debe ser un correo válido";
  } else if (
    (nombre === "contrasena" || nombre === "confirmarContrasena") &&
    valor.length < 8
  ) {
    errores[nombre] = "Debe tener al menos 8 caracteres";
  } else {
    errores[nombre] = "";
  }
}

const contrasenasNoCoinciden = computed(() => {
  return (
    confirmarContrasena.value &&
    form.value.contrasena !== confirmarContrasena.value
  );
});

const formularioValido = computed(() => {
  return (
    form.value.whatsapp.trim() !== "" &&
    form.value.correo.includes("@") &&
    form.value.contrasena.length >= 8 &&
    confirmarContrasena.value.length >= 8 &&
    form.value.contrasena === confirmarContrasena.value &&
    Object.values(errores).every((e) => e === "")
  );
});

async function validarYEnviar() {
  validarCampo("whatsapp", form.value.whatsapp);
  validarCampo("correo", form.value.correo);
  validarCampo("contrasena", form.value.contrasena);
  validarCampo("confirmarContrasena", confirmarContrasena.value);

  if (!formularioValido.value) return;
  const existe = await verificarCorreoUnico(form.value.correo);

  if (existe) {
    errores.correo = "Este correo ya está registrado.";
    toastRef.value?.mostrarToast("error", errores.correo);
    return;
  }

  emit("enviar");
}
</script>
