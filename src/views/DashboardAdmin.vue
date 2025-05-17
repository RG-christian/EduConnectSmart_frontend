<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6">
    <Navbar />

    <!-- Titre principal -->
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-10">
      🎛️ Tableau de bord <span class="text-blue-600">Admin</span>
    </h1>

    <!-- Grille des cartes -->
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
      <!-- Notifications -->
      <div class="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border-l-4 border-blue-500">
        <div class="flex items-center mb-4">
          <span class="text-blue-500 text-xl mr-2">
            <i class="fas fa-bell"></i>
          </span>
          <h2 class="text-lg font-bold">Notifications</h2>
        </div>
        <ul class="text-gray-600 space-y-1">
          <li>📩 Nouvelle préinscription reçue</li>
          <li>📁 Document téléversé par un étudiant</li>
          <li>✅ Vérification manuelle terminée</li>
        </ul>
      </div>

      <!-- Raccourcis -->
      <div class="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border-l-4 border-green-500">
        <div class="flex items-center mb-4">
          <span class="text-green-500 text-xl mr-2">
            <i class="fas fa-link"></i>
          </span>
          <h2 class="text-lg font-bold">Raccourcis</h2>
        </div>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>📝 Consulter les inscriptions</li>
          <li>🔄 Gérer les réinscriptions</li>
          <li>⚠️ Voir les dossiers incomplets</li>
        </ul>
      </div>

      <!-- Bloc Bonus -->
      <div class="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border-l-4 border-purple-500">
        <div class="flex items-center mb-4">
          <span class="text-purple-500 text-xl mr-2">
            <i class="fas fa-chart-line"></i>
          </span>
          <h2 class="text-lg font-bold">Statistiques</h2>
        </div>
        <ul class="text-gray-600 space-y-1">
          <li>👥 Étudiants inscrits : 120</li>
          <li>📊 Taux de validation : 85%</li>
          <li>🕒 Dernière activité : il y a 2h</li>
        </ul>
      </div>
    </div>
  </div>
</template>
