<template>
  <div class="section-popup">
    <div class="section-popup__container">
      <button class="btn btn__close" @click="emits('close')">
        <icon-set icon="close" />
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits } from 'vue'
  const emits = defineEmits(['close'])
</script>

<style lang="sass">
  @use "../../assets/sass/components/_section_popup_slot.sass"
</style>
