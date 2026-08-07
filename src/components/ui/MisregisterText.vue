<script setup>
defineProps({
  as: { type: String, default: 'h2' },
  text: { type: String, required: true },
  ghost: { type: String, default: 'var(--ink-blog)' },
  offset: { type: Number, default: 3 },
})
</script>

<template>
  <component
    :is="as"
    class="misregister"
    :data-text="text"
    :style="{ '--ghost': ghost, '--offset': offset + 'px' }"
  >{{ text }}</component>
</template>
