<template>
  <main class="page-shell">
    <section class="hero" aria-label="Bumi hero with natural animated earth video">
      <video class="hero-video" autoplay muted loop playsinline poster="/images/dummy/hero-poster.svg">
        <source src="/videos/bumi-earth-natural-preview.mp4" type="video/mp4" />
      </video>
      <div class="hero-glow" aria-hidden="true" />
      <div class="container-wide hero-content reveal">
        <div class="eyebrow">{{ home.hero.eyebrow }}</div>
        <h1>{{ home.hero.title }}</h1>
        <p>{{ home.hero.body }}</p>
        <div class="hero-ctas">
          <NuxtLink class="btn btn-primary" :to="home.hero.primaryCta.href">{{ home.hero.primaryCta.label }} →</NuxtLink>
        </div>
      </div>
    </section>

    <section class="section intro">
      <div class="container-narrow reveal">
        <div class="eyebrow">{{ home.companyIntro.eyebrow }}</div>
        <p>{{ home.companyIntro.body }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container grid-feature">
        <div class="media-card reveal"><span class="big-b">B</span></div>
        <div class="reveal">
          <div class="eyebrow">{{ home.feature.eyebrow }}</div>
          <h2 class="section-title">{{ home.feature.title }}</h2>
          <h3>{{ home.feature.heading }}</h3>
          <p class="section-body">{{ home.feature.body }}</p>
          <NuxtLink class="arrow-link" to="/company">Explore our approach <span>→</span></NuxtLink>
        </div>
      </div>
    </section>

    <section class="promo">
      <div class="container-wide">
        <div class="promo-panel reveal">
          <div class="eyebrow">Flagship Solution</div>
          <h2>Future-Ready Digital Infrastructure</h2>
          <p class="section-body">A resilient foundation for data, operations, and growth. Bumi helps organizations connect systems, secure workflows, and prepare the infrastructure needed for tomorrow’s opportunities.</p>
          <NuxtLink class="arrow-link" to="/solutions">View flagship solution <span>→</span></NuxtLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="news-head reveal">
          <div>
            <h2 class="section-title">Insights & Recognition</h2>
            <div class="eyebrow">Latest</div>
          </div>
          <NuxtLink class="arrow-link" to="/insights">All insights <span>→</span></NuxtLink>
        </div>
        <div class="news-list reveal">
          <NuxtLink v-for="item in insights" :key="item.title" to="/insights" class="news-item">
            <div class="news-meta">{{ item.category }} · {{ item.type }} · {{ item.date }}</div>
            <h3>{{ item.title }}</h3>
            <span class="news-arrow">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="capabilities" class="section capabilities-section">
      <div class="container-wide">
        <div class="capabilities-head reveal">
          <div>
            <div class="eyebrow">Our Capabilities</div>
            <h2 class="section-title">Enterprise systems built for intelligent operations</h2>
          </div>
          <p class="section-body">Explore Bumi’s integrated solutions for manufacturing, education, healthcare, hospitality, finance, workforce management, and AI automation.</p>
        </div>

        <div class="capability-grid reveal">
          <article v-for="capability in capabilities" :key="capability.title" class="capability-card" :style="{ '--accent': capability.accent }">
            <div class="capability-card-top">
              <div class="capability-icon" :aria-label="`${capability.title} icon`">
                <svg v-if="capability.icon === 'factory'" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20V9l5 3V9l5 3V6h8v14H3Zm12-8v6h4V8h-4v4ZM5 18h2v-2H5v2Zm4 0h2v-2H9v2Zm4 0h2v-2h-2v2Z" /></svg>
                <svg v-else-if="capability.icon === 'education'" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 10 5-10 5L2 8l10-5Zm-6 8 6 3 6-3v5c-1.7 1.4-3.7 2.1-6 2.1S7.7 17.4 6 16v-5Zm14 1.2V17h-2v-3.8l2-1Z" /></svg>
                <svg v-else-if="capability.icon === 'clinic'" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-4.8-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6.2-8 11-8 11Zm-1-13v3H8v2h3v3h2v-3h3v-2h-3V8h-2Z" /></svg>
                <svg v-else-if="capability.icon === 'hotel'" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V3h12v6h4v12h-2v-3H6v3H4Zm4-5h3v-3H8v3Zm5 0h3v-3h-3v3ZM7 7h2V5H7v2Zm4 0h2V5h-2v2Zm-4 4h2V9H7v2Zm4 0h2V9h-2v2Z" /></svg>
                <svg v-else-if="capability.icon === 'restaurant'" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v8a3 3 0 0 1-2 2.8V22H5v-9.2A3 3 0 0 1 3 10V2h2v7h1V2h1v7h1V2Zm8 0c3 1.8 5 4.7 5 8.2 0 2.7-1.2 4.4-3 5.1V22h-2V2Z" /></svg>
                <svg v-else-if="capability.icon === 'laundry'" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5V3Zm2 2v14h10V5H7Zm2 2h2v2H9V7Zm3 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" /></svg>
                <svg v-else-if="capability.icon === 'workforce'" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm8-1a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM2 21c.5-4.4 2.7-7 6-7s5.5 2.6 6 7H2Zm12.5 0a8.5 8.5 0 0 0-2.1-5.2A5.2 5.2 0 0 1 16 14c3 0 5 2.5 5.5 7h-7Z" /></svg>
                <svg v-else-if="capability.icon === 'franchise'" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16l-1-5H5l-1 5Zm1 2h14v9h-2v-7h-4v7H5v-9Zm2 2v3h4v-3H7ZM7 3h10v2H7V3Z" /></svg>
                <svg v-else-if="capability.icon === 'fintech'" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9V7l9-5 9 5v2H3Zm2 2h3v7h2v-7h4v7h2v-7h3v9H5v-9Zm-2 10h18v2H3v-2Z" /></svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M9 2h6v3h3a2 2 0 0 1 2 2v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V7a2 2 0 0 1 2-2h3V2Zm2 3h2V4h-2v1Zm-2 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm6 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-6 4h6v-2H9v2Z" /></svg>
              </div>
              <span class="capability-number">{{ capability.kicker }}</span>
            </div>

            <h3>{{ capability.title }}</h3>
            <p class="capability-subtitle">{{ capability.subtitle }}</p>
            <p class="capability-description">{{ capability.description }}</p>

            <div class="capability-visual workflow-visual" aria-hidden="true">
              <div class="workflow-orbit">
                <span v-for="n in 4" :key="n" />
              </div>
              <div class="workflow-steps">
                <span v-for="step in capability.workflow" :key="step">{{ step }}</span>
              </div>
              <i v-for="n in 5" :key="n" class="workflow-pulse" />
            </div>

            <div class="capability-features">
              <span v-for="feature in capability.features" :key="feature">{{ feature }}</span>
            </div>

            <div class="capability-benefits">
              <strong>Business Impact</strong>
              <ul>
                <li v-for="benefit in capability.benefits" :key="benefit">{{ benefit }}</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container-narrow reveal">
        <div class="eyebrow">Careers & Partners</div>
        <h2>Build the future with Bumi</h2>
        <p>Join a team focused on structure, technology, trust, and long-term impact.</p>
        <div class="hero-ctas" style="justify-content:center">
          <NuxtLink class="btn btn-primary" to="/careers">Explore Careers →</NuxtLink>
          <NuxtLink class="btn btn-secondary" to="/contact">Partner with us</NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { home } from '~/data/home'
import { insights } from '~/data/insights'
import { capabilities } from '~/data/capabilities'

onMounted(async () => {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  gsap.from('.hero-content > *', {
    opacity: 0,
    y: 18,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.out',
  })

  gsap.to('.hero-video', {
    scale: 1.06,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })
})
</script>
