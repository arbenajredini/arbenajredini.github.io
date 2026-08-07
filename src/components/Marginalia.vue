<script setup>
defineProps({
  ink: { type: String, default: 'var(--ink-muted)' },
})
</script>

<template>
  <aside class="marginalia mono" :style="{ '--mink': ink }">
    <slot />
  </aside>
</template>
