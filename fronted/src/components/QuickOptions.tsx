interface QuickOptionsProps {
  options: string[]
  onSelect: (option: string) => void
}

function QuickOptions({
  options,
  onSelect
}: QuickOptionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition"
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default QuickOptions