export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
  return timeRegex.test(time)
}

export function isWithinBusinessHours(
  date: string,
  time: string
): boolean {
  const [year, month, day] = date.split("-").map(Number)
const parsedDate = new Date(year, month - 1, day)

  const dayOfWeek = parsedDate.getDay()

  const [hour, minute] = time.split(":").map(Number)
  const totalMinutes = hour * 60 + minute

  const openingTime = 9 * 60

  // Domingo
  if (dayOfWeek === 0) {
    return false
  }

  // Sábado: 09:00 - 17:00
  if (dayOfWeek === 6) {
    const closingTime = 17 * 60
    return totalMinutes >= openingTime && totalMinutes <= closingTime
  }

  // Lunes a viernes: 09:00 - 19:00
  const closingTime = 19 * 60

  return totalMinutes >= openingTime && totalMinutes <= closingTime
}
export function isValidDateFormat(date: string): boolean {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
  return dateRegex.test(date)
}

export function isValidBookingDate(date: string): boolean {
  if (!isValidDateFormat(date)) {
    return false
  }

  const [day, month, year] = date.split("/").map(Number)

  const parsedDate = new Date(year, month - 1, day)

  const isRealDate =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day

  if (!isRealDate) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  parsedDate.setHours(0, 0, 0, 0)

  return parsedDate >= today
}
export function isValidService(
  service: string,
  validServices: string[]
): boolean {
  return validServices.includes(service)
}

export function isValidCustomerName(name: string): boolean {
  const trimmedName = name.trim()

  if (trimmedName.length < 2 || trimmedName.length > 50) {
    return false
  }

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/

  return nameRegex.test(trimmedName)
}
export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s-]/g, "")

  return /^\+?\d{8,15}$/.test(cleanPhone)
}