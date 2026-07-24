import http from 'node:http'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataFile = path.join(__dirname, 'server-data.json')

const defaultState = {
  users: [
    {
      id: 1,
      role: 'tutor',
      name: 'Maya Iyer',
      email: 'maya@demo.com',
      password: 'demo123',
    },
    {
      id: 2,
      role: 'student',
      name: 'Aarav Mehta',
      email: 'aarav@demo.com',
      password: 'demo123',
    },
  ],
  tutors: [
    {
      id: 101,
      name: 'Maya Iyer',
      age: 29,
      experience: 6,
      subject: 'Mathematics',
      topics: ['Algebra', 'Trigonometry', 'Calculus'],
      hourlyRate: 300,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 102,
      name: 'Ravi Nair',
      age: 31,
      experience: 8,
      subject: 'Science',
      topics: ['Physics', 'Chemistry', 'Biology'],
      hourlyRate: 400,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 103,
      name: 'Sneha Joshi',
      age: 27,
      experience: 4,
      subject: 'Mathematics',
      topics: ['Statistics', 'Probability', 'Mensuration'],
      hourlyRate: 200,
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 104,
      name: 'Anirban Sen',
      age: 35,
      experience: 10,
      subject: 'Science',
      topics: ['Modern Physics', 'Electrochemistry', 'Human Physiology'],
      hourlyRate: 500,
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 105,
      name: 'Parul Kaur',
      age: 26,
      experience: 3,
      subject: 'Mathematics',
      topics: ['Geometry', 'Algebra', 'Vectors'],
      hourlyRate: 250,
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 106,
      name: 'Devansh Rao',
      age: 33,
      experience: 7,
      subject: 'Science',
      topics: ['Light', 'Electricity', 'Motion'],
      hourlyRate: 350,
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 107,
      name: 'Nikhil Verma',
      age: 30,
      experience: 5,
      subject: 'Mathematics',
      topics: ['Number Systems', 'Trigonometry', 'Statistics'],
      hourlyRate: 300,
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 108,
      name: 'Karan Malhotra',
      age: 32,
      experience: 9,
      subject: 'Science',
      topics: ['Chemistry', 'Biology', 'Thermodynamics'],
      hourlyRate: 450,
      photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 109,
      name: 'Ishita Bhatia',
      age: 28,
      experience: 4,
      subject: 'Mathematics',
      topics: ['Calculus', 'Probability', 'Algebra'],
      hourlyRate: 280,
      photo: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 110,
      name: 'Omkar Sharma',
      age: 34,
      experience: 8,
      subject: 'Science',
      topics: ['Physics', 'Biology', 'Electrochemistry'],
      hourlyRate: 400,
      photo: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80',
    },
  ],
  students: [
    {
      id: 201,
      name: 'Aarav Mehta',
      classLevel: '10',
      topic: 'Algebra',
      offerRate: 250,
      email: 'aarav@demo.com',
    },
    {
      id: 202,
      name: 'Naina Singh',
      classLevel: '9',
      topic: 'Geometry',
      offerRate: 220,
    },
    {
      id: 203,
      name: 'Kabir Patel',
      classLevel: '12',
      topic: 'Calculus',
      offerRate: 300,
    },
    {
      id: 204,
      name: 'Meera Rao',
      classLevel: '11',
      topic: 'Chemistry',
      offerRate: 260,
    },
    {
      id: 205,
      name: 'Tanishq Das',
      classLevel: '10',
      topic: 'Probability',
      offerRate: 240,
    },
    {
      id: 206,
      name: 'Sakshi Gupta',
      classLevel: '9',
      topic: 'Mensuration',
      offerRate: 210,
    },
    {
      id: 207,
      name: 'Vikram Jain',
      classLevel: '12',
      topic: 'Modern Physics',
      offerRate: 320,
    },
    {
      id: 208,
      name: 'Pooja Menon',
      classLevel: '11',
      topic: 'Biology',
      offerRate: 270,
    },
    {
      id: 209,
      name: 'Aditya Chawla',
      classLevel: '10',
      topic: 'Trigonometry',
      offerRate: 230,
    },
    {
      id: 210,
      name: 'Ritika Sharma',
      classLevel: '12',
      topic: 'Electrochemistry',
      offerRate: 290,
    },
    {
      id: 211,
      name: 'Harshit Rawat',
      classLevel: '9',
      topic: 'Number Systems',
      offerRate: 200,
    },
    {
      id: 212,
      name: 'Divya Kapoor',
      classLevel: '11',
      topic: 'Statistics',
      offerRate: 240,
    },
    {
      id: 213,
      name: 'Yash Arora',
      classLevel: '10',
      topic: 'Light',
      offerRate: 230,
    },
    {
      id: 214,
      name: 'Ananya Bose',
      classLevel: '12',
      topic: 'Vectors',
      offerRate: 300,
    },
    {
      id: 215,
      name: 'Raghav Thakur',
      classLevel: '9',
      topic: 'Force and Laws',
      offerRate: 220,
    },
    {
      id: 216,
      name: 'Kavya Sood',
      classLevel: '11',
      topic: 'Thermodynamics',
      offerRate: 250,
    },
    {
      id: 217,
      name: 'Nikhil Bhatt',
      classLevel: '10',
      topic: 'Surface Area',
      offerRate: 210,
    },
    {
      id: 218,
      name: 'Mansi Iyer',
      classLevel: '12',
      topic: 'Human Physiology',
      offerRate: 280,
    },
    {
      id: 219,
      name: 'Siddharth Kumar',
      classLevel: '9',
      topic: 'Natural Resources',
      offerRate: 205,
    },
    {
      id: 220,
      name: 'Ira Nanda',
      classLevel: '11',
      topic: 'Organic Chemistry',
      offerRate: 260,
    },
  ],
  bookings: [],
}

function loadState() {
  if (!existsSync(dataFile)) {
    saveState(defaultState)
    return structuredClone(defaultState)
  }

  try {
    const parsed = JSON.parse(readFileSync(dataFile, 'utf8'))
    const parsedStudents = Array.isArray(parsed.students) ? parsed.students : []
    const parsedTutors = Array.isArray(parsed.tutors) ? parsed.tutors : []
    const parsedUsers = Array.isArray(parsed.users) ? parsed.users : []
    const parsedBookings = Array.isArray(parsed.bookings) ? parsed.bookings : []

    return {
      ...structuredClone(defaultState),
      ...parsed,
      users: parsedUsers.length ? parsedUsers : defaultState.users,
      tutors: parsedTutors.length ? parsedTutors : defaultState.tutors,
      students: (parsedStudents.length ? parsedStudents : defaultState.students).map((student, index) => createStudentProfile({ ...student, id: student.id || index + 201 }, student.id || index + 201)),
      bookings: parsedBookings.length ? parsedBookings : defaultState.bookings,
    }
  } catch {
    saveState(defaultState)
    return structuredClone(defaultState)
  }
}

function saveState(state) {
  writeFileSync(dataFile, JSON.stringify(state, null, 2))
}

let state = loadState()

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(payload))
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        const parsed = JSON.parse(body)
        resolve(parsed && typeof parsed === 'object' ? parsed : {})
      } catch {
        resolve({})
      }
    })
  })
}

function createTutorProfile(body, id) {
  return {
    id,
    name: body.name,
    age: Number(body.age || 25),
    experience: Number(body.experience || 1),
    subject: body.subject || 'Mathematics',
    topics: String(body.topics || 'Algebra').split(',').map((topic) => topic.trim()).filter(Boolean),
    hourlyRate: Number(body.hourlyRate || 300),
    photo: body.photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  }
}

function createStudentProfile(body, id) {
  const subjects = Array.isArray(body.subjects)
    ? body.subjects
    : String(body.subjects || body.topic || 'Mathematics').split(',').map((subject) => subject.trim()).filter(Boolean)

  const attendance = Array.isArray(body.attendance) ? body.attendance : []
  const payments = Array.isArray(body.payments) ? body.payments : []

  return {
    id,
    name: body.name || 'Student',
    classLevel: body.classLevel || '10',
    topic: body.topic || 'Algebra',
    offerRate: Number(body.offerRate || 200),
    email: body.email || '',
    feePerSubject: Number(body.feePerSubject || body.offerRate || 250),
    subjects,
    amountPaid: Number(body.amountPaid || 0),
    attendance,
    payments,
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true, message: 'CBSE tuition marketplace API is running' })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    const body = await parseJsonBody(req)
    if (!body.name || !body.email || !body.password) {
      sendJson(res, 400, { error: 'Please enter your name, email, and password.' })
      return
    }

    const existing = state.users.find((entry) => entry.email.toLowerCase() === String(body.email || '').toLowerCase())
    if (existing) {
      sendJson(res, 409, { error: 'An account with this email already exists.' })
      return
    }

    const id = Date.now()
    const role = body.role === 'tutor' ? 'tutor' : 'student'
    const user = {
      id,
      role,
      name: body.name,
      email: body.email,
      password: body.password,
    }

    if (role === 'tutor') {
      state.tutors.unshift(createTutorProfile({ ...body, name: user.name, email: user.email }, id))
    } else {
      state.students.unshift(createStudentProfile({ ...body, name: user.name, email: user.email }, id))
    }

    state.users.unshift(user)
    saveState(state)
    sendJson(res, 201, { user })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await parseJsonBody(req)
    const requestedRole = body.role === 'tutor' ? 'tutor' : 'student'
    const user = state.users.find((entry) => entry.email.toLowerCase() === String(body.email || '').toLowerCase() && entry.password === String(body.password || ''))

    if (!user) {
      sendJson(res, 401, { error: 'Invalid email or password.' })
      return
    }

    if (user.role !== requestedRole && requestedRole !== 'student') {
      sendJson(res, 403, { error: 'This account is registered as a different role.' })
      return
    }

    sendJson(res, 200, { user })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/google') {
    const body = await parseJsonBody(req)
    const email = String(body.email || '').toLowerCase()
    if (!email) {
      sendJson(res, 400, { error: 'Google email is required.' })
      return
    }

    let user = state.users.find((entry) => entry.email.toLowerCase() === email)
    if (!user) {
      const id = Date.now()
      user = {
        id,
        role: body.role || 'student',
        name: body.name || 'Google user',
        email,
        password: 'google-auth',
      }
      state.users.unshift(user)
      if (user.role === 'tutor') {
        state.tutors.unshift(createTutorProfile({ ...body, name: user.name, email, hourlyRate: 300 }, id))
      } else {
        state.students.unshift(createStudentProfile({ ...body, name: user.name, email, classLevel: '10' }, id))
      }
      saveState(state)
    }

    sendJson(res, 200, { user })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/tutors') {
    sendJson(res, 200, { tutors: state.tutors })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/students') {
    sendJson(res, 200, { students: state.students })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/students') {
    const body = await parseJsonBody(req)
    if (!body.name || !body.email) {
      sendJson(res, 400, { error: 'Please enter a name and email for the student profile.' })
      return
    }

    const student = createStudentProfile(body, Date.now())
    state.students.unshift(student)
    saveState(state)
    sendJson(res, 201, { student })
    return
  }

  if (req.method === 'PUT' && url.pathname.startsWith('/api/students/')) {
    const studentId = Number(url.pathname.split('/').pop())
    const body = await parseJsonBody(req)
    const index = state.students.findIndex((entry) => entry.id === studentId)

    if (index === -1) {
      sendJson(res, 404, { error: 'Student not found.' })
      return
    }

    const existing = state.students[index]
    const updatedStudent = createStudentProfile({ ...existing, ...body, id: existing.id }, existing.id)
    state.students[index] = updatedStudent
    saveState(state)
    sendJson(res, 200, { student: updatedStudent })
    return
  }

  if (req.method === 'DELETE' && url.pathname.startsWith('/api/students/')) {
    const studentId = Number(url.pathname.split('/').pop())
    const nextStudents = state.students.filter((entry) => entry.id !== studentId)

    if (nextStudents.length === state.students.length) {
      sendJson(res, 404, { error: 'Student not found.' })
      return
    }

    state.students = nextStudents
    saveState(state)
    sendJson(res, 200, { message: 'Student profile removed.' })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/bookings') {
    sendJson(res, 200, { bookings: state.bookings })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/bookings') {
    const body = await parseJsonBody(req)
    const tutor = state.tutors.find((entry) => entry.id === Number(body.tutorId))
    const student = state.students.find((entry) => entry.id === Number(body.studentId))

    if (!tutor || !student) {
      sendJson(res, 404, { error: 'Tutor or student not found.' })
      return
    }

    const booking = {
      id: Date.now(),
      tutorId: tutor.id,
      tutorName: tutor.name,
      studentId: student.id,
      studentName: student.name,
      slot: body.slot || '6:00 PM - 7:00 PM',
      status: 'Tutor acknowledged',
      requestedAt: new Date().toISOString(),
    }

    state.bookings.unshift(booking)
    saveState(state)
    sendJson(res, 201, { booking })
    return
  }

  sendJson(res, 404, { error: 'Route not found' })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, '0.0.0.0', () => {
  console.log(`CBSE tuition marketplace API running on http://localhost:${PORT}`)
})
