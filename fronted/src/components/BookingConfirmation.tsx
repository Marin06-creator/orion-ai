interface BookingConfirmationProps {
  customerName: string
  service: string
  day: string
  time: string
  onConfirm: () => void
  onCancel: () => void
}

function BookingConfirmation({
  customerName,
  service,
  day,
  time,
  onConfirm,
  onCancel
}: BookingConfirmationProps) {
  return (
    <div className="bg-gray-700 rounded-2xl p-4 mt-4 mb-3 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4">
        📋 Confirmar reserva
      </h3>

      <div className="space-y-3 text-gray-200">
        <div>
          <p className="text-xs text-gray-400">Cliente</p>
          <p className="font-semibold">{customerName}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Servicio</p>
          <p className="font-semibold">{service}</p>
        </div>

        <div className="flex gap-8">
          <div>
            <p className="text-xs text-gray-400">Fecha</p>
            <p className="font-semibold">{day}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Hora</p>
            <p className="font-semibold">{time}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={onConfirm}
          className="flex-1 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold py-2 rounded-xl transition-all"
        >
          ✅ Confirmar
        </button>

        <button
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-500 active:scale-95 text-white font-semibold py-2 rounded-xl transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default BookingConfirmation