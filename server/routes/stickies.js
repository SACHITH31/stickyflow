import express from "express";
import db from "../db.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

/* GET ALL */
router.get("/", verifyToken, (req, res) => {
  db.query(
    "SELECT * FROM stickies WHERE user_id = ? ORDER BY id ASC",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(results);
    }
  );
});

/* CREATE */
router.post("/", verifyToken, (req, res) => {
  const { text, color, top_pos, left_pos } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text required" });
  }

  db.query(
    "INSERT INTO stickies (user_id, text, color, top_pos, left_pos) VALUES (?, ?, ?, ?, ?)",
    [req.user.id, text, color, top_pos, left_pos],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });

      res.json({
        id: result.insertId,
        text,
        color,
        top_pos,
        left_pos
      });
    }
  );
});

/* UPDATE */
router.put("/:id", verifyToken, (req, res) => {
  const { text, color, top_pos, left_pos } = req.body;

  db.query(
    `UPDATE stickies SET text=?, color=?, top_pos=?, left_pos=?
     WHERE id=? AND user_id=?`,
    [text, color, top_pos, left_pos, req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Sticky not found" });
      }

      res.json({ success: true });
    }
  );
});

/* DELETE */
router.delete("/:id", verifyToken, (req, res) => {
  db.query(
    "DELETE FROM stickies WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Sticky not found" });
      }

      res.json({ success: true });
    }
  );
});

export default router;
