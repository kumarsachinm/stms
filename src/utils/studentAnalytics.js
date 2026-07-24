export function calculateFeeSummary({ feePerSubject, subjects = [], amountPaid = 0 }) {
  const subjectCount = Array.isArray(subjects) ? subjects.length : 0
  const totalFee = Number(feePerSubject || 0) * Math.max(subjectCount, 1)
  const paid = Number(amountPaid || 0)
  const outstanding = Math.max(totalFee - paid, 0)

  return {
    totalFee,
    amountPaid: paid,
    outstanding,
    isPaid: outstanding === 0,
  }
}

export function calculateAttendancePercentage(entries = []) {
  const attendanceEntries = Array.isArray(entries) ? entries : []
  if (!attendanceEntries.length) return 0

  const presentCount = attendanceEntries.filter((entry) => String(entry.status || '').toLowerCase() === 'present').length
  const totalDays = attendanceEntries.length
  return Number(((presentCount / totalDays) * 100).toFixed(1))
}

export function summarizeMonthlyRevenue(entries = []) {
  const revenueEntries = Array.isArray(entries) ? entries : []
  const totals = revenueEntries.reduce((accumulator, entry) => {
    const month = entry.month || 'unknown'
    const amount = Number(entry.amount || 0)
    accumulator[month] = (accumulator[month] || 0) + amount
    return accumulator
  }, {})

  return Object.entries(totals)
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((left, right) => left.month.localeCompare(right.month))
}
