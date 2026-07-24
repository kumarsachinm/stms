import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  authGoogle,
  authLogin,
  authRegister,
} from '../api'

const defaultAuthForm = {
  role: 'student',
  name: '',
  email: '',
  password: '',
  classLevel: '10',
  topic: 'Algebra',
  offerRate: '250',
  subject: 'Mathematics',
  topics: 'Algebra, Mensuration',
  hourlyRate: '300',
  age: '28',
  experience: '4',
}

function HomePage({ message, setMessage, authUser, setAuthUser, tutors, students }) {
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState(defaultAuthForm)

  const handleAuthChange = (field, value) => {
    setAuthForm((current) => ({ ...current, [field]: value }))
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    try {
      const payload = {
        ...authForm,
        hourlyRate: Number(authForm.hourlyRate || 0),
        offerRate: Number(authForm.offerRate || 0),
      }

      const result = authMode === 'login'
        ? await authLogin({ email: payload.email, password: payload.password, role: payload.role })
        : await authRegister(payload)

      setAuthUser(result.user)
      setMessage(authMode === 'login' ? `Welcome back, ${result.user.name}` : `Account created for ${result.user.name}`)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await authGoogle({ role: authForm.role, name: authForm.name || 'Google learner', email: authForm.email || 'google@demo.com' })
      setAuthUser(result.user)
      setMessage(`Signed in with Google as ${result.user.name}`)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="pill">Academic-focused learning platform</span>
          <h2>Register, discover CBSE Tutors, and book online classes with confidence.</h2>
          <p>Students and Tutors from classes 9 to 12 can join a secure marketplace for maths and science, explore the full CBSE syllabus, and book live sessions by the hour.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/tutors">Explore Tutors</Link>
            <Link className="secondary-button" to="/syllabus">View Syllabus</Link>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Login</button>
            <button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Register</button>
          </div>

          <form onSubmit={handleAuthSubmit}>
            {authMode === 'register' ? (
              <>
                <label>
                  I am a
                  <select value={authForm.role} onChange={(event) => handleAuthChange('role', event.target.value)}>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                  </select>
                </label>
                <label>
                  Full name
                  <input value={authForm.name} onChange={(event) => handleAuthChange('name', event.target.value)} placeholder="Aarav Mehta" />
                </label>
              </>
            ) : null}
            <label>
              Email
              <input type="email" value={authForm.email} onChange={(event) => handleAuthChange('email', event.target.value)} placeholder="name@example.com" />
            </label>
            <label>
              Password
              <input type="password" value={authForm.password} onChange={(event) => handleAuthChange('password', event.target.value)} placeholder="Enter password" />
            </label>

            {authMode === 'register' && authForm.role === 'student' ? (
              <>
                <label>
                  Class
                  <select value={authForm.classLevel} onChange={(event) => handleAuthChange('classLevel', event.target.value)}>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </label>
                <label>
                  Preferred topic
                  <input value={authForm.topic} onChange={(event) => handleAuthChange('topic', event.target.value)} placeholder="Probability" />
                </label>
                <label>
                  Your hourly offer (₹)
                  <input type="number" min="100" step="100" value={authForm.offerRate} onChange={(event) => handleAuthChange('offerRate', event.target.value)} />
                </label>
              </>
            ) : null}

            {authMode === 'register' && authForm.role === 'tutor' ? (
              <>
                <label>
                  Subject
                  <select value={authForm.subject} onChange={(event) => handleAuthChange('subject', event.target.value)}>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                  </select>
                </label>
                <label>
                  Topics (comma separated)
                  <input value={authForm.topics} onChange={(event) => handleAuthChange('topics', event.target.value)} placeholder="Probability, Trigonometry" />
                </label>
                <label>
                  Hourly rate (₹)
                  <input type="number" min="100" step="100" max="500" value={authForm.hourlyRate} onChange={(event) => handleAuthChange('hourlyRate', event.target.value)} />
                </label>
                <label>
                  Age
                  <input value={authForm.age} onChange={(event) => handleAuthChange('age', event.target.value)} placeholder="28" />
                </label>
                <label>
                  Experience (years)
                  <input value={authForm.experience} onChange={(event) => handleAuthChange('experience', event.target.value)} placeholder="4" />
                </label>
              </>
            ) : null}

            <button type="submit" className="primary-button">{authMode === 'login' ? 'Login' : 'Create account'}</button>
          </form>

          <button type="button" className="secondary-button google-button" onClick={handleGoogleLogin}>Continue with Google</button>
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <span className="pill">{authUser ? 'Welcome back' : 'Welcome'}</span>
          <h3>{authUser ? (authUser.role === 'tutor' ? `Welcome tutor ${authUser.name}` : `Welcome student ${authUser.name}`) : 'Start your learning journey with trusted CBSE support'}</h3>
        </div>
        {authUser ? (
          <>
            <p className="muted">
              {authUser.role === 'tutor'
                ? 'Students are looking for maths and science guidance. Open the Students page to connect with learners and plan sessions.'
                : 'Tutors are ready to help with CBSE exams. Open the Tutors page to find the best mentor for your goals.'}
            </p>
            <div className="card-grid">
              {authUser.role === 'student' ? tutors.slice(0, 3).map((tutor) => (
                <div className="profile-card" key={tutor.id}>
                  <h4>{tutor.name}</h4>
                  <p>{tutor.subject} · {tutor.experience} years</p>
                  <p>₹{tutor.hourlyRate}/hour</p>
                </div>
              )) : students.slice(0, 3).map((student) => (
                <div className="profile-card" key={student.id}>
                  <h4>{student.name}</h4>
                  <p>Class {student.classLevel} · {student.topic}</p>
                  <p>Offer ₹{student.offerRate}/hr</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="muted">Use the navigation above to browse the syllabus, explore Tutors, view students, or reach the contact team.</p>
        )}
      </section>
    </>
  )
}

export default HomePage
