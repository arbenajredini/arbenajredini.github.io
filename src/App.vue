<script setup>
import ZinePage from './components/ZinePage.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import Hero from './components/sections/Hero.vue'
import Summary from './components/sections/Summary.vue'
import Experience from './components/sections/Experience.vue'
import Skills from './components/sections/Skills.vue'
import Certifications from './components/sections/Certifications.vue'
import Education from './components/sections/Education.vue'
import Honors from './components/sections/Honors.vue'
import Projects from './components/sections/Projects.vue'
import Books from './components/sections/Books.vue'
import Blog from './components/sections/Blog.vue'
import Footer from './components/sections/Footer.vue'

function onPrint() {
  window.print()
}
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="page-actions">
    <ThemeToggle />
    <button class="pdf-btn mono" type="button" @click="onPrint">PDF ↓</button>
  </div>
  <ZinePage>
    <main id="main">
      <Hero />
      <Summary />
      <Experience />
      <Skills />
      <Certifications />
      <Education />
      <Honors />
      <Projects />
      <Books />
      <Blog />
      <Footer />
    </main>
  </ZinePage>
</template>
