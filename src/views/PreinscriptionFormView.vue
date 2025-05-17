<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="w-full max-w-5xl bg-white rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden">

      <!-- Image à gauche -->
      <!-- Section gauche avec image de fond dynamique -->
      <div class="md:w-1/2 relative overflow-hidden">
        <!-- Image de fond avec transition -->
        <transition name="fade" mode="out-in">
          <div
              :key="images[currentIndex]"
              class="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fadeInSlow transition-opacity duration-1000"
              :style="{ backgroundImage: `url(${images[currentIndex]})` }"
          ></div>
        </transition>

        <!-- Overlay sombre dégradé -->
        <div class="absolute inset-0 bg-gradient-to-br from-black/40 to-black/10 z-10"></div>

        <!-- Contenu centré -->
        <div class="relative z-20 flex items-center justify-center h-full p-8">
          <!-- Logo ou texte optionnel ici -->
        </div>
      </div>

      <!-- Formulaire à droite -->
      <div class="md:w-1/2 bg-white p-8 flex flex-col justify-center items-center">
        <img src="../assets/avatar.svg" alt="Avatar" class="w-20 h-20 mb-4" />
        <h2 class="text-3xl font-bold uppercase text-gray-800 mb-6">Préinscription</h2>

        <form @submit.prevent="submitPreinscription" class="w-full max-w-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="relative">
              <input v-model="form.nom" type="text" placeholder=" " class="peer pt-6 pb-2 px-3 w-full border-b-2 border-gray-300 bg-white text-blue-900 focus:outline-none focus:border-green-500 placeholder-transparent" required />
              <label class="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500">Nom</label>
            </div>

            <div class="relative">
              <input v-model="form.prenom" type="text" placeholder=" " class="peer pt-6 pb-2 px-3 w-full border-b-2 border-gray-300 bg-white text-blue-900 focus:outline-none focus:border-green-500 placeholder-transparent" required />
              <label class="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500">Prénom</label>
            </div>

            <div class="relative">
              <input v-model="form.dateNaissance" type="date" placeholder=" " class="peer pt-6 pb-2 px-3 w-full border-b-2 border-gray-300 bg-white text-blue-900 focus:outline-none focus:border-green-500 placeholder-transparent" required />
              <label class="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500">Date de naissance</label>
            </div>

            <div class="relative">
              <input v-model="form.lieuNaissance" type="text" placeholder=" " class="peer pt-6 pb-2 px-3 w-full border-b-2 border-gray-300 bg-white text-blue-900 focus:outline-none focus:border-green-500 placeholder-transparent" required />
              <label class="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500">Lieu de naissance</label>
            </div>

            <div class="relative">
              <input v-model="form.serieBac" type="text" placeholder=" " class="peer pt-6 pb-2 px-3 w-full border-b-2 border-gray-300 bg-white text-blue-900 focus:outline-none focus:border-green-500 placeholder-transparent" required />
              <label class="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500">Série Bac</label>
            </div>

            <div class="relative">
              <input v-model="form.domaine" type="text" placeholder=" " class="peer pt-6 pb-2 px-3 w-full border-b-2 border-gray-300 bg-white text-blue-900 focus:outline-none focus:border-green-500 placeholder-transparent" required />
              <label class="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500">Domaine</label>
            </div>

            <div class="relative">
              <input v-model="form.niveau" type="text" placeholder=" " class="peer pt-6 pb-2 px-3 w-full border-b-2 border-gray-300 bg-white text-blue-900 focus:outline-none focus:border-green-500 placeholder-transparent" required />
              <label class="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500">Niveau</label>
            </div>

            <div class="relative">
              <input v-model="form.specialite" type="text" placeholder=" " class="peer pt-6 pb-2 px-3 w-full border-b-2 border-gray-300 bg-white text-blue-900 focus:outline-none focus:border-green-500 placeholder-transparent" required />
              <label class="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500">Spécialité</label>
            </div>
          </div>

          <button
              type="submit"
              :disabled="isLoading"
              class="mt-6 w-full bg-gradient-to-r from-green-500 to-teal-400 hover:from-teal-400 hover:to-green-500 text-white py-3 rounded-full font-semibold transition duration-300 flex justify-center items-center gap-2"
          >
            <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span>{{ isLoading ? "Envoi en cours..." : "Envoyer la demande" }}</span>
          </button>


          <p v-if="message" class="text-green-600 text-sm mt-4 text-center">{{ message }}</p>
          <p v-if="error" class="text-red-600 text-sm mt-4 text-center">{{ error }}</p>
        </form>

      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import { ref } from 'vue'
import axios from 'axios'
const pdfUrl = ref('')

const form = ref({
  nom: '',
  prenom: '',
  dateNaissance: '',
  lieuNaissance: '',
  serieBac: '',
  domaine: '',
  niveau: '',
  specialite: ''
})

const message = ref('')
const error = ref('')
const isLoading = ref(false)

const submitPreinscription = async () => {
  isLoading.value = true
  message.value = ''
  error.value = ''

  try {
    const backendUrl = "http://localhost:4000"

    const response = await axios.post(`${backendUrl}/api/preinscriptions/publique`, {
      nom: form.value.nom,
      prenom: form.value.prenom,
      dateNaissance: form.value.dateNaissance,
      lieuNaissance: form.value.lieuNaissance,
      serieBac: form.value.serieBac,
      domaine: form.value.domaine,
      niveau: form.value.niveau,
      specialite: form.value.specialite
    })

    message.value = '✅ Préinscription envoyée avec succès.'
    pdfUrl.value = response.data.pdfUrl
    window.open(`http://localhost:4000${pdfUrl.value}`, "_blank")

  } catch (e: any) {
    error.value = e.response?.data?.error || 'Erreur lors de l’envoi.'
  } finally {
    isLoading.value = false
  }
}


import { onMounted, onBeforeUnmount } from 'vue'

// Tes images webp à faire défiler
import image1 from '../assets/education-1.webp'
import image2 from '../assets/education-2.webp'

const images = [image1, image2]
const currentIndex = ref(0)

let intervalId: number

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length
  }, 10000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})


</script>


<style scoped>
@keyframes fadeInSlow {
  0% {
    opacity: 0;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeInSlow {
  animation: fadeInSlow 2s ease-out forwards;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>
