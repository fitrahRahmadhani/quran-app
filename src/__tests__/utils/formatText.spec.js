import { describe, expect, it } from 'vitest'
import { formatTime, toArabicNumber } from '@/utils/formatText'

describe('toArabicNumber', () => {
  it.each([
    [0, '٠'],
    [1, '١'],
    [7, '٧'],
    [10, '١٠'],
    [114, '١١٤'],
    [286, '٢٨٦'],
  ])('mengubah %i menjadi %s', (input, expected) => {
    expect(toArabicNumber(input)).toBe(expected)
  })
})

describe('formatTime', () => {
  it.each([
    [0, '0:00'],
    [5, '0:05'],
    [59, '0:59'],
    [60, '1:00'],
    [65, '1:05'],
    [125.9, '2:05'],
    [3600, '60:00'],
  ])('memformat %s detik menjadi %s', (input, expected) => {
    expect(formatTime(input)).toBe(expected)
  })

  it.each([NaN, Infinity, -Infinity, undefined])('mengembalikan 0:00 untuk %s', (input) => {
    expect(formatTime(input)).toBe('0:00')
  })
})
