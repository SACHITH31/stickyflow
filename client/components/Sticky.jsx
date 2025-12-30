import { useState, useRef, useEffect } from 'react';

function Sticky({ id, text, color, top, left, updateText, updateColor, updatePosition, deleteSticky, animate }) {
  const [isDragging, setIsDragging] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [title, setTitle] = useState(text.split('\n')[0] || "Untitled");
  const [content, setContent] = useState(text.split('\n').slice(1).join('\n') || "");
  const stickyRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // ✅ TITLE + CONTENT SEPARATION
  const fullText = title + '\n' + content;
  useEffect(() => {
    updateText(id, fullText);
  }, [title, content]);

  // ✅ FIXED DRAGGING
  const handleMouseDown = (e) => {
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
    const newTop = e.clientY - dragOffset.y;
    const newLeft = e.clientX - dragOffset.x;
    updatePosition(id, newTop, newLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  // ✅ CLICK TO EDIT
  const startEdit = () => {
    setEditMode(true);
    setTimeout(() => {
      titleRef.current?.focus();
      contentRef.current?.focus();
    }, 100);
  };

  const stopEdit = () => {
    setEditMode(false);
  };

  // ✅ COLOR BASED TEXT
  const getTextColor = (bgColor) => {
    const darkColors = ['#2196f3', '#e91e63', '#9c27b0'];
    return darkColors.includes(bgColor) ? '#fff' : '#333';
  };

  const textColor = getTextColor(color);

  return (
    <>
      <div
        ref={stickyRef}
        className="sticky"
        style={{
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          width: '340px',
          minHeight: '220px',
          maxHeight: '400px', // Limit max growth
          background: color,
          borderRadius: '20px',
          padding: '28px',
          boxShadow: animate ? '0 30px 60px rgba(0,0,0,0.4)' : '0 12px 35px rgba(0,0,0,0.25)',
          transform: isDragging ? 'scale(1.02)' : (animate ? 'scale(1.05) rotate(3deg)' : 'scale(1)'),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: isDragging ? 'grabbing' : (editMode ? 'text' : 'grab'),
          zIndex: isDragging ? 10001 : 1,
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          border: '3px solid rgba(255,255,255,0.4)',
          overflow: 'hidden'
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <style>{`
          @keyframes bounceIn {
            0% { transform: scale(0.3) rotate(-15deg); opacity: 0; }
            50% { transform: scale(1.1) rotate(8deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          .title-display, .title-edit {
            font-size: 20px !important; 
            font-weight: 700 !important;
            line-height: 1.3 !important;
            margin: 0 0 12px 0 !important;
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
            width: 100% !important;
            font-family: inherit !important;
            outline: none !important;
            color: ${textColor} !important;
          }
          .content-display, .content-edit {
            font-size: 14px !important; 
            line-height: 1.6 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
            width: 100% !important;
            font-family: inherit !important;
            outline: none !important;
            color: ${textColor} !important;
            min-height: 80px;
          }
          .title-display { cursor: pointer; }
          .controls { 
            position: absolute; 
            top: 16px; 
            right: 16px;
            display: flex; 
            gap: 10px; 
            opacity: 0; 
            transform: translateY(-10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
          }
          .sticky:hover .controls { 
            opacity: 1; 
            transform: translateY(0);
            pointer-events: all;
          }
          .delete-btn, .color-btn { 
            width: 44px; 
            height: 44px; 
            border: none; 
            border-radius: 14px; 
            cursor: pointer; 
            font-size: 18px; 
            font-weight: bold;
            display: flex; 
            align-items: center; 
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.25);
          }
          .delete-btn { 
            background: rgba(255,68,68,0.95); 
            color: white; 
          }
          .delete-btn:hover { 
            transform: scale(1.1); 
            box-shadow: 0 10px 30px rgba(255,68,68,0.5);
            background: #ff4444;
          }
          .color-btn { 
            background: rgba(255,255,255,0.85); 
            color: ${textColor};
            font-size: 16px;
          }
          .color-btn:hover { 
            transform: scale(1.1); 
            box-shadow: 0 10px 30px rgba(0,0,0,0.35);
            background: rgba(255,255,255,1);
          }
        `}</style>

        {/* ✅ TITLE + CONTENT EDITING */}
        {editMode ? (
          <>
            <div 
              ref={titleRef}
              className="title-edit"
              contentEditable
              suppressContentEditableWarning={true}
              onInput={(e) => setTitle(e.currentTarget.innerText || "Untitled")}
            >
              {title}
            </div>
            <div 
              ref={contentRef}
              className="content-edit"
              contentEditable
              suppressContentEditableWarning={true}
              onInput={(e) => setContent(e.currentTarget.innerText)}
              onBlur={stopEdit}
            >
              {content}
            </div>
          </>
        ) : (
          <>
            <div className="title-display" onClick={startEdit}>
              {title || "Untitled"}
            </div>
            <div className="content-display" onClick={startEdit}>
              {content || "Start writing your notes..."}
            </div>
          </>
        )}

        {/* ✅ TOP CONTROLS - NO ANIMATION ON DELETE */}
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

      {/* ✅ DELETE POPUP - WORKING */}
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
            border: "1px solid rgba(255,255,255,0.3)"
          }}>
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
            <h3 style={{ color: "#333", marginBottom: "12px", fontSize: "24px", fontWeight: "700" }}>
              Delete Sticky?
            </h3>
            <p style={{ color: "#666", marginBottom: "32px", fontSize: "16px", lineHeight: "1.5" }}>
              This sticky will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button onClick={() => {
                deleteSticky(id);
                setShowDeleteConfirm(false);
              }} style={{
                padding: "14px 32px",
                background: "linear-gradient(135deg, #ff4444 0%, #cc3333 100%)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 8px 25px rgba(255,68,68,0.4)",
                transition: "all 0.3s",
                minWidth: "120px"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 12px 35px rgba(255,68,68,0.6)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 8px 25px rgba(255,68,68,0.4)";
              }}>
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} style={{
                padding: "14px 32px",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                color: "#495057",
                border: "1px solid #dee2e6",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
                minWidth: "120px"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ GLOBAL DRAG HANDLERS */}
      {isDragging && (
        <>
          <style>{`
            body { user-select: none !important; }
          `}</style>
          <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, cursor: 'grabbing'
          }} />
        </>
      )}
    </>
  );
}

export default Sticky;
