import { useEffect, useRef, useState } from "react"
import Message from "./Message"
import InputBox from "./InputBox"
import  QuickOptions from "./QuickOptions"
import ServiceOptions from "./ServiceOptions"
import { getOrionResponse } from "../utils/orionBrain"
import { businessData } from "../data/businessData"
import BookingConfirmation from "./BookingConfirmation"

import {
  createBooking,
  getBookedTimes,
  getBookedIntervals
} from "../services/bookingService"

import {
  isValidTimeFormat,
  isWithinBusinessHours,
  isValidBookingDate,
  isValidService,
  isValidCustomerName,
  isValidPhone
} from "../utils/bookingValidation"





interface ChatMessage {
  sender: "user" | "orion"
  text: string
}

interface Booking {
  service: string
  day: string
  time: string
  customerName: string
  phone: string
  duration : number
}
const allTimes: string[] = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00"
]
function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number)

  return hour * 60 + minute
}

function hasTimeOverlap(
  newTime: string,
  newDuration: number,
  existingTime: string,
  existingDuration: number
): boolean {
  const newStart = timeToMinutes(newTime)
  const newEnd = newStart + newDuration

  const existingStart = timeToMinutes(existingTime)
  const existingEnd = existingStart + existingDuration

  return newStart < existingEnd && newEnd > existingStart
}

function getAvailableTimesByDuration(
  times: string[],
  newDuration: number,
  intervals: { time: string; duration: number }[],
  date: string
): string[] {
  return times.filter((time) => {
    const overlaps = intervals.some((interval) =>
      hasTimeOverlap(
        time,
        newDuration,
        interval.time,
        interval.duration
      )
    )

    const fitsBusinessHours = isWithinBusinessHours(
      date,
      time,
      newDuration
    )

    return !overlaps && fitsBusinessHours
  })
}


function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "orion",
      text: "¡Hola! Soy ORION, asistente de Barbería Central. ¿En qué puedo ayudarte?"
    }
  ])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

  const [isThinking, setIsThinking] = useState(false)

  const [bookingStep, setBookingStep] = useState(0)

  const [booking, setBooking] = useState<Booking>({
    service: "",
    day: "",
    time: "",
    customerName: "",
    phone: "",
    duration: 0
  })
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  })}, [messages, isThinking, bookingStep, availableTimes])
  const [showConfirmation, setShowConfirmation] = useState(false)

  async function handleConfirmBooking() {
  const completedBooking = booking

  const { error } = await createBooking(completedBooking)

  if (error) {
    if (error.code === "23505") {
      const {
        bookedTimes,
        error: bookedError
      } = await getBookedTimes(completedBooking.day)

      if (bookedError) {
        console.error("Error consultando horarios:", bookedError)

        const orionMessage: ChatMessage = {
          sender: "orion",
          text:
            "No pude consultar los horarios disponibles. Inténtalo nuevamente."
        }

        setMessages((prev) => [...prev, orionMessage])
        setBookingStep(3)
      } else {
        const freeTimes = allTimes.filter(
          (time) => !bookedTimes.includes(time)
        )

        setAvailableTimes(freeTimes)

        const orionMessage: ChatMessage = {
          sender: "orion",
          text:
            `❌ La hora ${completedBooking.time} ya está reservada.\n\n` +
            `Horarios disponibles:\n` +
            freeTimes.map((time) => `• ${time}`).join("\n") +
            `\n\nElige otra hora.`
        }

        setMessages((prev) => [...prev, orionMessage])
        setBookingStep(3)
      }

      setShowConfirmation(false)
    } else {
      console.error("Error guardando reserva:", error)

      const orionMessage: ChatMessage = {
        sender: "orion",
        text:
          "Hubo un problema al guardar la cita. Inténtalo nuevamente."
      }

      setMessages((prev) => [...prev, orionMessage])
      setBookingStep(0)
      setShowConfirmation(false)
    }
  } else {
    const orionMessage: ChatMessage = {
      sender: "orion",
      text:
        `✅ Cita registrada:\n\n` +
        `Cliente: ${completedBooking.customerName}\n` +
        `Teléfono: ${completedBooking.phone}\n` +
        `Servicio: ${completedBooking.service}\n` +
        `Fecha: ${completedBooking.day}\n` +
        `Hora: ${completedBooking.time}`
    }

    setMessages((prev) => [...prev, orionMessage])

    setShowConfirmation(false)
    setBookingStep(0)
  }
}
function handleCancelBooking() {
  setShowConfirmation(false)

  setBooking({
    service: "",
    day: "",
    time: "",
    customerName: "",
    phone: "",
    duration: 0

  })

  setBookingStep(0)

  const orionMessage: ChatMessage = {
    sender: "orion",
    text: "Reserva cancelada. Puedes comenzar de nuevo cuando quieras."
  }

  setMessages((prev) => [...prev, orionMessage])
}

  function handleSend(message: string) {
    const userMessage: ChatMessage = {
      sender: "user",
      text: message
    }

    setMessages((prev) => [...prev, userMessage])
    setIsThinking(true)

    setTimeout(async () => {
      let response = ""

      const text = message.toLowerCase().trim()

      // Iniciar una reserva
      if (
        bookingStep === 0 &&
        (
          text.includes("reservar") ||
          text.includes("cita") ||
          text.includes("agendar") ||
          text.includes("hacer")
        )
      ) {
        response =
          "¡Claro! ¿Qué servicio deseas reservar? Tenemos Corte clásico, Corte + barba y Barba."

        setBookingStep(1)
      }

      // Guardar servicio
else if (bookingStep === 1) {
  const validServices = businessData.services.map(
    (service) => service.name
  )

  if (!isValidService(message, validServices)) {
    response =
      "⚠️ Ese servicio no es válido. Elige una de las opciones disponibles."
  } else {
   const selectedService = businessData.services.find(
  (service) => service.name === message
)

setBooking((prev) => ({
  ...prev,
  service: message,
  duration: selectedService?.duration ?? 0
}))

    response =
      "Perfecto. ¿Qué día deseas reservar? Usa formato DD/MM/AAAA."

    setBookingStep(2)
  }
}
      // Guardar día
 else if (bookingStep === 2) {
  if (!isValidBookingDate(message)) {
    response =
      "⚠️ Esa fecha no es válida. Usa formato DD/MM/AAAA y elige una fecha de hoy en adelante. Ejemplo: 05/09/2026."
  } else {
    const [day, month, year] = message.split("/")

    const formattedDate =
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`

    setBooking((prev) => ({
      ...prev,
      day: formattedDate
    }))

    response =
      "Muy bien. ¿A qué hora deseas la cita? Usa formato 24 horas. Ejemplo: 15:00."

    setBookingStep(3)
  }
}
      // Guardar hora
    else if (bookingStep === 3) {
  if (!isValidTimeFormat(message)) {
    response =
      "⚠️ Esa hora no es válida. Escríbela en formato 24 horas. Ejemplo: 15:00."
  } else if (!isWithinBusinessHours(booking.day, message, booking.duration)) {
    response =
      "⚠️ Ese horario no está disponible para ese día.\n\n" +
      "Horario:\n" +
      "Lunes a viernes: 09:00 - 19:00\n" +
      "Sábado: 09:00 - 17:00\n" +
      "Domingo: Cerrado."
  } else {
    const {
      intervals,
      error: intervalsError
    } = await getBookedIntervals(booking.day)

    if (intervalsError) {
      console.error(
        "Error consultando intervalos:",
        intervalsError
      )

      response =
        "No pude comprobar la disponibilidad. Inténtalo nuevamente."
    } else {
      const hasOverlap = intervals.some(
        (interval: { time: string; duration: number }) =>
          hasTimeOverlap(
            message,
            booking.duration,
            interval.time,
            interval.duration
          )
      )

      if (hasOverlap) {
  const freeTimes = getAvailableTimesByDuration(
    allTimes,
    booking.duration,
    intervals,
    booking.day
  )

  setAvailableTimes(freeTimes)

  response =
    "❌ Esa hora se cruza con otra reserva.\n\n" +
    "Horarios disponibles:\n" +
    freeTimes.map((time) => `• ${time}`).join("\n") +
    "\n\nElige otro horario."
} else {
        setBooking((prev) => ({
          ...prev,
          time: message
        }))

        response =
          "Perfecto. ¿A nombre de quién hacemos la reserva?"

        setBookingStep(4)
      }
    }
  }
}




   // Guardar nombre y confirmar
  else if (bookingStep === 4) {
  if (!isValidCustomerName(message)) {
    response =
      "⚠️ El nombre no es válido. Escribe un nombre de al menos 2 letras y sin números."
  } else {
    setBooking((prev) => ({
      ...prev,
      customerName: message.trim()
    }))

    response =
      "📱 ¿Cuál es tu número de teléfono o WhatsApp?"

    setBookingStep(5)
  }
}

  else if (bookingStep === 5) {
  if (!isValidPhone(message)) {
    response =
      "⚠️ El número no es válido. Escribe entre 8 y 15 dígitos. Puedes incluir el código de país."
  } else {
    const completedBooking = {
      ...booking,
      phone: message.trim()
    }

    setBooking(completedBooking)

    response =
      "Revisa los datos de tu reserva antes de confirmar."

    setShowConfirmation(true)
    setBookingStep(6)
  }
}


      // Conversación normal
      else {
        response = getOrionResponse(message)
      }

      const orionMessage: ChatMessage = {
        sender: "orion",
        text: response
      }

      setMessages((prev) => [...prev, orionMessage])
      setIsThinking(false)
    }, 800)
  }

  return (
    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-blue-400">
        🤖 ORION Business
      </h2>

      <div className="mt-6 h-96 bg-gray-800 rounded-xl p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <Message
            key={index}
            sender={message.sender}
            text={message.text}
          />
        ))}
        {bookingStep === 1 && (
  <ServiceOptions
    services={businessData.services}
    onSelect={handleSend}
  />
)}
{bookingStep === 3 && availableTimes.length > 0 && (
  <QuickOptions
    options={availableTimes}
    onSelect={(time) => {
      setAvailableTimes([])
      handleSend(time)
    }}
  />
)}
{showConfirmation && (() => {
  const selectedService = businessData.services.find(
    (service) => service.name === booking.service
  )

  return (
    <BookingConfirmation
      customerName={booking.customerName}
      service={booking.service}
      day={booking.day}
      time={booking.time}
      price={selectedService?.price ?? 0}
      duration={selectedService?.duration ?? 0}
      phone={booking.phone}
      onConfirm={handleConfirmBooking}
      onCancel={handleCancelBooking}
    />
  )
})()}

{isThinking && (
  <div className="text-gray-400 mt-2">
    ORION está pensando...
  </div>
)}

<div ref={messagesEndRef} />

    
      </div>

      <InputBox onSend={handleSend} />
    </div>
  )
}

export default ChatWindow