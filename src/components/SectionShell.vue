<script setup>
import { onMounted, ref } from 'vue'
import MisregisterText from './ui/MisregisterText.vue'
import { useReveal } from '../composables/useReveal'

const props = defineProps({
  id: { type: String, required: true },
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  ink: { type: String, required: true },
})

const root = ref(null)
const { reveal } = useReveal()
onMounted(() => { reveal(root.value) })
</script>

<template>
  <section :id="id" ref="root" class="section">
    <p class="section__kicker" :class="'ink-' + ink">{{ kicker }}</p>
    <MisregisterText as="h2" class="section__title" :text="title" :class="'ink-' + ink" />
    <slot />
  </section>
</template>
