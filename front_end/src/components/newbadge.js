export default function NewBadge({language}) {
  return (
    <span
      className="inline-flex items-center rounded-md bg-green-50 ml-1 px-1 py-1 text-xs font-medium text-green-700 font-sans ring-1 ring-inset ring-green-600/20"
    >
      {language.new}
    </span>
  )
}