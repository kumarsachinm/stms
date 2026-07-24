import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { fallbackBookings, fallbackStudents, fallbackTutors } from './mockData'
import {
  createBooking,
  createStudent,
  deleteStudent,
  getBookings,
  getStudents,
  getTutors,
  updateStudent,
} from './api'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import ReportsPage from './pages/ReportsPage'
import StudentsPage from './pages/StudentsPage'
import SyllabusPage from './pages/SyllabusPage'
import TutorsPage from './pages/TutorsPage'

function App() {
  const location = useLocation()
  const [tutors, setTutors] = useState([])
  const [students, setStudents] = useState([])
  const [bookings, setBookings] = useState([])
  const [authUser, setAuthUser] = useState(() => {
    if (typeof window === 'undefined') return null

    try {
      const storedUser = window.localStorage.getItem('stms-auth-user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })
  const [message, setMessage] = useState('')
  const [bookingForm, setBookingForm] = useState({ tutorId: '', slot: '6:00 PM - 7:00 PM' })

  useEffect(() => {
    if (authUser) {
      window.localStorage.setItem('stms-auth-user', JSON.stringify(authUser))
    } else {
      window.localStorage.removeItem('stms-auth-user')
    }
  }, [authUser])

  useEffect(() => {
    async function loadData() {
      try {
        const [tutorResult, studentResult, bookingResult] = await Promise.all([
          getTutors(),
          getStudents(),
          getBookings(),
        ])
        setTutors(tutorResult.tutors || [])
        setStudents(studentResult.students || [])
        setBookings(bookingResult.bookings || [])
        if (tutorResult.tutors?.length) {
          setBookingForm((current) => ({ ...current, tutorId: String(tutorResult.tutors[0].id) }))
        }
      } catch (error) {
        setTutors(fallbackTutors)
        setStudents(fallbackStudents)
        setBookings(fallbackBookings)
        if (fallbackTutors.length) {
          setBookingForm((current) => ({ ...current, tutorId: String(fallbackTutors[0].id) }))
        }
        setMessage('Showing demo data because the API is currently unavailable.')
      }
    }

    loadData()
  }, [])

  const myBookings = useMemo(() => {
    if (!authUser) return []
    return bookings.filter((booking) => String(booking.studentId) === String(authUser.id) || String(booking.tutorId) === String(authUser.id))
  }, [authUser, bookings])

  const handleLogout = () => {
    setAuthUser(null)
    setMessage('You have been logged out.')
  }

  const handleBookingSubmit = async (event) => {
    event.preventDefault()
    if (!authUser) {
      setMessage('Please sign in before booking a tutor.')
      return
    }

    try {
      const result = await createBooking({
        tutorId: Number(bookingForm.tutorId),
        studentId: authUser.id,
        slot: bookingForm.slot,
        requestNote: `${authUser.name} requested a live session.`,
      })
      setBookings((current) => [result.booking, ...current])
      setMessage(`Booking request sent to ${result.booking.tutorName}. Tutor acknowledged instantly.`)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleStudentCreate = async (payload) => {
    try {
      const result = await createStudent(payload)
      setStudents((current) => [result.student, ...current])
      setMessage(`Student profile created for ${result.student.name}.`)
      return result.student
    } catch (error) {
      setMessage(error.message)
      throw error
    }
  }

  const handleStudentUpdate = async (studentId, payload) => {
    try {
      const result = await updateStudent(studentId, payload)
      setStudents((current) => current.map((student) => (String(student.id) === String(studentId) ? result.student : student)))
      setMessage(`Updated ${result.student.name}'s profile.`)
      return result.student
    } catch (error) {
      setMessage(error.message)
      throw error
    }
  }

  const handleStudentDelete = async (studentId) => {
    try {
      const result = await deleteStudent(studentId)
      setStudents((current) => current.filter((student) => String(student.id) !== String(studentId)))
      setMessage(result.message || 'Student profile removed.')
    } catch (error) {
      setMessage(error.message)
      throw error
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Smart Tuition Management System</span>
          <h1>Science and Maths Tuitions for class 9 to 12</h1>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/syllabus">Syllabus</Link>
          <Link to="/tutors">Tutors</Link>
          <Link to="/students">Students</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/contact">Contact</Link>
          {authUser ? (
            <>
              <span className="nav-user">Hi, {authUser.name}</span>
              <button type="button" className="secondary-button" onClick={handleLogout}>Logout</button>
            </>
          ) : null}
        </nav>
      </header>

      {message ? <div className="message-box">{message}</div> : null}

      <main>
        <Routes location={location}>
          <Route path="/" element={<HomePage message={message} setMessage={setMessage} authUser={authUser} setAuthUser={setAuthUser} tutors={tutors} students={students} />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/tutors" element={<TutorsPage tutors={tutors} authUser={authUser} />} />
          <Route path="/students" element={<StudentsPage students={students} authUser={authUser} bookingForm={bookingForm} setBookingForm={setBookingForm} handleBookingSubmit={handleBookingSubmit} myBookings={myBookings} tutors={tutors} onStudentCreate={handleStudentCreate} onStudentUpdate={handleStudentUpdate} onStudentDelete={handleStudentDelete} />} />
          <Route path="/reports" element={<ReportsPage students={students} />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
