<template>
  <CandidateTabs
    :tabs="retoTabs"
    :componentsMap="retoComponents"
    :empresa="empresa"
    tipo="reto"
    initialTab="pendientes"
  />
</template>
<script setup>
import CandidateAccepted from "../Shared/CandidateAccepted.vue";
import CandidatePending from "../Shared/CandidatePending.vue";
import CandidateProcess from "../Shared/CandidateProcess.vue";
import CandidateRejected from "../Shared/CandidateRejected.vue";
import CandidateReview from "../Shared/CandidateReview.vue";
import CandidateTabs from "../Shared/CandidateTabs.vue";

const props = defineProps({
  empresa: Object,
  tipo: String,
});

const retoTabs = [
  { name: "pendientes", label: "Pendientes" },
  { name: "revision", label: "En revisión" },
  { name: "proceso", label: "En proceso" },
  { name: "aceptado", label: "Aceptado" },
  { name: "rechazado", label: "Rechazado" },
];

const retoComponents = {
  pendientes: CandidatePending,
  revision: CandidateReview,
  proceso: CandidateProcess,
  aceptado: CandidateAccepted,
  rechazado: CandidateRejected,
};
</script>
<style></style>
