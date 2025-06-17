<template>
  <ProfileInfo :perfil="empresa" tipo="empresa" />
</template>

<script setup>
import ProfileInfo from "../../Profile/ProfileInfo.vue";
defineProps({ empresa: Object });
</script>
