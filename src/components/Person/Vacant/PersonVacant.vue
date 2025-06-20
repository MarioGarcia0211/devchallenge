<template>
  <div>
    <!-- Tabs -->
    <PersonTabs
      :tabs="vacanteTabs"
      :componentsMap="vacanteComponents"
      :persona="persona"
      tipo="vacante"
      initialTab="pendientes"
    />
  </div>
</template>
<script setup>
import PersonAccepted from "../Shared/PersonAccepted.vue";
import PersonPending from "../Shared/PersonPending.vue";
import PersonProcess from "../Shared/PersonProcess.vue";
import PersonRejected from "../Shared/PersonRejected.vue";
import PersonReview from "../Shared/PersonReview.vue";
import PersonTabs from "../Shared/PersonTabs.vue";

const props = defineProps({
  persona: Object,
  tipo: String,
});

const vacanteTabs = [
  { name: "pendientes", label: "Pendientes" },
  { name: "revision", label: "En revisión" },
  { name: "proceso", label: "En proceso" },
  { name: "aceptado", label: "Aceptado" },
  { name: "rechazado", label: "Rechazado" },
];

const vacanteComponents = {
  pendientes: PersonPending,
  revision: PersonReview,
  proceso: PersonProcess,
  aceptado: PersonAccepted,
  rechazado: PersonRejected,
};
</script>
