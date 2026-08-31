import { businessData } from "../data/businessData"

export function getOrionResponse(message: string): string {
  const text = message.toLowerCase().trim()

  // Saludos
  if (text.includes("hola")) {
    return `¡Hola! Bienvenido a ${businessData.name}. ¿En qué puedo ayudarte?`
  }

  // Precio de corte clásico
  if (
    text.includes("cuanto cuesta un corte") ||
    text.includes("cuánto cuesta un corte") ||
    text.includes("precio del corte") ||
    text.includes("precio de corte")
  ) {
    const service = businessData.services.find(
      (service) => service.name === "Corte clásico"
    )

    if (service) {
      return `El ${service.name} cuesta ₡${service.price.toLocaleString("es-CR")}.`
    }
  }

  // Corte + barba
  if (
    text.includes("corte y barba") ||
    text.includes("corte + barba") ||
    text.includes("precio de corte y barba")
  ) {
    const service = businessData.services.find(
      (service) => service.name === "Corte + barba"
    )

    if (service) {
      return `El servicio de ${service.name} cuesta ₡${service.price.toLocaleString("es-CR")}.`
    }
  }

  // Barba
  if (
    text.includes("cuanto cuesta la barba") ||
    text.includes("cuánto cuesta la barba") ||
    text.includes("precio de barba")
  ) {
    const service = businessData.services.find(
      (service) => service.name === "Barba"
    )

    if (service) {
      return `El servicio de ${service.name} cuesta ₡${service.price.toLocaleString("es-CR")}.`
    }
  }

  // Horarios
  if (
    text.includes("horario") ||
    text.includes("a que hora abren") ||
    text.includes("a qué hora abren")
  ) {
    return `Nuestro horario es de lunes a viernes de ${businessData.schedule.mondayToFriday}, sábados de ${businessData.schedule.saturday} y domingos ${businessData.schedule.sunday.toLowerCase()}.`
  }

  // Domingo
  if (
    text.includes("abren los domingos") ||
    text.includes("abren domingo") ||
    text.includes("domingo")
  ) {
    return `Los domingos estamos ${businessData.schedule.sunday.toLowerCase()}.`
  }

  // Ubicación
  if (
    text.includes("donde estan") ||
    text.includes("dónde están") ||
    text.includes("ubicacion") ||
    text.includes("ubicación") ||
    text.includes("direccion") ||
    text.includes("dirección")
  ) {
    return `Estamos ubicados en ${businessData.address}.`
  }

  // Teléfono
  if (
    text.includes("telefono") ||
    text.includes("teléfono") ||
    text.includes("numero") ||
    text.includes("número") ||
    text.includes("whatsapp")
  ) {
    return `Puedes contactarnos al ${businessData.phone}.`
  }

  // Lista de servicios
  if (
    text.includes("servicios") ||
    text.includes("que ofrecen") ||
    text.includes("qué ofrecen")
  ) {
    const services = businessData.services
      .map(
        (service) =>
          `${service.name}: ₡${service.price.toLocaleString("es-CR")}`
      )
      .join(", ")

    return `Estos son nuestros servicios: ${services}.`
  }

  return `Todavía no tengo esa información. Puedes preguntarme por nuestros servicios, precios, horarios o ubicación.`
}

