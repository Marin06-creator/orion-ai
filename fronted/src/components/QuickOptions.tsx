interface QuickOptionsProps {
  options: string[]
  onSelect: (option: string) => void
}

function QuickOptions({
  options,
  onSelect
}: QuickOptionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 mb-3">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className="
          bg-blue-600
          hover:bg-blue-500
          active:scale-95
          text-white
          font-medium
          px-4
          py-2
          rounded-xl
          shadow-md
          transition-all
          duration-200
        "
        >
          {option}
        </button>
        
      ))}
    </div>
  )
}


export default QuickOptions