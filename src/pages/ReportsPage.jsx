import { useMemo } from 'react'
import { calculateAttendancePercentage, calculateFeeSummary } from '../utils/studentAnalytics'

function ReportsPage({ students }) {
  const attendanceReport = useMemo(() => {
    return students
      .map((student) => ({
        id: student.id,
        name: student.name,
        classLevel: student.classLevel,
        attendance: calculateAttendancePercentage(student.attendance || []),
      }))
      .sort((left, right) => right.attendance - left.attendance)
  }, [students])

  const feeReport = useMemo(() => {
    return students
      .map((student) => ({
        id: student.id,
        name: student.name,
        classLevel: student.classLevel,
        ...calculateFeeSummary({
          feePerSubject: student.feePerSubject || student.offerRate || 250,
          subjects: student.subjects || [],
          amountPaid: student.amountPaid || 0,
        }),
      }))
      .sort((left, right) => left.outstanding - right.outstanding)
  }, [students])

  return (
    <section className="section-card">
      <div className="section-heading">
        <span className="pill">Reports</span>
        <h3>Attendance and fee status overview</h3>
      </div>

      <div className="analytics-grid reports-grid">
        <div className="analytics-card">
          <h4>Attendance report</h4>
          <div className="list-stack compact">
            {attendanceReport.map((student) => (
              <div className="list-item" key={student.id}>
                <div>
                  <strong>{student.name}</strong>
                  <p>Class {student.classLevel}</p>
                </div>
                <span>{student.attendance}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h4>Fee status report</h4>
          <div className="list-stack compact">
            {feeReport.map((student) => (
              <div className="list-item" key={student.id}>
                <div>
                  <strong>{student.name}</strong>
                  <p>{student.isPaid ? 'Paid' : `Outstanding ₹${student.outstanding}`}</p>
                </div>
                <span>₹{student.totalFee}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReportsPage
