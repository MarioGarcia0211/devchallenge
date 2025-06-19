<template>
  <div
    v-if="visible"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header align-items-start flex-column">
          <div class="d-flex align-items-center w-100 mb-2">
            <img
              :src="item.empresa.logo"
              alt="Logo empresa"
              class="img-fluid object-fit-cover me-2"
              style="width: 80px; height: 80px"
            />
            <div>
              <h5 class="modal-title mb-0">{{ nombreItem }}</h5>
              <small class="text-muted">
                Publicado por <strong>{{ item.empresa.nombreEmpresa }}</strong>
              </small>
              <br />
              <span class="text-muted me-1">Estado:</span>
              <span
                class="badge"
                :class="{
                  'bg-success': item.estado.toLowerCase() === 'abierto',
                  'bg-danger': item.estado.toLowerCase() === 'cerrado',
                  'bg-secondary':
                    item.estado.toLowerCase() !== 'abierto' &&
                    item.estado.toLowerCase() !== 'cerrado',
                }"
              >
                {{ item.estado }}
              </span>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <p><strong>Descripción:</strong></p>
          <div>{{ item.descripcion }}</div>

          <!-- Lenguajes -->
          <p class="mt-3"><strong>Lenguajes:</strong></p>
          <div>
            <span
              v-for="(lang, index) in mostrarLenguajesCompletos
                ? item.lenguajes
                : item.lenguajes.slice(0, 3)"
              :key="'lang-' + index"
              class="badge me-1 soft-badge"
            >
              {{ lang }}
            </span>
            <span
              v-if="item.lenguajes.length > 3"
              class="badge soft-badge extra-badge"
              @click="mostrarLenguajesCompletos = !mostrarLenguajesCompletos"
            >
              {{
                mostrarLenguajesCompletos
                  ? "Ver menos"
                  : "+" + (item.lenguajes.length - 3)
              }}
            </span>
          </div>

          <!-- Tecnologías -->
          <p class="mt-3"><strong>Tecnologías:</strong></p>
          <div>
            <span
              v-for="(tec, index) in mostrarTecnologiasCompletas
                ? item.tecnologias
                : item.tecnologias.slice(0, 3)"
              :key="'tec-' + index"
              class="badge me-1 soft-badge"
            >
              {{ tec }}
            </span>
            <span
              v-if="item.tecnologias.length > 3"
              class="badge soft-badge extra-badge"
              @click="
                mostrarTecnologiasCompletas = !mostrarTecnologiasCompletas
              "
            >
              {{
                mostrarTecnologiasCompletas
                  ? "Ver menos"
                  : "+" + (item.tecnologias.length - 3)
              }}
            </span>
          </div>

          <!-- Programación -->
          <p class="mt-3"><strong>Programación:</strong></p>
          <div>
            <span
              v-for="(prog, index) in mostrarProgramacionCompleta
                ? item.programacion
                : item.programacion.slice(0, 3)"
              :key="'prog-' + index"
              class="badge me-1 soft-badge"
            >
              {{ prog }}
            </span>
            <span
              v-if="item.programacion.length > 3"
              class="badge soft-badge extra-badge"
              @click="
                mostrarProgramacionCompleta = !mostrarProgramacionCompleta
              "
            >
              {{
                mostrarProgramacionCompleta
                  ? "Ver menos"
                  : "+" + (item.programacion.length - 3)
              }}
            </span>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">Cerrar</button>

          <button
            v-if="!estaRegistrado"
            class="btn btn-primary"
            @click="participar"
            :disabled="item.estado.toLowerCase() === 'cerrado'"
            :title="
              item.estado.toLowerCase() === 'cerrado'
                ? 'No puedes participar en un ' + tipo + ' cerrado'
                : ''
            "
          >
            Participar
          </button>

          <button v-else class="btn btn-success" disabled>Registrado</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import {
  verificarRegistro,
  registrarParticipacion,
} from "../../services/challengeServices"; // debe manejar retos y vacantes

const props = defineProps({
  visible: Boolean,
  item: Object,
  tipo: String, // "reto" o "vacante"
  persona: Object,
});

const emit = defineEmits(["cerrar", "registroExitoso"]);

const mostrarLenguajesCompletos = ref(false);
const mostrarTecnologiasCompletas = ref(false);
const mostrarProgramacionCompleta = ref(false);
const estaRegistrado = ref(false);

const cerrarModal = () => {
  emit("cerrar");
  mostrarLenguajesCompletos.value = false;
  mostrarTecnologiasCompletas.value = false;
  mostrarProgramacionCompleta.value = false;
  estaRegistrado.value = false;
};

const nombreItem = computed(() =>
  props.tipo === "reto" ? props.item?.nombreReto : props.item?.nombreVacante
);

watch(
  () => [props.visible, props.item, props.persona],
  async ([visible, item, persona]) => {
    if (visible && item && persona) {
      try {
        estaRegistrado.value = await verificarRegistro(
          item.id,
          persona.uid,
          props.tipo
        );
      } catch (error) {
        console.error("Error verificando registro:", error);
      }
    } else {
      estaRegistrado.value = false;
    }
  },
  { immediate: true }
);

const participar = async () => {
  const uid = props.persona?.uid;
  const id = props.item?.id;

  try {
    if (estaRegistrado.value) {
      alert("Ya estás registrado en este " + props.tipo + ".");
      return;
    }

    if (props.item?.estado?.toLowerCase() === "cerrado") {
      alert("Este " + props.tipo + " está cerrado. No puedes registrarte.");
      return;
    }

    await registrarParticipacion(id, uid, props.tipo);
    emit("registroExitoso");
    estaRegistrado.value = true;
    alert("Te has registrado exitosamente.");
  } catch (error) {
    console.error("Error al participar:", error);
    alert("Ocurrió un error al registrarte.");
  }
};
</script>

<style scoped>
.soft-badge {
  background-color: #f1f5f9;
  color: #334155;
  padding: 0.35em 0.6em;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}
.extra-badge {
  background-color: #ede9fe;
  color: #6b21a8;
  cursor: pointer;
}
</style>
