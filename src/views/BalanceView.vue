<template>
  <div class="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
    <div class="max-w-4xl w-full space-y-8 text-center">
      <h1 class="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
        Vue 3 + Tailwind 4 + Sass
      </h1>
      <p class="text-xl text-slate-400 max-w-2xl mx-auto">
        A premium starter template featuring Vue 3, Vite, Tailwind CSS 4, Vue Router, and Sass.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div class="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-blue-500/50 transition-colors group">
          <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span class="text-2xl">⚡</span>
          </div>
          <h3 class="text-xl font-bold mb-2">Vite Speed</h3>
          <p class="text-slate-400 text-sm">Lightning fast HMR and optimized builds.</p>
        </div>
        
        <div class="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-emerald-500/50 transition-colors group">
          <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span class="text-2xl">🎨</span>
          </div>
          <h3 class="text-xl font-bold mb-2">Tailwind 4</h3>
          <p class="text-slate-400 text-sm">Next-gen CSS-first utility engine.</p>
        </div>
        
        <div class="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-purple-500/50 transition-colors group">
          <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span class="text-2xl">💅</span>
          </div>
          <h3 class="text-xl font-bold mb-2">Sass Power</h3>
          <p class="text-slate-400 text-sm">Advanced styling with SCSS features.</p>
        </div>
      </div>

      <div class="mt-12">
        <router-link to="/about" class="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          Learn More
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
