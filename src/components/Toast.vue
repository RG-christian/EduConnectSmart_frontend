<template>
  <transition name="fade">
    <div
        v-if="visible"
        class="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  message: string
}>()

const visible = ref(false)

watch(() => props.show, (newVal) => {
  if (newVal) {
    visible.value = true
    setTimeout(() => {
      visible.value = false
    }, 3000)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
