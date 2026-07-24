import { useEffect, useMemo, useState } from 'react'
import { calculateAttendancePercentage, calculateFeeSummary, summarizeMonthlyRevenue } from '../utils/studentAnalytics'

const createEmptyStudentForm = () => ({
  name: '',
  email: '',
  classLevel: '10',
  topic: 'Algebra',
  offerRate: '250',
  feePerSubject: '250',
  subjects: 'Mathematics, Science',
  amountPaid: '0',
  attendanceDate: new Date().toISOString().slice(0, 10),
  paymentAmount: '250',
})

function StudentsPage({ students, authUser, bookingForm, setBookingForm, handleBookingSubmit, myBookings, tutors, onStudentCreate, onStudentUpdate, onStudentDelete }) {
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [studentForm, setStudentForm] = useState(createEmptyStudentForm())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const visibleStudents = students.slice(0, 12)
  const selectedStudent = students.find((student) => String(student.id) === String(selectedStudentId)) || visibleStudents[0] || null

  useEffect(() => {
    if (!students.length) {
      setSelectedStudentId(null)
      setStudentForm(createEmptyStudentForm())
      return
    }

    if (!selectedStudentId || !students.some((student) => String(student.id) === String(selectedStudentId))) {
      setSelectedStudentId(students[0].id)
    }
  }, [selectedStudentId, students])

  useEffect(() => {
    if (!selectedStudent) {
      setStudentForm(createEmptyStudentForm())
      return
    }

    setStudentForm((current) => ({
      ...current,
      name: selectedStudent.name || '',
      email: selectedStudent.email || '',
      classLevel: selectedStudent.classLevel || '10',
      topic: selectedStudent.topic || 'Algebra',
      offerRate: String(selectedStudent.offerRate || ''),
      feePerSubject: String(selectedStudent.feePerSubject || selectedStudent.offerRate || ''),
      subjects: Array.isArray(selectedStudent.subjects) ? selectedStudent.subjects.join(', ') : (selectedStudent.subjects || 'Mathematics, Science'),
      amountPaid: String(selectedStudent.amountPaid || 0),
      attendanceDate: current.attendanceDate || new Date().toISOString().slice(0, 10),
      paymentAmount: current.paymentAmount || '250',
    }))
  }, [selectedStudent])

  const analytics = useMemo(() => {
    if (!selectedStudent) {
      return {
        attendancePercentage: 0,
        feeSummary: { totalFee: 0, amountPaid: 0, outstanding: 0, isPaid: false },
        revenueTrend: [],
      }
    }

    const feeSummary = calculateFeeSummary({
      feePerSubject: selectedStudent.feePerSubject || selectedStudent.offerRate || 250,
      subjects: selectedStudent.subjects || [],
      amountPaid: selectedStudent.amountPaid || 0,
    })

    return {
      attendancePercentage: calculateAttendancePercentage(selectedStudent.attendance || []),
      feeSummary,
      revenueTrend: summarizeMonthlyRevenue(selectedStudent.payments || []),
    }
  }, [selectedStudent])

  const handleFieldChange = (field, value) => {
    setStudentForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        name: studentForm.name,
        email: studentForm.email,
        classLevel: studentForm.classLevel,
        topic: studentForm.topic,
        offerRate: Number(studentForm.offerRate || 0),
        feePerSubject: Number(studentForm.feePerSubject || 0),
        subjects: studentForm.subjects.split(',').map((subject) => subject.trim()).filter(Boolean),
        amountPaid: Number(studentForm.amountPaid || 0),
      }

      const result = selectedStudent
        ? await onStudentUpdate(selectedStudent.id, payload)
        : await onStudentCreate(payload)

      setSelectedStudentId(result.id)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedStudent) return
    await onStudentDelete(selectedStudent.id)
    setSelectedStudentId(null)
  }

  const handleAttendanceEntry = async (status) => {
    if (!selectedStudent) return
    const attendance = [...(selectedStudent.attendance || []), { date: studentForm.attendanceDate, status }]
    await onStudentUpdate(selectedStudent.id, { attendance })
  }

  const handleFeePayment = async () => {
    if (!selectedStudent) return

    const amount = Number(studentForm.paymentAmount || 0)
    if (!amount) return

    const payments = [...(selectedStudent.payments || []), { month: new Date().toISOString().slice(0, 7), amount, note: 'Recorded from dashboard' }]
    await onStudentUpdate(selectedStudent.id, {
      amountPaid: (selectedStudent.amountPaid || 0) + amount,
      payments,
    })
  }

  const resetForm = () => {
    setStudentForm(createEmptyStudentForm())
    setSelectedStudentId(null)
  }

  return (
    <section className="section-card">
      <div className="section-heading">
        <span className="pill">Students</span>
        <h3>Manage learner profiles, attendance, and fee records</h3>
      </div>

      <div className="student-layout">
        <div className="panel-card">
          <h4>Student profiles</h4>
          <div className="list-stack">
            {visibleStudents.map((student) => (
              <button type="button" className={`list-item student-select ${selectedStudent && String(selectedStudent.id) === String(student.id) ? 'active' : ''}`} key={student.id} onClick={() => setSelectedStudentId(student.id)}>
                <div>
                  <strong>{student.name}</strong>
                  <p>Class {student.classLevel} · {student.topic}</p>
                </div>
                <span>₹{student.offerRate}/hr</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <h4>{selectedStudent ? `Update ${selectedStudent.name}` : 'Create a student profile'}</h4>
          <form onSubmit={handleSubmit} className="booking-form">
            <label>
              Full name
              <input value={studentForm.name} onChange={(event) => handleFieldChange('name', event.target.value)} placeholder="Aarav Mehta" />
            </label>
            <label>
              Email
              <input type="email" value={studentForm.email} onChange={(event) => handleFieldChange('email', event.target.value)} placeholder="student@example.com" />
            </label>
            <div className="form-grid">
              <label>
                Class
                <select value={studentForm.classLevel} onChange={(event) => handleFieldChange('classLevel', event.target.value)}>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </label>
              <label>
                Topic
                <input value={studentForm.topic} onChange={(event) => handleFieldChange('topic', event.target.value)} />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Offer rate (₹/hr)
                <input type="number" value={studentForm.offerRate} onChange={(event) => handleFieldChange('offerRate', event.target.value)} />
              </label>
              <label>
                Fee per subject (₹)
                <input type="number" value={studentForm.feePerSubject} onChange={(event) => handleFieldChange('feePerSubject', event.target.value)} />
              </label>
            </div>
            <label>
              Subjects (comma separated)
              <input value={studentForm.subjects} onChange={(event) => handleFieldChange('subjects', event.target.value)} />
            </label>
            <label>
              Amount paid (₹)
              <input type="number" value={studentForm.amountPaid} onChange={(event) => handleFieldChange('amountPaid', event.target.value)} />
            </label>
            <div className="student-form-actions">
              <button type="submit" className="primary-button" disabled={isSubmitting}>{selectedStudent ? 'Save changes' : 'Add student'}</button>
              <button type="button" className="secondary-button" onClick={resetForm}>Reset</button>
              {selectedStudent ? <button type="button" className="secondary-button danger-button" onClick={handleDelete}>Delete</button> : null}
            </div>
          </form>
        </div>
      </div>

      {selectedStudent ? (
        <div className="analytics-grid">
          <div className="analytics-card">
            <h4>Attendance overview</h4>
            <p className="big-number">{analytics.attendancePercentage}%</p>
            <p className="muted">Daily attendance percentage</p>
            <label>
              Attendance date
              <input type="date" value={studentForm.attendanceDate} onChange={(event) => handleFieldChange('attendanceDate', event.target.value)} />
            </label>
            <div className="chip-row">
              <button type="button" className="primary-button" onClick={() => handleAttendanceEntry('present')}>Mark present</button>
              <button type="button" className="secondary-button" onClick={() => handleAttendanceEntry('absent')}>Mark absent</button>
            </div>
            <div className="list-stack compact">
              {(selectedStudent.attendance || []).slice(-5).reverse().map((entry, index) => (
                <div className="list-item" key={`${entry.date}-${index}`}>
                  <span>{entry.date}</span>
                  <strong>{entry.status}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h4>Fee dashboard</h4>
            <p className="big-number">₹{analytics.feeSummary.totalFee}</p>
            <p className="muted">Outstanding balance: ₹{analytics.feeSummary.outstanding}</p>
            <p className="muted">Payment status: {analytics.feeSummary.isPaid ? 'Paid' : 'Pending'}</p>
            <div className="chip-row">
              <input type="number" value={studentForm.paymentAmount} onChange={(event) => handleFieldChange('paymentAmount', event.target.value)} />
              <button type="button" className="primary-button" onClick={handleFeePayment}>Record payment</button>
            </div>
            <div className="list-stack compact">
              {(selectedStudent.payments || []).slice(-5).reverse().map((entry, index) => (
                <div className="list-item" key={`${entry.month}-${index}`}>
                  <span>{entry.month}</span>
                  <strong>₹{entry.amount}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h4>Revenue trend</h4>
            {analytics.revenueTrend.length ? analytics.revenueTrend.map((entry) => (
              <div className="list-item" key={entry.month}>
                <span>{entry.month}</span>
                <strong>₹{entry.revenue}</strong>
              </div>
            )) : <p className="muted">No payment history yet.</p>}
          </div>
        </div>
      ) : null}

      <div className="student-layout">
        <div className="panel-card">
          <h4>{authUser ? `Book a class as ${authUser.name}` : 'Book a class'}</h4>
          <form onSubmit={handleBookingSubmit} className="booking-form">
            <label>
              Select tutor
              <select value={bookingForm.tutorId} onChange={(event) => setBookingForm((current) => ({ ...current, tutorId: event.target.value }))}>
                {tutors.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>{tutor.name} · ₹{tutor.hourlyRate}/hr</option>
                ))}
              </select>
            </label>
            <label>
              Time slot
              <select value={bookingForm.slot} onChange={(event) => setBookingForm((current) => ({ ...current, slot: event.target.value }))}>
                <option value="6:00 PM - 7:00 PM">6:00 PM - 7:00 PM</option>
                <option value="7:00 PM - 8:00 PM">7:00 PM - 8:00 PM</option>
                <option value="8:00 PM - 9:00 PM">8:00 PM - 9:00 PM</option>
              </select>
            </label>
            <button type="submit" className="primary-button">Book session</button>
          </form>

          <div className="booking-list">
            <h5>Recent bookings</h5>
            {myBookings.length ? myBookings.map((booking) => (
              <div className="list-item" key={booking.id}>
                <div>
                  <strong>{booking.tutorName}</strong>
                  <p>{booking.slot}</p>
                </div>
                <span>{booking.status}</span>
              </div>
            )) : <p className="muted">No bookings yet. Register and create one.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default StudentsPage
