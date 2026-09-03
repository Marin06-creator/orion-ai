import { supabase } from "../lib/supabase"

interface BookingData {
  customerName: string
  service: string
  day: string
  time: string
  phone: string
}

export async function createBooking(booking: BookingData) {
  return await supabase
    .from("bookings")
    .insert([
      {
        customer_name: booking.customerName,
        service: booking.service,
        booking_date: booking.day,
        booking_time: booking.time,
        phone: booking.phone,
        status: "pending"
      }
    ])
}

export async function getBookedTimes(date: string) {
  const { data, error } = await supabase
    .rpc("get_booked_times", {
      p_date: date
    })

  if (error) {
    return {
      bookedTimes: [],
      error
    }
  }

  const bookedTimes = (data ?? []).map(
    (item: { booking_time: string }) =>
      String(item.booking_time).slice(0, 5)
  )

  return {
    bookedTimes,
    error: null
  }
}