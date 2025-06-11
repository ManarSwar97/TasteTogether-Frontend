import Client from './api'
export const RegisterUser = async (formData) => {
  try {
    const res = await Client.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return res.data
  } catch (error) {
    throw error
  }
}
export const SignInUser = async (data) => {
  try {
    const res = await Client.post('/auth/login', data)
    // Set the current signed in users token to localStorage
    localStorage.setItem('token', res.data.token)
    return res.data.user
  } catch (error) {
    throw error
  }
}

export const CheckSession = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null

    const res = await Client.get('/auth/session', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return res.data
  } catch (error) {
    throw error
  }
}

