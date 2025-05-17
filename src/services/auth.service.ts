import axios from 'axios'

export async function login(email: string, password: string) {
    const response = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password
    })

    const user = response.data

    localStorage.setItem('user', JSON.stringify(user))

    return user
}
