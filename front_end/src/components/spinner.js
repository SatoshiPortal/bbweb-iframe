
function Spinner({container, text}) {
  return (
    <div className={container ? 'text-center grid place-items-center' : ''} style={container ? { height: 400 } : {}}>
      <div className={`inline-block ${container ? "h-16 w-16" : "h-8 w-8"}`} role="status">
        <object type="image/svg+xml" data="/bb-logo.svg"></object>
      </div>
      {text &&
        <h2 className="text-black">{text}...</h2>
      }
    </div>
  )
}

export default Spinner