interface Service {
  name: string
  price: number
  duration: number
}

interface ServiceOptionsProps {
  services: Service[]
  onSelect: (service: string) => void
}

function ServiceOptions({
  services,
  onSelect
}: ServiceOptionsProps) {
  return (
    <div className="grid gap-3 mt-4 mb-3">
      {services.map((service) => (
        <button
          key={service.name}
          onClick={() => onSelect(service.name)}
          className="
            text-left
            bg-gray-700
            hover:bg-gray-600
            active:scale-[0.98]
            text-white
            p-4
            rounded-xl
            shadow-md
            transition-all
            duration-200
          "
        >
          <div className="font-semibold text-lg">
            ✂️ {service.name}
          </div>

          <div className="text-sm text-gray-300 mt-1">
            ₡{service.price.toLocaleString()} · {service.duration} min
          </div>
        </button>
      ))}
    </div>
  )
}

export default ServiceOptions