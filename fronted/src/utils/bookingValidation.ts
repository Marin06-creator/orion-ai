export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
  return timeRegex.test(time)
}

export function isWithinBusinessHours(time: string): boolean {
  const [hour, minute] = time.split(":").map(Number)

  const totalMinutes = hour * 60 + minute
  const openingTime = 9 * 60
  const closingTime = 18 * 60

  return totalMinutes >= openingTime && totalMinutes <= closingTime
}