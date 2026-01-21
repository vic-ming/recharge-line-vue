<template>
  <div class="min-h-screen bg-slate-900 text-white p-8">
    <div class="max-w-4xl mx-auto space-y-12">
      <header class="space-y-4">
        <router-link to="/" class="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2">
          <span>←</span> Back to Home
        </router-link>
        <h1 class="text-4xl font-bold">About This Template</h1>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <h2 class="text-2xl font-semibold text-blue-400">Vue 3 (Composition API)</h2>
          <p class="text-slate-400">
            Leveraging the latest features of Vue 3, including script setup and reactive primitives for a clean and efficient development experience.
          </p>
        </div>

        <div class="space-y-4">
          <h2 class="text-2xl font-semibold text-emerald-400">Tailwind CSS 4</h2>
          <p class="text-slate-400">
            The next generation of Tailwind CSS, optimized for performance and featuring a more streamlined development workflow.
          </p>
        </div>

        <div class="space-y-4">
          <h2 class="text-2xl font-semibold text-purple-400">Vue Router 4</h2>
          <p class="text-slate-400">
            Standard routing solution for Vue, providing seamless navigation and state management across your application.
          </p>
        </div>

        <div class="space-y-4">
          <h2 class="text-2xl font-semibold text-orange-400">Sass / SCSS</h2>
          <p class="text-slate-400">
            Full support for Sass, allowing you to use variables, nesting, and mixins alongside Tailwind's utility classes.
          </p>
        </div>
      </section>

      <footer class="pt-12 border-t border-slate-800 text-center text-slate-500">
        Built with ❤️ for rapid Vue 3 development.
      </footer>
    </div>
  </div>
</template>
