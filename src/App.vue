<script setup>
import ZinePage from './components/ZinePage.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import Hero from './components/sections/Hero.vue'
import Experience from './components/sections/Experience.vue'
import Projects from './components/sections/Projects.vue'
import Research from './components/sections/Research.vue'
import Books from './components/sections/Books.vue'
import Blog from './components/sections/Blog.vue'
import Skills from './components/sections/Skills.vue'
import Footer from './components/sections/Footer.vue'
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <ThemeToggle />
  <ZinePage>
    <main id="main">
      <Hero />
      <Experience />
      <Projects />
      <Research />
      <Books />
      <Blog />
      <Skills />
      <Footer />
    </main>
  </ZinePage>
</template>
