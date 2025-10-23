<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import axios from "axios"
import http from "@/lib/http"

// ===== API base =====
const API = import.meta.env.VITE_API_URL || "http://localhost:3000"

// ===== Étapes / erreurs =====
const currentStep = ref(1)
const step1Error  = ref<string>("")
const step = ref<1|2|3|4>(1)
const stepError = ref("")

function must(v: any) { return String(v ?? "").trim() !== "" }
function showStepError(msg: string){ stepError.value = msg; setTimeout(()=>stepError.value="",3500) }

function validateStep1(){
  if (!must(form.value.nom) || !must(form.value.prenom)) return "Nom et Prénom requis"
  if (!must(form.value.genre) || !must(form.value.date_naissance)) return "Genre et Date de naissance requis"
  if (!must(form.value.lieu_naissance) || !must(form.value.nationalite)) return "Lieu de naissance et Nationalité requis"
  return ""
}
function validateStep2(){
  if (!must(form.value.telephone_etudiant)) return "Téléphone personnel requis"
  if (!must(form.value.lieu_residence)) return "Lieu de résidence requis"
  return ""
}
function validateStep3(){
  if (!must(form.value.serie_bac) || !must(form.value.annee_bac)) return "Série et Année du Bac requis"
  if (!must(form.value.mention_bac) || !must(form.value.etablissement_provenance) || !must(form.value.pays_bac))
    return "Mention Bac, Établissement et Pays requis"
  if (form.value.oriente === "Oui" && !must(form.value.numero_orientation)) return "Numéro d'orientation requis"
  if (form.value.boursier === "Oui" && (!must(form.value.denomination_bourse) || !must(form.value.organisme_donateur) || !must(form.value.numero_bourse)))
    return "Champs bourse requis"
  return ""
}
function validateStep4(){
  if (!must(form.value.institut) || !must(form.value.mention) || !must(form.value.niveau) || !must(form.value.specialite))
    return "Institut, Mention, Niveau, Spécialité requis"
  return ""
}

function next(){
  let err = ""
  if (step.value===1) err = validateStep1()
  if (step.value===2) err = validateStep2()
  if (step.value===3) err = validateStep3()
  if (err) return showStepError(err)
  step.value = Math.min(4, (step.value+1) as 2|3|4) as 2|3|4
}
function prev(){ step.value = Math.max(1, (step.value-1) as 1|2|3) as 1|2|3 }

async function nextFromStep1() {
  step1Error.value = ""

  // ⬇️ Validation stricte de TOUS les champs obligatoires de l'étape 1
  if (
      !must(form.value.nom) ||
      !must(form.value.prenom) ||
      !must(form.value.genre) ||
      !must(form.value.date_naissance) ||
      !must(form.value.lieu_naissance) ||
      !must(form.value.nationalite)          // ⬅️ nationalité devient réellement bloquante
  ) {
    step1Error.value =
        "Veuillez renseigner Nom, Prénom, Genre, Date, Lieu de naissance et Nationalité."
    return
  }

  try {
    const resp = await http.post(
        "/api/preinscriptions/check-duplicate",
        {
          nom: form.value.nom.trim(),
          prenom: form.value.prenom.trim(),
          date_naissance: form.value.date_naissance, // "YYYY-MM-DD"
        },
        { validateStatus: () => true }
    )

    if (resp.status === 200 && resp.data?.ok) {
      step.value = 2
      return
    }
    if (resp.status === 409) {
      step1Error.value =
          "Une préinscription avec ces nom, prénoms et date de naissance existe déjà."
      return
    }
    step1Error.value =
        resp.data?.message || `Erreur (${resp.status}) lors de la vérification.`
  } catch (e: any) {
    console.error(e)
    step1Error.value = e?.message || "Erreur réseau."
  }
}

// ===== État formulaire (mêmes noms que la page PHP) =====
type FileMaybe = File | null
const form = ref({
  // Étape 1
  nom: "", prenom: "", genre: "", date_naissance: "", lieu_naissance: "",
  nationalite: "", situation_matrimoniale: "",
  // Étape 2
  telephone_etudiant: "", telephone_parent: "", email: "", lieu_residence: "",
  photo: null as FileMaybe,
  // Étape 3
  serie_bac: "", annee_bac: "", numero_table_bac: "", mention_bac: "",
  etablissement_provenance: "", pays_bac: "",
  oriente: "", numero_orientation: "", boursier: "",
  denomination_bourse: "", organisme_donateur: "", numero_bourse: "",
  moyenne_bac: "",
  // Étape 4
  institut: "",        // idanfac
  mention: "",         // idanfacdept
  niveau: "",          // idanfdn
  specialite: "",      // idafdnp
  annee_academique: "",
})

// ===== Données méta =====
const idanuniv = ref<number|null>(null)
type Fac = { idanfac:number; fac:string }
type Men = { idanfac:number; idanfacdept:number; departement:string }
type Niv = { idanfacdept:number; idanfdn:number; niveau:string }
type Par = { idanfdn:number; idafdnp:number; libelle:string }

const facultes = ref<Fac[]>([])
const mentions  = ref<Men[]>([])
const niveaux   = ref<Niv[]>([])
const parcours  = ref<Par[]>([])

async function loadAnneeEtFacultes(){
  const { data: meta } = await axios.get(`${API}/meta/annee-academique`)
  idanuniv.value = meta.idanuniv ?? null
  form.value.annee_academique = meta.annee_academique || ""
  if (idanuniv.value){
    const { data } = await axios.get(`${API}/meta/facultes`, { params: { idanuniv: idanuniv.value } })
    facultes.value = data
  }
}
async function loadMentions(){
  niveaux.value=[]; parcours.value=[]
  form.value.mention=""; form.value.niveau=""; form.value.specialite=""
  if (!form.value.institut) return
  const { data } = await axios.get(`${API}/meta/mentions`, { params: { idanfac: form.value.institut } })
  mentions.value = data
}
async function loadNiveaux(){
  parcours.value=[]
  form.value.niveau=""; form.value.specialite=""
  if (!form.value.mention) return
  const { data } = await axios.get(`${API}/meta/niveaux`, { params: { idanfacdept: form.value.mention } })
  niveaux.value = data
}
async function loadParcours(){
  form.value.specialite=""
  if (!form.value.niveau) return
  const { data } = await axios.get(`${API}/meta/parcours`, { params: { idanfdn: form.value.niveau } })
  parcours.value = data
}

watch(()=>form.value.institut, loadMentions)
watch(()=>form.value.mention,  loadNiveaux)
watch(()=>form.value.niveau,   loadParcours)

onMounted(loadAnneeEtFacultes)

// ===== Nationalités =====
const nationalites = [
  "Afghane","Albanaise","Algérienne","Allemande","Anglaise","Américaine","Andorrane","Angolaise","Antiguaise-et-Barbudienne",
  "Argentine","Arménienne","Australienne","Autrichienne","Azerbaïdjanaise","Bahaméenne","Bahreïnienne","Bangladaise",
  "Barbadienne","Belge","Bélizienne","Béninoise","Bhoutanaise","Biélorusse","Birmane","Bolivienne","Boslniène",
  "Botswanaise","Brésilienne","Britannique","Brunéienne","Bulgare","Burkinabè","Burundaise","Cambodgienne","Camerounaise",
  "Canadienne","Cap-Verdienne","Centrafricaine","Chilienne","Chinoise","Chypriote","Colombienne","Comorienne",
  "Congolaise (Congo-Brazzaville)","Congolaise (Congo-Kinshasa)","Costaricaine","Croate","Cubaine","Danoise","Djiboutienne",
  "Dominicaine","Dominiquaise","Écossaise","Égyptienne","Émirienne","Équato-Guinéenne","Équatorienne","Érythréenne",
  "Espagnole","Estonienne","Éthiopienne","Fidjienne","Finlandaise","Française","Gabonaise","Galloise","Gambienne",
  "Georgienne","Ghanéenne","Grecque","Grenadienne","Guatémaltèque","Guinéenne","Guinéenne (Guinée-Bissau)",
  "Guinéenne (Guinée équatoriale)","Guyanienne","Haïtienne","Hondurienne","Hongroise","Indienne","Indonésienne",
  "Irakienne","Iranienne","Irlandaise","Islandais","Israélienne","Italienne","Ivoirienne","Jamaïcaine","Japonaise",
  "Jordanienne","Kazakhstanaise","Kenyane","Kirghize","Kiribatienne","Koweïtienne","Laotienne","Lesothienne","Lettone",
  "Libanaise","Libérienne","Libyenne","Liechtensteinoise","Lituanienne","Luxembourgeoise","Macédonienne","Malaisienne",
  "Malawite","Maldivienne","Malienne","Maltaise","Marocaine","Marshallaise","Mauricienne","Mauritanienne","Mexicaine",
  "Micronésienne","Moldave","Monégasque","Mongole","Monténégrine","Mozambicaine","Namibienne","Nauruane","Népalaise",
  "Néerlandaise","Néo-Zélandaise","Nicaraguayenne","Nigérienne","Nigériane","Norvégienne","Omanaise","Ougandaise",
  "Ouzbèke","Pakistanaise","Palaosienne","Palestinienne","Panaméenne","Papouasienne","Paraguayenne","Péruvienne",
  "Philippine","Polonaise","Portugaise","Qatarienne","Roumaine","Russe","Rwandaise","Saint-Lucienne","Saint-Marinaise",
  "Saint-Vincentaise-et-Grenadine","Salomonaise","Salvadorienne","Samoane","Santoméenne","Saoudienne","Sénégalaise",
  "Serbe","Seychelloise","Sierra-Léonaise","Singapourienne","Slovaque","Slovène","Somalienne","Soudanaise","Sri-Lankaise",
  "Sud-Africaine","Sud-Soudanaise","Suédoise","Suisse","Surinamaise","Swazie","Syrienne","Tadjike","Tanzanienne",
  "Tchadienne","Tchèque","Thaïlandaise","Timoraise","Togolaise","Tonguienne","Trinidadienne","Tunisienne","Turkmène",
  "Turque","Tuvaluane","Ukrainienne","Uruguayenne","Vanuatuane","Vénézuélienne","Vietnamienne","Yéménite","Zambienne","Zimbabwéenne"
]

// ===== Slideshow (gauche) =====
const slides = ref<string[]>(["public/esgis_1.webp","public/esgis_2.webp"])
const currentSlide = ref(0)
let timer: any = null
onMounted(()=>{ timer = setInterval(()=> currentSlide.value = (currentSlide.value+1) % slides.value.length, 8000) })
onBeforeUnmount(()=>{ if (timer) clearInterval(timer) })

// ===== Champs conditionnels =====
const showNumOrientation = computed(()=> form.value.oriente === "Oui")
const showBourse         = computed(()=> form.value.boursier === "Oui")

// ===== Soumission : POST /preinscriptions -> PDF (blob) =====
const submitting = ref(false)
const submitError = ref("")

async function submitForm(){
  const err = validateStep4()
  if (err) return showStepError(err)

  submitting.value = true; submitError.value = ""
  try {
    const fd = new FormData()
    // Étape 1
    fd.append("nom", form.value.nom)
    fd.append("prenom", form.value.prenom)
    fd.append("genre", form.value.genre)
    fd.append("date_naissance", form.value.date_naissance)
    fd.append("lieu_naissance", form.value.lieu_naissance)
    fd.append("nationalite", form.value.nationalite)
    fd.append("situation_matrimoniale", form.value.situation_matrimoniale)
    // Étape 2
    fd.append("telephone_etudiant", form.value.telephone_etudiant)
    fd.append("telephone_parent", form.value.telephone_parent)
    fd.append("email", form.value.email)
    fd.append("lieu_residence", form.value.lieu_residence)
    if (form.value.photo) fd.append("photo", form.value.photo)
    // Étape 3
    fd.append("serie_bac", form.value.serie_bac)
    fd.append("annee_bac", form.value.annee_bac)
    fd.append("numero_table_bac", form.value.numero_table_bac)
    fd.append("mention_bac", form.value.mention_bac)
    fd.append("etablissement_provenance", form.value.etablissement_provenance)
    fd.append("pays_bac", form.value.pays_bac)
    fd.append("oriente", form.value.oriente || "Non")
    fd.append("numero_orientation", form.value.numero_orientation)
    fd.append("boursier", form.value.boursier || "Non")
    fd.append("denomination_bourse", form.value.denomination_bourse)
    fd.append("organisme_donateur", form.value.organisme_donateur)
    fd.append("numero_bourse", form.value.numero_bourse)
    fd.append("moyenne_bac", form.value.moyenne_bac)
    // Étape 4
    fd.append("institut", form.value.institut)
    fd.append("mention", form.value.mention)
    fd.append("niveau", form.value.niveau)
    fd.append("specialite", form.value.specialite)
    fd.append("annee_academique", form.value.annee_academique)

    // Soumission + téléchargement direct du PDF
    const resp = await axios.post(
        `${API}/api/preinscriptions?download=1`,
        fd,
        {
          responseType: "blob",
          headers: {
            "Accept": "application/pdf",
            "X-Download-Pdf": "1"
          },
          validateStatus: () => true
        }
    )

    // Sécurité : s’assurer qu’on a bien un PDF non vide
    const ct = resp.headers?.["content-type"] || ""
    if (!ct.includes("application/pdf") || !resp.data || (resp.data as Blob).size === 0) {
      let msg = ""
      try { msg = await (resp.data as Blob).text() } catch {}
      throw new Error(`Réponse non-PDF (${resp.status}) ${msg}`.trim())
    }

    // Récup nom de fichier si fourni
    const dispo = resp.headers?.["content-disposition"] || ""
    const m = /filename="?([^"]+)"?/i.exec(dispo)
    const filename = m?.[1] || "attestation_preinscription.pdf"

    // Déclenche le téléchargement
    const url = URL.createObjectURL(resp.data as Blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

  } catch (e:any) {
    submitError.value = e?.response?.data?.message || e?.message || "Erreur lors de la soumission"
  } finally {
    submitting.value = false
  }
}

// ====== ⬇️ Option 2-temps : GET -> blob (bouton dédié) ======
// Utilitaire réutilisable pour télécharger un PDF sans “navigation”
async function downloadPDF(url: string) {
  const resp = await fetch(url, {
    method: "GET",
    headers: { "Accept": "application/pdf" },
  })

  const ct = resp.headers.get("content-type") || ""
  if (!ct.includes("application/pdf")) {
    const text = await resp.text().catch(() => "")
    throw new Error(`Réponse non-PDF (${resp.status}) ${text}`)
  }

  const blob = await resp.blob()
  const dispo = resp.headers.get("content-disposition") || ""
  const m = /filename="?([^"]+)"?/i.exec(dispo)
  const filename = m?.[1] || "attestation_preinscription.pdf"

  const urlObj = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = urlObj
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(urlObj)
}


</script>

<template>
  <!-- CONTAINER GLOBAL -->
  <div class="min-h-screen bg-gray-100">

    <!-- COLONNE GAUCHE (image) : fixe en desktop, masquée en < lg -->
    <!-- Colonne gauche (image) -->
    <div class="fixed top-0 left-0 hidden lg:block lg:w-[clamp(440px,38vw,720px)] h-screen overflow-hidden z-10">
      <div v-for="(src,i) in slides" :key="src"
           class="absolute inset-0 transition-opacity duration-700"
           :class="i===currentSlide ? 'opacity-100' : 'opacity-0'">
        <img :src="src" alt="slide" class="w-full h-full object-fill" />
      </div>
    </div>


    <!-- COLONNE DROITE (formulaire) : occupe toute la largeur en mobile, 62vw en desktop (décalée) -->
    <div class="relative w-full min-h-screen bg-white overflow-y-auto
            px-4 sm:px-6 lg:px-8 py-8
            lg:ml-[calc(clamp(440px,38vw,720px))]
            lg:w-[calc(100vw-(clamp(440px,38vw,720px)))] z-20">

      <div class="w-full max-w-3xl mx-auto">
      <!-- Avatar + Titre -->
      <div class="flex flex-col items-center">
        <img src="../assets/avatar.svg" alt="avatar" class="w-[68px] h-[68px] rounded-full shadow mb-4" />
        <h2 class="text-2xl font-bold tracking-wide text-slate-900 uppercase">Préinscription</h2>
      </div>

      <!-- Progression 4 étapes -->
      <div class="mt-6">
        <div class="flex items-center justify-between gap-2">
          <!-- Etape 1 -->
          <div class="text-center">
            <div
                :class="[
                'w-[34px] h-[34px] rounded-full flex items-center justify-center text-[1.1rem] font-bold border-2',
                step>=1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-blue-700 border-gray-200'
              ]"
            >1</div>
          </div>
          <div :class="['flex-1 h-[3px] mx-1', step>1 ? 'bg-blue-600' : 'bg-gray-200']"></div>

          <!-- Etape 2 -->
          <div class="text-center">
            <div
                :class="[
                'w-[34px] h-[34px] rounded-full flex items-center justify-center text-[1.1rem] font-bold border-2',
                step>=2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-blue-700 border-gray-200'
              ]"
            >2</div>
          </div>
          <div :class="['flex-1 h-[3px] mx-1', step>2 ? 'bg-blue-600' : 'bg-gray-200']"></div>

          <!-- Etape 3 -->
          <div class="text-center">
            <div
                :class="[
                'w-[34px] h-[34px] rounded-full flex items-center justify-center text-[1.1rem] font-bold border-2',
                step>=3 ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-blue-700 border-gray-200'
              ]"
            >3</div>
          </div>
          <div :class="['flex-1 h-[3px] mx-1', step>3 ? 'bg-blue-600' : 'bg-gray-200']"></div>

          <!-- Etape 4 -->
          <div class="text-center">
            <div
                :class="[
                'w-[34px] h-[34px] rounded-full flex items-center justify-center text-[1.1rem] font-bold border-2',
                step>=4 ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-blue-700 border-gray-200'
              ]"
            >4</div>
          </div>
        </div>

        <div class="mt-2 flex justify-between text-[0.97rem] font-medium text-slate-600">
          <span>Étape 1</span><span>Étape 2</span><span>Étape 3</span><span>Étape 4</span>
        </div>
      </div>

      <!-- Message d'erreur étape -->
      <div v-if="stepError" class="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-red-700 text-sm">
        {{ stepError }}
      </div>

      <!-- FORM -->
      <form @submit.prevent="submitForm" class="mt-6 space-y-10">


        <Transition name="step" mode="out-in">  <!-- ÉTAPE 1 -->
  <section v-if="step===1">
    <h3 class="text-center text-blue-700 font-semibold text-[1.3rem] mb-4">Information Personnelle</h3>
    <p class="text-center text-xs text-gray-500 mb-6">
      Les champs marqués d’une <span class="text-red-600 font-bold">*</span> sont obligatoires.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">Nom <span class="text-red-600 font-bold">*</span></label>
        <input class="input-underline" v-model="form.nom" required />
      </div>
      <div>
        <label class="label">Prénom <span class="text-red-600 font-bold">*</span></label>
        <input class="input-underline" v-model="form.prenom" required />
      </div>
      <div>
        <label class="label">Sexe/Genre <span class="text-red-600 font-bold">*</span></label>
        <select class="input-underline" v-model="form.genre" required>
          <option value="">-- Sélectionner le genre --</option>
          <option value="Masculin">Masculin</option>
          <option value="Féminin">Féminin</option>
        </select>
      </div>
      <div>
        <label class="label">Date de naissance <span class="text-red-600 font-bold">*</span></label>
        <input type="date" class="input-underline" v-model="form.date_naissance" required />
      </div>
      <div class="md:col-span-2">
        <label class="label">Lieu de naissance <span class="text-red-600 font-bold">*</span></label>
        <input class="input-underline" v-model="form.lieu_naissance" required />
      </div>
      <div>
        <label class="label">Nationalité <span class="text-red-600 font-bold">*</span></label>
        <select class="input-underline" v-model="form.nationalite" required>
          <option value="">Nationalité</option>
          <option v-for="n in nationalites" :key="n" :value="n">{{n}}  </option>
        </select>
      </div>
      <div>
        <label class="label">Situation matrimoniale</label>
        <select class="input-underline" v-model="form.situation_matrimoniale">
          <option value="">Situation maritale</option>
          <option value="Célibataire">Célibataire</option>
          <option value="Fiancé(e)">Fiancé(e)</option>
          <option value="Marié(e)">Marié(e)</option>
          <option value="Divorcé(e)">Divorcé(e)</option>
          <option value="Veuf(ve)">Veuf(ve)</option>
          <option value="Séparé(e)">Séparé(e)</option>
          <option value="Pacsé(e)">Pacsé(e)</option>
          <option value="Concubin(e)">Concubin(e)</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col items-center mt-8">
      <button type="button" class="btn-submit" @click="nextFromStep1">Suivant</button>
      <p v-if="step1Error" class="text-red-600 font-semibold mt-2">{{ step1Error }}</p>
    </div>
  </section>
</transition>



        <Transition name="step" mode="out-in">
          <!-- ÉTAPE 2 -->
          <section v-if="step===2">
            <h3 class="text-center text-blue-700 font-semibold text-[1.3rem] mb-4">Contacts</h3>
            <p class="text-center text-xs text-gray-500 mb-6">
              Les champs marqués d’une <span class="text-red-600 font-bold">*</span> sont obligatoires.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="label">Téléphone WhatsApp (perso) <span class="text-red-600 font-bold">*</span></label>
                <input class="input-underline" v-model="form.telephone_etudiant" placeholder="+241XXXXXXXX" required />
              </div>
              <div>
                <label class="label">Téléphone parent/tuteur</label>
                <input class="input-underline" v-model="form.telephone_parent" placeholder="+241XXXXXXXX" />
              </div>
              <div>
                <label class="label">Adresse e-mail</label>
                <input type="email" class="input-underline" v-model="form.email" placeholder="ex: etudiant@email.com" />
              </div>
              <div>
                <label class="label">Lieu de résidence <span class="text-red-600 font-bold">*</span></label>
                <input class="input-underline" v-model="form.lieu_residence" required />
              </div>
              <div class="md:col-span-2">
                <label class="label">Photo d'identité</label>
                <input
                    type="file"
                    class="input-underline file:border-0 file:bg-transparent file:text-sm file:px-0"
                    accept=".jpg,.jpeg,.png"
                    @change="(e: Event) => (form.photo = (e.target as HTMLInputElement).files?.[0] ?? null)"
                />
              </div>
            </div>

            <div class="mt-8 flex items-center justify-between">
              <button type="button" class="btn-back" @click="prev">Précédent</button>
              <button type="button" class="btn-submit" @click="next">Suivant</button>
            </div>
          </section>
        </Transition>



        <Transition name="step" mode="out-in">
          <section v-if="step===3">
            <h3 class="text-center text-blue-700 font-semibold text-[1.3rem] mb-4">Bac & Parcours</h3>
            <p class="text-center text-xs text-gray-500 mb-6">
              Les champs marqués d’une <span class="text-red-600 font-bold">*</span> sont obligatoires.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="label">Série du Bac <span class="text-red-600 font-bold">*</span></label>
                <select class="input-underline" v-model="form.serie_bac" required>
                  <option value="">--Choisir une série--</option>
                  <option value="A1">A1</option><option value="A2">A2</option>
                  <option value="B">B</option><option value="C">C</option><option value="D">D</option>
                </select>
              </div>
              <div>
                <label class="label">Année du Bac <span class="text-red-600 font-bold">*</span></label>
                <select class="input-underline" v-model="form.annee_bac" required>
                  <option value="">--Choisir--</option>
                  <option
                      v-for="year in Array.from({length: (new Date().getFullYear()-1990+1)},(_,i)=> (new Date().getFullYear()-i))"
                      :key="year"
                      :value="String(year)"
                  >
                    {{ year }}
                  </option>
                </select>
              </div>

              <div>
                <label class="label">Numéro table Bac</label>
                <input class="input-underline" v-model="form.numero_table_bac" />
              </div>
              <div>
                <label class="label">Mention obtenue au Bac <span class="text-red-600 font-bold">*</span></label>
                <select class="input-underline" v-model="form.mention_bac" required>
                  <option value="">-- Choisir la mention --</option>
                  <option>Passable</option><option>Assez bien</option><option>Bien</option><option>Très bien</option>
                </select>
              </div>

              <div>
                <label class="label">Établissement de provenance <span class="text-red-600 font-bold">*</span></label>
                <input class="input-underline" v-model="form.etablissement_provenance" required />
              </div>
              <div>
                <label class="label">Pays d'obtention du Bac <span class="text-red-600 font-bold">*</span></label>
                <input class="input-underline" v-model="form.pays_bac" required />
              </div>

              <div>
                <label class="label">Êtes-vous orienté(e) <span class="text-red-600 font-bold">*</span></label>
                <select class="input-underline" v-model="form.oriente" required>
                  <option value="">-- Sélectionner --</option>
                  <option>Oui</option><option>Non</option>
                </select>
              </div>
              <div v-show="showNumOrientation">
                <label class="label">Numéro d'orientation <span class="text-red-600 font-bold">*</span></label>
                <input class="input-underline" v-model="form.numero_orientation" />
              </div>

              <div>
                <label class="label">Êtes-vous boursier(ère) ? <span class="text-red-600 font-bold">*</span></label>
                <select class="input-underline" v-model="form.boursier" required>
                  <option value="">-- Sélectionner --</option>
                  <option>Oui</option><option>Non</option>
                </select>
              </div>
              <div v-show="showBourse" class="space-y-3">
                <div>
                  <label class="label">Dénomination bourse <span class="text-red-600 font-bold">*</span></label>
                  <input class="input-underline" v-model="form.denomination_bourse" />
                </div>
                <div>
                  <label class="label">Organisme donateur <span class="text-red-600 font-bold">*</span></label>
                  <input class="input-underline" v-model="form.organisme_donateur" />
                </div>
                <div>
                  <label class="label">Numéro bourse <span class="text-red-600 font-bold">*</span></label>
                  <input class="input-underline" v-model="form.numero_bourse" />
                </div>
              </div>

              <div>
                <label class="label">Moyenne Bac</label>
                <input type="number" step="0.01" class="input-underline" v-model="form.moyenne_bac" />
              </div>
            </div>

            <div class="mt-8 flex items-center justify-between">
              <button type="button" class="btn-back" @click="prev">Précédent</button>
              <button type="button" class="btn-submit" @click="next">Suivant</button>
            </div>
          </section>
        </Transition>

        <Transition name="step" mode="out-in">
          <section v-if="step===4">
            <h3 class="text-center text-blue-700 font-semibold text-[1.3rem] mb-4">Choix d’orientation</h3>
            <p class="text-center text-xs text-gray-500 mb-6">
              Les champs marqués d’une <span class="text-red-600 font-bold">*</span> sont obligatoires.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="label">Institut <span class="text-red-600 font-bold">*</span></label>
                <select class="input-underline" v-model="form.institut" required>
                  <option value="">-- Choisir un institut --</option>
                  <option v-for="f in facultes" :key="f.idanfac" :value="String(f.idanfac)">{{ f.fac }}</option>
                </select>
              </div>
              <div>
                <label class="label">Mention <span class="text-red-600 font-bold">*</span></label>
                <select class="input-underline" v-model="form.mention" :disabled="!form.institut" required>
                  <option value="">-- Choisir une mention --</option>
                  <option v-for="m in mentions" :key="m.idanfacdept" :value="String(m.idanfacdept)">
                    {{ m.departement }}
                  </option>
                </select>
              </div>
              <div>
                <label class="label">Niveau <span class="text-red-600 font-bold">*</span></label>
                <select class="input-underline" v-model="form.niveau" :disabled="!form.mention" required>
                  <option value="">-- Choisir un niveau --</option>
                  <option v-for="n in niveaux" :key="n.idanfdn" :value="String(n.idanfdn)">{{ n.niveau }}</option>
                </select>
              </div>
              <div>
                <label class="label">Spécialité <span class="text-red-600 font-bold">*</span></label>
                <select class="input-underline" v-model="form.specialite" :disabled="!form.niveau" required>
                  <option value="">-- Choisir une spécialité --</option>
                  <option v-for="p in parcours" :key="p.idafdnp" :value="String(p.idafdnp)">{{ p.libelle }}</option>
                </select>
              </div>
              <div>
                <label class="label">Année académique</label>
                <input class="input-underline" v-model="form.annee_academique" readonly />
              </div>
            </div>

            <div class="mt-8 flex items-center justify-between">
              <button type="button" class="btn-back" @click="prev">Précédent</button>

              <button type="submit"
                      class="btn-submit !bg-gradient-to-r !from-emerald-600 !to-emerald-600 disabled:opacity-70"
                      :disabled="submitting">
                <span v-if="!submitting">Valider et Télécharger Mon Attestation</span>
                <span v-else class="inline-flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"/>
                </svg>
                Génération...
              </span>
              </button>
            </div>

            <div v-if="submitError" class="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-red-700 text-sm">
              {{ submitError }}
            </div>
          </section>

        </Transition>
      </form>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Labels uniformes */
.label{
  @apply text-sm font-medium text-slate-800;
}

/* Inputs: pas de bordure, seulement une bordure basse, fond transparent, focus vert */
.input-underline{
  @apply w-full bg-transparent border-0 border-b border-gray-300 rounded-none
  py-3 text-sm outline-none focus:ring-0 focus:border-emerald-500;
}

/* Bouton "Précédent" orange */
.btn-back{
  @apply inline-flex items-center justify-center font-semibold text-white
  px-6 py-2.5 text-[1.08rem] rounded-full bg-orange-500 hover:bg-orange-600;
}

/* Bouton principal dégradé émeraude -> teal (effet inverse au hover) */
.btn-submit{
  @apply inline-flex items-center justify-center font-semibold text-white
  px-6 py-2.5 text-[1.08rem] rounded-full
  bg-gradient-to-r from-emerald-500 to-teal-500
  hover:from-teal-500 hover:to-emerald-500 transition-colors;
}

select {
  color: #0f172a !important;          /* slate-900 */
  background-color: transparent;
}
select option {
  color: #0f172a !important;          /* texte lisible dans le popup */
}
select:disabled {
  color: #9ca3af !important;          /* gray-400 quand disabled */
}

.input-underline{
  @apply w-full bg-transparent border-0 border-b border-gray-300 rounded-none
  py-3 text-sm placeholder-slate-500 focus:ring-0 focus:border-emerald-500;
  color: #0f172a !important;          /* force la couleur du texte */
}
.input-underline option{
  color: #0f172a !important;
}


/* Animation d’apparition (équivalent au fadeInSlide du CSS original) */
@keyframes fadeInSlide{
  0%{ opacity:0; transform:translateX(30px); }
  100%{ opacity:1; transform:translateX(0); }
}

/* === Transition entre étapes (Vue <Transition name="step">) === */
.step-enter-active,
.step-leave-active {
  transition: opacity 280ms ease, transform 320ms ease;
}
.step-enter-from,
.step-leave-to {
  opacity: 0;
  transform: translateX(28px); /* petit slide latéral */
}
/* Option : rendre la sortie un peu plus légère */
.step-leave-active { position: absolute; width: 100%; }

</style>
