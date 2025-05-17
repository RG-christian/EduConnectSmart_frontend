<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <h2 class="text-lg font-semibold mb-4">Modifier mes informations</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block font-medium">Téléphone</label>
          <input v-model="local.telephone" type="tel" class="input" required />
        </div>

        <div class="mb-4">
          <label class="block font-medium">Nouveau mot de passe</label>
          <input v-model="local.motDePasse" type="password" class="input" required />
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" @click="close" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enregistrer</button>
        </div>

        <p v-if="message" class="text-green-600 text-sm mt-4">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { updateEtudiant } from '../services/etudiant.service'

const props = defineProps<{
  show: boolean,
  profil: {
    telephone: string,
    motDePasse: string
  }
}>()

const emit = defineEmits(["close", "updated"])

const local = ref({ ...props.profil })
const message = ref("")

watch(() => props.show, (val) => {
  if (val) local.value = { ...props.profil }
})

const close = () => {
  emit("close")
  message.value = ""
}

const handleSubmit = async () => {
  const user = JSON.parse(localStorage.getItem("user") || '{}')
  await updateEtudiant(user.id, {
    telephone: local.value.telephone,
    motDePasse: local.value.motDePasse
  })
  message.value = "✅ Modifications enregistrées"
  emit("updated", { ...local.value })
  setTimeout(close, 1000)
}
</script>

<style scoped>
.input {
  @apply w-full border rounded px-3 py-2 mt-1;
}
</style>
