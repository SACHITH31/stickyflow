import { useState, useEffect } from "react"
import Sticky from "../components/Sticky"

function Dashboard() {
  const [stickies, setStickies] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [animateNew, setAnimateNew] = useState(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [userName, setUserName] = useState("User")
  const token = localStorage.getItem('token')
  
  // Decode JWT to get username
  const getUserFromToken = () => {
    try {
      if (!token) return "User"
      const decoded = JSON.parse(atob(token.split('.')[1]))
      return decoded.name || decoded.username || decoded.id?.toString() || "User"
    } catch {
      return "User"
    }
  }

  // LOAD STICKIES + USERNAME
  useEffect(() => {
    if (!token) return

    setUserName(getUserFromToken())

    fetch("http://localhost:5000/api/stickies", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then(data => {
      const formatted = data.map(item => ({
        id: item.id,
        text: item.text,
        color: item.color || "#ffeb3b",
        top: Number.isFinite(Number(item.top_pos)) && Number(item.top_pos) >= 0 ? Number(item.top_pos) : 100,
        left: Number.isFinite(Number(item.left_pos)) && Number(item.left_pos) >= 0 ? Number(item.left_pos) : 100
      }))
      setStickies(formatted)
    })
    .catch(err => console.error("LOAD ERROR:", err))
  }, [token])

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  const createSticky = async () => {
    const res = await fetch("http://localhost:5000/api/stickies", {
      method: "POST",
      headers,
      body: JSON.stringify({
        text: "New Sticky ✨",
        color: "#ffeb3b",
        top_pos: 100,
        left_pos: 100
      })
    })

    const newSticky = await res.json()
    const sticky = {
      id: newSticky.id,
      text: newSticky.text,
      color: newSticky.color,
      top: Number(newSticky.top_pos),
      left: Number(newSticky.left_pos)
    }

    setStickies(prev => [...prev, sticky])
    setAnimateNew(sticky.id)
    setShowWelcome(false) // Hide after first sticky
    setTimeout(() => setAnimateNew(null), 500)
  }

  // All your existing update/delete functions (unchanged)
  const updateStickyText = async (id, newText) => {
    setStickies(prev => prev.map(s => s.id === id ? { ...s, text: newText } : s))
    const s = stickies.find(x => x.id === id)
    await fetch(`http://localhost:5000/api/stickies/${id}`, {
      method: "PUT", headers, 
      body: JSON.stringify({ text: newText, color: s.color, top_pos: s.top, left_pos: s.left })
    })
  }

  const updateStickyColor = async (id, newColor) => {
    setStickies(prev => prev.map(s => s.id === id ? { ...s, color: newColor } : s))
    const s = stickies.find(x => x.id === id)
    await fetch(`http://localhost:5000/api/stickies/${id}`, {
      method: "PUT", headers, 
      body: JSON.stringify({ text: s.text, color: newColor, top_pos: s.top, left_pos: s.left })
    })
  }

  const updateStickyPosition = async (id, top, left) => {
    setStickies(prev => prev.map(s => s.id === id ? { ...s, top, left } : s))
    const s = stickies.find(x => x.id === id)
    await fetch(`http://localhost:5000/api/stickies/${id}`, {
      method: "PUT", headers, 
      body: JSON.stringify({ text: s.text, color: s.color, top_pos: top, left_pos: left })
    })
  }

  const deleteSticky = (id, confirm = false) => {
    if (!confirm) return setDeleteId(id)
    fetch(`http://localhost:5000/api/stickies/${id}`, {
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setStickies(prev => prev.filter(s => s.id !== id))
    setDeleteId(null)
  }

  return (
    <div style={{ 
      height: "100vh", 
      width: "100vw", 
      position: "relative", 
      overflow: "hidden",
      background: "#f8f9fa" // Light background, no scroll!
    }}>
      
      {/* ✅ TOP WELCOME BAR - Fixed position, no scroll issues */}
      {showWelcome && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "20px 40px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          zIndex: 2000,
          transform: "translateY(0)",
          animation: "slideDown 0.5s ease-out"
        }}>
          <style>{`
            @keyframes slideDown {
              from { transform: translateY(-100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ 
                width: "50px", 
                height: "50px", 
                background: "#ffeb3b", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "24px", 
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s"
              }}
              onClick={createSticky}
              onMouseEnter={e => {
                e.target.style.transform = "scale(1.1)"
                e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)"
              }}
              onMouseLeave={e => {
                e.target.style.transform = "scale(1)"
                e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)"
              }}
              >
                +
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>
                  Welcome back to StickyFlow! ✨
                </h2>
                <p style={{ margin: "5px 0 0 0", fontSize: "16px", opacity: 0.95 }}>
                  Hello, <span style={{ color: "#ffeb3b", fontWeight: "600" }}>{userName}</span>!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "10px 20px",
                borderRadius: "25px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.target.style.background = "rgba(255,255,255,0.3)"
                e.target.style.transform = "scale(1.05)"
              }}
              onMouseLeave={e => {
                e.target.style.background = "rgba(255,255,255,0.2)"
                e.target.style.transform = "scale(1)"
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* STICKIES CONTAINER */}
      <div style={{ 
        height: "100vh", 
        paddingTop: showWelcome ? "140px" : "0", // Account for welcome bar height
        paddingBottom: "80px",
        overflowY: "auto",
        position: "relative"
      }}>
        {stickies.map(sticky => (
          <Sticky
            key={sticky.id}
            {...sticky}
            updateText={updateStickyText}
            updateColor={updateStickyColor}
            updatePosition={updateStickyPosition}
            deleteSticky={deleteSticky}
            animate={animateNew === sticky.id}
          />
        ))}
      </div>

      {/* FIXED FAB - Always visible, no scroll needed */}
      <button
        onClick={createSticky}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #ffeb3b 0%, #ffcc00 100%)",
          fontSize: "32px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 8px 25px rgba(255,235,59,0.4)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1000,
          border: "3px solid rgba(255,255,255,0.3)"
        }}
        onMouseEnter={e => {
          e.target.style.transform = "scale(1.15) rotate(90deg)"
          e.target.style.boxShadow = "0 12px 35px rgba(255,235,59,0.6)"
        }}
        onMouseLeave={e => {
          e.target.style.transform = "scale(1) rotate(0deg)"
          e.target.style.boxShadow = "0 8px 25px rgba(255,235,59,0.4)"
        }}
      >
        +
      </button>
    </div>
  )
}

export default Dashboard
