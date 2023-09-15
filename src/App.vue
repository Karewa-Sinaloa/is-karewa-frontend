<script setup>
import popupComponent from './components/partials/popup.vue'
import notificationComponent from './components/partials/loading.vue'

</script>

<template>
  <router-view />
	<popup-component/>
	<notification-component></notification-component>
</template>

<style lang="sass">
@import "./assets/sass/base/_base.sass"
</style>
