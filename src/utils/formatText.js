export function toArabicNumber(n) {
  return n.toLocaleString('ar-EG')
}

export function formatTime(s) {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
    .toString()
    .padStart(2, '0')
  return `${m}:${r}`
}
