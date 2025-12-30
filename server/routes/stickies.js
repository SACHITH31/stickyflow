import express from "express"
import db from "../db.js"
import verifyToken from "../middleware/auth.js";

const router = express.Router()


/* ================================
   GET ALL STICKIES (LOGGED USER)
================================ */
router.get("/", verifyToken, (req, res) => {
  const userId = req.user.id

  db.query(
    "SELECT * FROM stickies WHERE user_id = ? ORDER BY id ASC",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json(err)
      res.json(results)
    }
  )
})

/* ================================
   CREATE STICKY
================================ */
router.post("/", verifyToken, (req, res) => {
  const userId = req.user.id
  const { text, color, top_pos, left_pos } = req.body

  db.query(
    "INSERT INTO stickies (user_id, text, color, top_pos, left_pos) VALUES (?, ?, ?, ?, ?)",
    [userId, text, color, top_pos, left_pos],
    (err, result) => {
      if (err) return res.status(500).json(err)

      res.json({
        id: result.insertId,
        text,
        color,
        top_pos,
        left_pos
      })
    }
  )
})

/* ================================
   UPDATE STICKY (TEXT / COLOR / POSITION)
================================ */
router.put("/:id", verifyToken, (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  const { text, color, top_pos, left_pos } = req.body

  db.query(
    `UPDATE stickies 
     SET text = ?, color = ?, top_pos = ?, left_pos = ?
     WHERE id = ? AND user_id = ?`,
    [text, color, top_pos, left_pos, id, userId],
    (err, result) => {
      if (err) return res.status(500).json(err)

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Sticky not found" })
      }

      res.json({ success: true })
    }
  )
})

/* ================================
   DELETE STICKY
================================ */
router.delete("/:id", verifyToken, (req, res) => {
  const userId = req.user.id
  const id = req.params.id

  db.query(
    "DELETE FROM stickies WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, result) => {
      if (err) return res.status(500).json(err)

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Sticky not found" })
      }

      res.json({ success: true })
    }
  )
})

export default router;
