import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateAttendancePercentage, calculateFeeSummary, summarizeMonthlyRevenue } from './studentAnalytics.js'

test('calculates fee totals and outstanding balance', () => {
  const summary = calculateFeeSummary({ feePerSubject: 250, subjects: ['Math', 'Science', 'English'], amountPaid: 400 })

  assert.equal(summary.totalFee, 750)
  assert.equal(summary.outstanding, 350)
  assert.equal(summary.isPaid, false)
})

test('calculates attendance percentage from attendance entries', () => {
  const percent = calculateAttendancePercentage([
    { status: 'present' },
    { status: 'present' },
    { status: 'absent' },
  ])

  assert.equal(percent, 66.7)
})

test('summarizes monthly revenue from payment history', () => {
  const summary = summarizeMonthlyRevenue([
    { month: '2026-07', amount: 400 },
    { month: '2026-07', amount: 150 },
    { month: '2026-06', amount: 250 },
  ])

  assert.deepEqual(summary, [
    { month: '2026-06', revenue: 250 },
    { month: '2026-07', revenue: 550 },
  ])
})
