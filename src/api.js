const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export function getHealth() {
  return request('/health')
}

export function authLogin(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function authRegister(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function authGoogle(payload) {
  return request('/auth/google', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getTutors() {
  return request('/tutors')
}

export function getStudents() {
  return request('/students')
}

export function createStudent(payload) {
  return request('/students', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateStudent(studentId, payload) {
  return request(`/students/${studentId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteStudent(studentId) {
  return request(`/students/${studentId}`, {
    method: 'DELETE',
  })
}

export function getBookings() {
  return request('/bookings')
}

export function createBooking(payload) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
