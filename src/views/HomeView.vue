<template>
  <div class="min-h-screen bg-white font-poppins flex flex-col items-center text-center">
    <!-- En-tête -->
    <header class="w-full relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-12 font-poppins overflow-hidden">
      <!-- Connexion / Inscription -->
      <div class="absolute top-4 right-6 flex space-x-2 z-10">
        <router-link
            to="/login"
            class="border border-white px-4 py-1 rounded-md text-sm hover:bg-white hover:text-blue-600 transition"
        >
          Connexion
        </router-link>
        <router-link
            to="/inscription"
            class="border border-white px-4 py-1 rounded-md text-sm hover:bg-white hover:text-purple-600 transition"
        >
          Inscription
        </router-link>
      </div>

      <!-- Divider sous les boutons -->
      <hr class="border-t-2 border-[#707070] w-full my-6 md:my-10" />

      <!-- Texte central -->
      <div class="text-center relative z-10">
        <h1 class="text-3xl md:text-4xl font-bold mb-4 text-center">
          Bienvenue sur
          <span class="text-[#F2C94C] font-bold">E</span>du<span class="text-[#F2C94C] font-bold">C</span>onnect
          <span class="text-[#F2C94C] font-bold">S</span>mart
        </h1>

      </div>

      <!-- Illustration flottante gauche -->
      <img
          src="../assets/shape_1.png"
          alt="Illustration gauche"
          class="hidden md:block absolute left-8 top-1/2 transform -translate-y-1/2 w-56 animate-float"
      />

      <!-- Illustration flottante droite -->
      <img
          src="../assets/shape2.png"
          alt="Illustration droite"
          class="hidden md:block absolute right-8 top-1/2 transform -translate-y-1/2 w-56 animate-float"
      />

      <!-- Bas de header avec phrase -->
      <div class="text-center text-lg md:text-2xl mt-12 z-10 relative pb-4">
        <p class="leading-relaxed">
          L'endroit où les classes se<br />
          transforment en<br />
          communautés
        </p>
      </div>
    </header>



    <!-- Section actions -->
    <section class="px-4 py-10">
      <p class="text-gray-700 mb-8 text-lg">
        Veuillez choisir une action ci-dessous pour commencer.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <!-- Connexion -->
        <router-link
            to="/login"
            class="bg-blue-600 text-white p-6 rounded-2xl shadow-md hover:bg-blue-700 transition flex flex-col items-center justify-center min-h-[160px] pt-10"
        >
          Connexion
          <svg
              class="w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7M3 12h13"/>
          </svg>

        </router-link>

        <!-- Préinscription -->
        <router-link
            to="/preinscription"
            class="bg-green-500 text-white p-6 rounded-2xl shadow-md hover:bg-green-600 transition flex flex-col items-center justify-center min-h-[160px] pt-10"
        >
          Préinscription
          <svg
              class="w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7M3 12h13"/>
          </svg>


        </router-link>

        <!-- Inscription -->
        <router-link
            to="/inscription"
            class="bg-purple-500 text-white p-6 rounded-2xl shadow-md hover:bg-purple-600 transition flex flex-col items-center justify-center min-h-[160px] pt-10"
        >
          Inscription
          <svg
              class="w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7M3 12h13"/>
          </svg>

        </router-link>

        <!-- Réinscription -->

        <router-link
            to="/reinscription"
            class="bg-yellow-400 text-white p-6 rounded-2xl shadow-md hover:bg-yellow-500 transition flex flex-col items-center justify-center min-h-[160px] pt-10"
        >
          Réinscription
          <svg
              class="w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7M3 12h13"/>
          </svg>

        </router-link>
      </div>
    </section>
  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

.btn-blue {
  @apply bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow;
}
.btn-green {
  @apply bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow;
}
.btn-purple {
  @apply bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg shadow;
}
.btn-yellow {
  @apply bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg shadow;
}

@keyframes float {
  0% { transform: translateY(-50%) translateX(0); }
  25% { transform: translateY(-52%) translateX(5px); }
  50% { transform: translateY(-50%) translateX(10px); }
  75% { transform: translateY(-48%) translateX(5px); }
  100% { transform: translateY(-50%) translateX(0); }
}


.animate-float {
  animation: float 4s ease-in-out infinite;
}


.font-poppins {
  font-family: 'Poppins', sans-serif;
}
</style>
<script setup lang="ts">
</script>