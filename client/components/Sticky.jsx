import { useState } from "react"

function Sticky({ id, text, top, left, color, updateText, updateColor, deleteSticky, updatePosition, animate }) {
  const [showSettings, setShowSettings] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [start, setStart] = useState({ x: 0, y: 0 })
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [pos, setPos] = useState({ x: left, y: top })

  const colors = ["#ffeb3b", "#a5d6a7", "#90caf9", "#f48fb1", "#ce93d8"]

  const down = e => {
    setDragging(true)
    setStart(pos)
    setMouse({ x: e.clientX, y: e.clientY })
  }

  const move = e => {
    if (!dragging) return
    setPos({
      x: start.x + (e.clientX - mouse.x),
      y: start.y + (e.clientY - mouse.y)
    })
  }

  const up = () => {
    if (!dragging) return
    setDragging(false)
    updatePosition(id, pos.y, pos.x)
  }

  return (
    <div
      onMouseEnter={() => setShowSettings(true)}
      onMouseLeave={() => { setShowSettings(false); setShowColors(false) }}
      onMouseDown={down}
      onMouseMove={move}
      onMouseUp={up}
      style={{
        width: "200px",
        minHeight: "200px",
        background: color,
        padding: "15px",
        borderRadius: "12px",
        position: "absolute",
        top: pos.y,
        left: pos.x,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        boxShadow: dragging ? "0 10px 20px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.2)",
        animation: animate ? "fadeBounce 0.5s" : "none"
      }}
    >
      <style>
        {`
          @keyframes fadeBounce {
            0% { opacity: 0; transform: scale(0.7); }
            60% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      {showSettings && (
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6 }}>
          <span onClick={() => setShowColors(!showColors)}>⚙️</span>
          <span onClick={() => deleteSticky(id)}>🗑️</span>
        </div>
      )}

      {showColors && (
        <div style={{ display: "flex", gap: 6 }}>
          {colors.map(c => (
            <div key={c} onClick={() => updateColor(id, c)}
              style={{ width: 18, height: 18, background: c, cursor: "pointer" }} />
          ))}
        </div>
      )}

      {isEditing ? (
        <textarea
          value={text}
          onChange={e => updateText(id, e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <p onClick={() => setIsEditing(true)}>{text}</p>
      )}
    </div>
  )
}

export default Sticky
