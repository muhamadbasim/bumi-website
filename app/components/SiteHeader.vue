<template>
  <header ref="headerRef" class="site-header">
    <div class="container-wide header-inner">
      <NuxtLink to="/" class="brand" aria-label="Bumi homepage" @click="closeAll">
        <span class="brand-mark"><BumiLogo /></span>
        <span>Bumi</span>
      </NuxtLink>

      <nav class="nav" aria-label="Primary navigation">
        <div v-for="item in navigation" :key="item.label" class="nav-item">
          <button
            class="nav-trigger"
            :class="{ 'is-active': activeMenu === item.label }"
            type="button"
            :aria-expanded="activeMenu === item.label"
            :aria-controls="megaId(item.label)"
            @click="toggleMenu(item.label)"
            @mouseenter="activeMenu = item.label"
            @keydown.down.prevent="activeMenu = item.label"
          >
            <span>{{ item.label }}</span>
            <span class="nav-chevron" aria-hidden="true">⌄</span>
          </button>

          <Transition name="mega">
            <div
              v-if="activeMenu === item.label"
              :id="megaId(item.label)"
              class="mega-menu is-open"
              role="region"
              :aria-label="`${item.label} menu`"
            >
              <div class="container-wide mega-inner">
                <div class="mega-feature">
                  <div class="eyebrow">{{ item.label }}</div>
                  <h2>{{ item.description }}</h2>
                  <NuxtLink :to="item.href" class="arrow-link" @click="closeAll">{{ item.label }} overview <span>→</span></NuxtLink>
                </div>
                <div class="mega-groups">
                  <div v-for="group in item.groups" :key="group.title" class="mega-group">
                    <h3>{{ group.title }}</h3>
                    <NuxtLink v-for="link in group.links" :key="link.label" :to="link.href" @click="closeAll">{{ link.label }} <span>→</span></NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </nav>

      <div class="header-actions">
        <button class="search-btn" type="button" :aria-expanded="searchOpen" aria-controls="site-search-panel" aria-label="Search" @click="openSearch">⌕</button>
        <button
          class="menu-btn"
          type="button"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-navigation"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          @click="toggleMobile"
        >{{ mobileOpen ? '×' : '☰' }}</button>
      </div>
    </div>

    <Transition name="mobile">
      <div v-if="mobileOpen" id="mobile-navigation" class="mobile-panel" role="dialog" aria-label="Mobile navigation">
        <div v-for="item in navigation" :key="item.label" class="mobile-section">
          <button class="mobile-section-trigger" type="button" :aria-expanded="openMobileSections.includes(item.label)" @click="toggleMobileSection(item.label)">
            <span>
              <strong>{{ item.label }}</strong>
              <small>{{ item.description }}</small>
            </span>
            <span aria-hidden="true">{{ openMobileSections.includes(item.label) ? '−' : '+' }}</span>
          </button>
          <div v-if="openMobileSections.includes(item.label)" class="mobile-section-links">
            <NuxtLink :to="item.href" @click="closeAll">{{ item.label }} overview <span>→</span></NuxtLink>
            <template v-for="group in item.groups" :key="group.title">
              <div class="mobile-group-title">{{ group.title }}</div>
              <NuxtLink v-for="link in group.links" :key="link.href" :to="link.href" @click="closeAll">{{ link.label }} <span>→</span></NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="search">
      <div v-if="searchOpen" id="site-search-panel" class="search-panel" role="dialog" aria-modal="true" aria-label="Site search">
        <button class="search-backdrop" type="button" aria-label="Close search" @click="closeAll" />
        <div class="search-card">
          <div class="search-card-head">
            <div>
              <div class="eyebrow">Search Bumi</div>
              <h2>Find pages, services, and company updates</h2>
            </div>
            <button class="search-close" type="button" aria-label="Close search" @click="closeAll">×</button>
          </div>
          <label class="sr-only" for="site-search-input">Search query</label>
          <input id="site-search-input" v-model="searchQuery" class="search-input" type="search" placeholder="Try “Digital Infrastructure” or “Leadership”" />
          <div class="search-results" aria-live="polite">
            <NuxtLink v-for="result in filteredSearchResults" :key="result.href" :to="result.href" @click="closeAll">
              <span>{{ result.label }}</span>
              <small>{{ result.category }}</small>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { navigation } from '~/data/navigation'

const route = useRoute()
const headerRef = ref<HTMLElement | null>(null)
const activeMenu = ref<string | null>(null)
const mobileOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const openMobileSections = ref<string[]>(['Services'])

const megaId = (label: string) => `mega-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

const searchItems = computed(() => navigation.flatMap((item) => [
  { label: `${item.label} overview`, href: item.href, category: item.label },
  ...item.groups.flatMap((group) => group.links.map((link) => ({ ...link, category: `${item.label} · ${group.title}` }))),
]))

const filteredSearchResults = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const results = query
    ? searchItems.value.filter((item) => `${item.label} ${item.category}`.toLowerCase().includes(query))
    : searchItems.value
  return results.slice(0, 8)
})

function toggleMenu(label: string) {
  searchOpen.value = false
  mobileOpen.value = false
  activeMenu.value = activeMenu.value === label ? null : label
}

function toggleMobile() {
  activeMenu.value = null
  searchOpen.value = false
  mobileOpen.value = !mobileOpen.value
}

function toggleMobileSection(label: string) {
  openMobileSections.value = openMobileSections.value.includes(label)
    ? openMobileSections.value.filter((item) => item !== label)
    : [...openMobileSections.value, label]
}

function openSearch() {
  activeMenu.value = null
  mobileOpen.value = false
  searchOpen.value = true
  nextTick(() => document.getElementById('site-search-input')?.focus())
}

function closeAll() {
  activeMenu.value = null
  mobileOpen.value = false
  searchOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeAll()
}

function onPointerDown(event: PointerEvent) {
  if (!headerRef.value?.contains(event.target as Node)) closeAll()
}

watch(() => route.fullPath, closeAll)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>
