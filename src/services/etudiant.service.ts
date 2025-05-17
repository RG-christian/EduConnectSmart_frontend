import axios from 'axios'

const API_URL = 'http://localhost:4000/api/etudiants'

export async function getEtudiant(id: string) {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
}

export async function updateEtudiant(id: string, data: Partial<{ telephone: string; motDePasse: string }>) {
    await axios.patch(`${API_URL}/${id}`, data)
}
