import { useState, useRef, useEffect } from 'react';

function Sticky({ id, text, color, top, left, updateText, updateColor, updatePosition, deleteSticky, animate }) {
  const [isDragging, setIsDragging] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const stickyRef = useRef(null);
  const textRef = useRef(null);

  // ✅ OLD SMOOTH DRAGGING - FIXED hover bug
  const handleMouseDown = (e) => {
    // Block drag on controls/editing
    if (e.target.closest('.controls') || editMode) return;
    
    setIsDragging(true);
    const rect = stickyRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const newTop = e.clientY - dragOffset.y;
    const newLeft = e.clientX - dragOffset.x;
    updatePosition(id, newTop, newLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  // ✅ CLICK TO EDIT
  const handleTextClick = () => {
    setEditMode(true);
    setTimeout(() => textRef.current?.focus(), 100);
  };

  const handleTextBlur = () => {
    setEditMode(false);
    const newText = textRef.current?.innerText || text;
    if (newText !== text) updateText(id, newText);
  };

  // ✅ DELETE CONFIRM
  const confirmDelete = () => {
    deleteSticky(id);
    setShowDeleteConfirm(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleMouseUp();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset]);

  // ✅ COLOR-BASED TEXT COLOR
  const getTextColor = (bgColor) => {
    const darkColors = ['#2196f3', '#e91e63', '#9c27b0'];
    return darkColors.includes(bgColor) ? '#fff' : '#333';
  };

  return (
    <>
      <div
        ref={stickyRef}
        className="sticky"
        style={{
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          width: '320px',  // ✅ OLD SIZE
          height: '200px', // ✅ OLD SIZE
          background: color,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: animate 
            ? '0 25px 50px rgba(0,0,0,0.4)' 
            : '0 10px 30px rgba(0,0,0,0.2)',
          transform: isDragging ? 'scale(1.02)' : (animate ? 'scale(1.05) rotate(2deg)' : 'scale(1)'),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: isDragging ? 'grabbing' : (editMode ? 'text' : 'grab'),
          zIndex: isDragging ? 10001 : 1,
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          border: '2px solid rgba(255,255,255,0.3)',
          overflow: 'hidden'
        }}
        onMouseDown={handleMouseDown}
      >
        <style>{`
          @keyframes bounceIn {
            0% { transform: scale(0.3) rotate(-12deg); opacity: 0; }
            50% { transform: scale(1.1) rotate(6deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          .text-display, .text-edit {
            font-size: 15px; 
            line-height: 1.5; 
            min-height: 120px;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
            background: transparent;
            font-family: inherit;
            resize: none;
            outline: none;
            overflow: hidden;
          }
          .text-display { cursor: pointer; pointer-events: all; }
          .text-edit { caret-color: #333; }
          .controls { 
            position: absolute; 
            top: 12px; 
            right: 12px;
            display: flex; 
            gap: 8px; 
            opacity: 0; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
          }
          .sticky:hover .controls { 
            opacity: 1; 
            transform: translateY(0) scale(1);
            pointer-events: all;
          }
          .delete-btn, .color-btn { 
            width: 40px; 
            height: 40px; 
            border: none; 
            border-radius: 12px; 
            cursor: pointer; 
            font-size: 16px; 
            font-weight: bold;
            display: flex; 
            align-items: center; 
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
          }
          .delete-btn { 
            background: rgba(255,68,68,0.9); 
            color: white; 
            font-size: 18px;
          }
          .delete-btn:hover { 
            transform: scale(1.2) rotate(90deg); 
            box-shadow: 0 8px 25px rgba(255,68,68,0.5);
            background: #ff4444;
          }
          .color-btn { 
            background: rgba(255,255,255,0.8); 
            color: ${getTextColor(color)}; 
            font-size: 14px;
          }
          .color-btn:hover { 
            transform: scale(1.2); 
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            background: rgba(255,255,255,1);
          }
        `}</style>

        {/* ✅ CLICK-TO-EDIT TEXT */}
        {editMode ? (
          <div 
            ref={textRef}
            className="text-edit"
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={handleTextBlur}
            style={{ color: getTextColor(color) }}
          >
            {text || "New Sticky ✨"}
          </div>
        ) : (
          <div 
            className="text-display"
            onClick={handleTextClick}
            style={{ color: getTextColor(color) }}
          >
            {text || "New Sticky ✨"}
          </div>
        )}

        {/* ✅ HOVER CONTROLS - TOP RIGHT */}
        <div className="controls">
          <button 
            className="delete-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            title="Delete Sticky"
          >
            🗑️
          </button>
          <button 
            className="color-btn" 
            onClick={(e) => {
              e.stopPropagation();
              const colors = ['#ffeb3b', '#ff9800', '#4caf50', '#2196f3', '#e91e63', '#9c27b0'];
              const currentIndex = colors.indexOf(color);
              const nextColor = colors[(currentIndex + 1) % colors.length];
              updateColor(id, nextColor);
            }}
            title="Change Color"
          >
            🎨
          </button>
        </div>
      </div>

      {/* ✅ LOGOUT-STYLE DELETE POPUP */}
      {showDeleteConfirm && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10002
        }}>
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "24px",
            textAlign: "center",
            maxWidth: "420px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.3)",
            transform: "scale(1)",
            animation: "popupSlide 0.3s ease-out"
          }}>
            <style>{`
              @keyframes popupSlide {
                from { transform: scale(0.7) translateY(20px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
              }
            `}</style>
            <div style={{
              width: "80px", height: "80px",
              background: "linear-gradient(135deg, #ff4444 0%, #cc3333 100%)",
              borderRadius: "50%",
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              color: "white",
              boxShadow: "0 12px 30px rgba(255,68,68,0.4)"
            }}>
              🗑️
            </div>
            <h3 style={{ 
              color: "#333", 
              marginBottom: "12px", 
              fontSize: "24px", 
              fontWeight: "700" 
            }}>
              Delete this Sticky?
            </h3>
            <p style={{ 
              color: "#666", 
              marginBottom: "32px", 
              fontSize: "16px", 
              lineHeight: "1.5" 
            }}>
              This action cannot be undone. The sticky will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "14px 32px",
                  background: "linear-gradient(135deg, #ff4444 0%, #cc3333 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 8px 25px rgba(255,68,68,0.4)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  minWidth: "120px"
                }}
                onMouseEnter={e => {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 12px 35px rgba(255,68,68,0.6)";
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 8px 25px rgba(255,68,68,0.4)";
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
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
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
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

export default Sticky;
