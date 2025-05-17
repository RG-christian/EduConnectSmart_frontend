import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PreinscriptionFormView from '../views/PreinscriptionFormView.vue'
import InscriptionView from '../views/InscriptionView.vue'
import ReinscriptionView from '../views/ReinscriptionView.vue'
import DashboardEtudiant from '../views/DashboardEtudiant.vue'
import DashboardAdmin from '../views/DashboardAdmin.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/preinscription', component: PreinscriptionFormView },
  { path: '/inscription', component: InscriptionView },
  { path: '/reinscription', component: ReinscriptionView },
  { path: '/dashboard/etudiant', component: DashboardEtudiant },
  { path: '/dashboard/admin', component: DashboardAdmin }
]


export default createRouter({
  history: createWebHistory(),
  routes
})

