<template>
  <main class="dummy-page">
    <section class="dummy-hero">
      <div class="container">
        <div class="eyebrow">Bumi / Placeholder Page</div>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <NuxtLink class="btn btn-primary" to="/">Back to homepage →</NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
defineProps<{ title: string; description: string }>()
</script>
