<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6">
    <Navbar />

    <!-- Titre principal -->
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-10">
      🎓 Bienvenue dans votre <span class="text-blue-600">espace étudiant</span>
    </h1>

    <!-- Bloc informations personnelles -->
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition duration-300 border-l-4 border-blue-500">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Mes informations</h2>
          <p class="text-sm text-gray-500 mt-1">Gérez vos données personnelles</p>
        </div>
        <button
            @click="showPopup = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          ✏️ Modifier
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-base">
        <div>
          <span class="font-medium text-gray-900">Nom :</span> {{ user.nom }}
        </div>
        <div>
          <span class="font-medium text-gray-900">Email :</span> {{ user.email }}
        </div>
      </div>
    </div>

    <!-- Popup de modification -->
    <PopupEditProfil
        :show="showPopup"
        :profil="profil"
        @close="showPopup = false"
        @updated="handleUpdated"
    />

    <!-- Notification toast -->
    <Toast :show="showToast" :message="toastMessage" />
  </div>
</template>


<script setup lang="ts">
import Toast from '../components/Toast.vue'

const showToast = ref(false)
const toastMessage = ref('')

import { ref } from 'vue'
import PopupEditProfil from '../components/PopupEditProfil.vue'

const user = JSON.parse(localStorage.getItem("user") || '{}')

const profil = ref({
  telephone: user.telephone || '',
  motDePasse: ''
})

const showPopup = ref(false)



const handleUpdated = (data: any) => {
  profil.value.telephone = data.telephone
  showToast.value = true
  toastMessage.value = "✅ Profil mis à jour avec succès"
}

</script>

