<template>
  <DummyPage
    :title="pageTitle"
    description="Prototype insight detail page. Final editorial content will be replaced with official Bumi articles, news, and recognition stories."
  />
</template>

<script setup lang="ts">
const route = useRoute()

const pageTitle = computed(() => String(route.params.slug || 'Insight Detail')
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' '))
</script>
