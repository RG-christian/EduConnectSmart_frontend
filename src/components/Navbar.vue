<template>
  <nav class="bg-white shadow px-6 py-3 flex justify-between items-center">
    <div class="text-xl font-bold text-blue-600">EduConnect Smart</div>
    <ul class="flex space-x-4 text-gray-700">
      <li>
        <router-link to="/dashboard/etudiant" class="hover:underline">Tableau de bord</router-link>
      </li>
      <li>
        <router-link to="/profil" class="hover:underline">Profil</router-link>
      </li>
      <li>
        <button @click="logout" class="text-red-600 hover:underline">Déconnexion</button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('user')
  router.push('/')
}
</script>
