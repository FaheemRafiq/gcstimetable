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
