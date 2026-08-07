<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
const glow = ref(null)

function onPointer(e) {
  if (!glow.value) return
  glow.value.style.setProperty('--mx', `${e.clientX}px`)
  glow.value.style.setProperty('--my', `${e.clientY}px`)
}

onMounted(() => {
  window.addEventListener('pointermove', onPointer)
})
</script>

<template>
  <div class="zine" :data-theme="theme">
    <div ref="glow" class="zine__glow" aria-hidden="true"></div>
    <div class="zine__main">
      <slot />
    </div>
    <div class="zine__grain" aria-hidden="true"></div>
  </div>
</template>
