<script setup>
defineProps({
  id: { type: String, required: true },
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  ink: { type: String, required: true },
})
</script>

<template>
  <section :id="id" class="section">
    <p class="section__kicker" :class="'ink-' + ink">{{ kicker }}</p>
    <h2 class="section__title" :class="'ink-' + ink">{{ title }}</h2>
    <slot />
  </section>
</template>
