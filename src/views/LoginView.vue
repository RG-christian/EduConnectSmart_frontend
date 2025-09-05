<template>
  <div class="flex min-h-screen overflow-hidden">
    <!-- Left SVG Illustration -->
    <div class="hidden md:flex flex-1 items-center justify-center bg-green-100 p-6">
      <img src="../assets/bg.svg" alt="Illustration" class="max-w-md w-full" />
    </div>

    <!-- Login Content -->
    <div class="flex-1 flex flex-col justify-center items-center bg-white p-6">
      <div class="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
        <img src="../assets/avatar.svg" alt="Avatar" class="mx-auto w-24 h-24 mb-4" />
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-6 uppercase">Bienvenue</h2>

        <form @submit.prevent="handleLogin">
          <div class="mb-4 relative">
            <div class="flex items-center border-b-2 border-gray-300 focus-within:border-green-400">
              <span class="text-gray-400 px-3">
                <i class="fas fa-user"></i>
              </span>
              <input
                  v-model="email"
                  type="email"
                  placeholder="Email"
                  class="w-full py-2 focus:outline-none text-gray-700"
                  required
              />
            </div>
          </div>

          <div class="mb-4 relative">
            <div class="flex items-center border-b-2 border-gray-300 focus-within:border-green-400">
              <span class="text-gray-400 px-3">
                <i class="fas fa-lock"></i>
              </span>
              <input
                  v-model="password"
                  type="password"
                  placeholder="Mot de passe"
                  class="w-full py-2 focus:outline-none text-gray-700"
                  required
              />
            </div>
          </div>

          <div class="text-right text-sm text-gray-500 mb-4">
            <a href="#" class="hover:text-green-500 transition-colors">Mot de passe oublié ?</a>
          </div>

          <button
              type="submit"
              class="w-full bg-gradient-to-r from-green-500 to-teal-400
         hover:from-teal-400 hover:to-green-500
         text-white py-2 rounded-full font-semibold
         transition duration-300 ease-in-out transform hover:scale-105"
          >
            Se connecter
          </button>



          <p v-if="error" class="text-red-600 text-sm mt-3 text-center">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth.service'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const user = await login(email.value, password.value)

    if (user.role === 'admin') {
      await router.push('/dashboard/admin')
    } else if (user.role === 'etudiant') {
      await router.push('/dashboard/etudiant')
    } else {
      error.value = "Rôle inconnu. Accès refusé."
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || "Erreur d'authentification"
  }
}
</script>

<style scoped>
body {
  font-family: 'Poppins', sans-serif;
}
</style>
