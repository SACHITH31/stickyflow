import { useState } from "react";

function Navbar() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  const handleLogoutCancel = () => setShowLogoutConfirm(false);

  return (
    <>
      <div style={{
        height: "60px",
        backgroundColor: "#111",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        justifyContent: "space-between",
        fontSize: "20px",
        fontWeight: "bold",
        boxShadow: "0 2px 20px rgba(0,0,0,0.3)"
      }}>
        StickyFlow
        <button 
          onClick={handleLogoutClick}
          style={{
            background: "linear-gradient(135deg, #ff4444 0%, #cc3333 100%)",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "25px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(255,68,68,0.4)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
          onMouseEnter={e => {
            e.target.style.transform = "scale(1.05)"
            e.target.style.boxShadow = "0 6px 20px rgba(255,68,68,0.6)"
          }}
          onMouseLeave={e => {
            e.target.style.transform = "scale(1)"
            e.target.style.boxShadow = "0 4px 15px rgba(255,68,68,0.4)"
          }}
        >
          Logout
        </button>
      </div>

      {/* ✅ BEAUTIFUL LOGOUT POPUP */}
      {showLogoutConfirm && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "24px",
            textAlign: "center",
            maxWidth: "420px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <div style={{
              width: "80px", height: "80px",
              background: "linear-gradient(135deg, #ffeb3b 0%, #ffcc00 100%)",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              boxShadow: "0 10px 30px rgba(255,235,59,0.4)"
            }}>
              🚪
            </div>
            <h3 style={{ color: "#333", marginBottom: "12px", fontSize: "24px", fontWeight: "700" }}>
              Confirm Logout
            </h3>
            <p style={{ color: "#666", marginBottom: "30px", fontSize: "16px", lineHeight: "1.5" }}>
              Are you sure? You'll need to log in again to access your stickies.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button
                onClick={handleLogoutConfirm}
                style={{
                  padding: "14px 32px",
                  background: "linear-gradient(135deg, #ff4444 0%, #cc3333 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(255,68,68,0.4)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  minWidth: "120px"
                }}
                onMouseEnter={e => {
                  e.target.style.transform = "scale(1.05)"
                  e.target.style.boxShadow = "0 8px 25px rgba(255,68,68,0.6)"
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "scale(1)"
                  e.target.style.boxShadow = "0 6px 20px rgba(255,68,68,0.4)"
                }}
              >
                Yes, Logout
              </button>
              <button
                onClick={handleLogoutCancel}
                style={{
                  padding: "14px 32px",
                  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  color: "#495057",
                  border: "1px solid #dee2e6",
                  borderRadius: "50px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  minWidth: "120px"
                }}
                onMouseEnter={e => {
                  e.target.style.transform = "scale(1.05)"
                  e.target.style.background = "#e9ecef"
                  e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)"
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "scale(1)"
                  e.target.style.background = "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
                  e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
