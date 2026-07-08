<template>
  <footer class="site-footer">
    <div class="container footer-top">
      <div class="newsletter">
        <div class="eyebrow">Stay informed</div>
        <h2>Get Bumi insights in your inbox</h2>
        <p>Receive updates on technology, infrastructure, and future-ready systems.</p>
        <form class="form" @submit.prevent>
          <input type="email" placeholder="Email address" aria-label="Email address" />
          <button class="btn btn-primary" type="submit">Subscribe →</button>
        </form>
      </div>
      <div class="footer-cols">
        <div v-for="col in footerColumns" :key="col.title" class="footer-col">
          <h3>{{ col.title }}</h3>
          <NuxtLink v-for="link in col.links" :key="link" to="#">{{ link }}</NuxtLink>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© 2026 Bumi. Dummy website prototype.</span>
      <span>Modern · Technology · Trusted · Professional · Futuristic</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const footerColumns = [
  { title: 'Company', links: ['About Bumi', 'Leadership', 'Careers', 'Contact'] },
  { title: 'Services', links: ['Digital Infrastructure', 'Technology Integration', 'Operational Systems', 'Strategic Advisory'] },
  { title: 'Resources', links: ['Insights', 'Sustainability', 'Privacy', 'Terms'] },
]
</script>
