<template>
  <ProfileInfo :perfil="persona" tipo="persona" />
</template>

<script setup>
import ProfileInfo from "../../Profile/ProfileInfo.vue";
defineProps({ persona: Object });
</script>
