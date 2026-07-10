<template>
  <footer class="site-footer">
    <div class="container footer-top">
      <div class="newsletter">
        <div class="eyebrow">Stay informed</div>
        <h2>Get Bumi insights in your inbox</h2>
        <p>Receive updates on technology, infrastructure, and future-ready systems.</p>
        <form class="form" @submit.prevent="submitNewsletter" novalidate>
          <input v-model="email" type="email" placeholder="Email address" aria-label="Email address" />
          <button class="btn btn-primary" type="submit">Subscribe →</button>
        </form>
        <p v-if="newsletterMessage" class="form-message" :class="newsletterStatus" role="status">
          {{ newsletterMessage }}
        </p>
      </div>
      <div class="footer-cols">
        <div v-for="col in footerColumns" :key="col.title" class="footer-col">
          <h3>{{ col.title }}</h3>
          <NuxtLink v-for="link in col.links" :key="link.href" :to="link.href">{{ link.label }}</NuxtLink>
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
const email = ref('')
const newsletterMessage = ref('')
const newsletterStatus = ref<'success' | 'error'>('success')

const footerColumns = [
  {
    title: 'Company',
    links: [
      { label: 'About Bumi', href: '/company' },
      { label: 'Leadership', href: '/company/leadership' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Digital Infrastructure', href: '/services/digital-infrastructure' },
      { label: 'Technology Integration', href: '/services/technology-integration' },
      { label: 'Operational Systems', href: '/services/operational-systems' },
      { label: 'Strategic Advisory', href: '/services/strategic-advisory' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Insights', href: '/insights' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

function submitNewsletter() {
  const value = email.value.trim()
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  if (!valid) {
    newsletterStatus.value = 'error'
    newsletterMessage.value = 'Please enter a valid email address.'
    return
  }

  newsletterStatus.value = 'success'
  newsletterMessage.value = 'Thank you. Your email has been recorded for this prototype preview.'
  email.value = ''
}
</script>
