import { Allocation } from '@/types/database'
import { format } from 'date-fns'
import moment from 'moment'

export function getRomanNumber(num: number): string {
  const roman: { [key: number]: string } = {
    1: 'I',
    4: 'IV',
    5: 'V',
    9: 'IX',
    10: 'X',
    40: 'XL',
    50: 'L',
    90: 'XC',
    100: 'C',
    400: 'CD',
    500: 'D',
    900: 'CM',
    1000: 'M',
  }

  let result = ''

  for (const key of Object.keys(roman).reverse()) {
    const intKey = parseInt(key)
    while (num >= intKey) {
      result += roman[intKey]
      num -= intKey
    }
  }

  return result
}

export function getNumberWithOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export function formatTime(timeStr: string) {
  return moment(`1970-01-01 ${timeStr}`, 'YYYY-MM-DD HH:mm:ss').format('h:mm A')
}

export function sortByDays(a: string, b: string) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days.indexOf(a) - days.indexOf(b)
}

/**
 * Given an array of numbers, returns a string representing the ranges of numbers
 * or single numbers in the array. For example, [1, 2, 3, 5, 6, 7] would return
 * "1-3, 5-7".
 */
export function formatNumberRange(numbers: number[]): string {
  if (numbers.length === 0) return ''

  const result: string[] = []
  let start = numbers[0]
  let end = start

  for (let i = 1; i <= numbers.length; i++) {
    if (i < numbers.length && numbers[i] === end + 1) {
      end = numbers[i] // Extend the range
    } else {
      // Add the current range or single number to result
      result.push(start === end ? `${start}` : `${start}-${end}`)

      // If we haven't reached the end of the array, start a new range
      if (i < numbers.length) {
        start = numbers[i]
        end = start
      }
    }
  }

  return result.join(',')
}

export const groupAllocationsByDay = (allocations: Allocation[]) => {
  const groupedMap = allocations
    .sort((a, b) => Number(a.day?.number) - Number(b.day?.number))
    .reduce<Record<string, any>>((acc, allocation) => {
      // Create a unique key based on teacher_id, course_id, and room_id
      const key = `${allocation.teacher_id}-${allocation.course_id}-${allocation.room_id}`

      // If the key doesn't exist in the map, initialize it with an empty array
      if (!acc[key]) {
        acc[key] = {
          ...allocation,
          days: [],
        }
      }

      // Add the day to the group
      acc[key].days.push(allocation.day)

      return acc
    }, {})

  // Convert the map into an array of groups
  return Object.values(groupedMap)
}

export const formatDateString = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, yyyy')
}
