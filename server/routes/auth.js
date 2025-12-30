import express from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

/* =========================
   GITHUB STRATEGY
========================= */
console.log("BACKEND_URL:", process.env.BACKEND_URL);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      
      callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      const email =
        profile.emails?.[0]?.value || `${profile.username}@github.com`;

      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) return done(err);

          if (results.length > 0) {
            return done(null, results[0]);
          }

          db.query(
            "INSERT INTO users (name, email, github_id, provider) VALUES (?, ?, ?, 'github')",
            [profile.username, email, profile.id],
            (err, result) => {
              if (err) return done(err);

              done(null, {
                id: result.insertId,
                name: profile.username,
                email
              });
            }
          );
        }
      );
    }
  )
);

/* =========================
   REGISTER
========================= */
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, provider) VALUES (?, ?, ?, 'local')",
    [name, email, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const token = jwt.sign(
        { id: result.insertId, name, email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ token });
    }
  );
});

/* =========================
   LOGIN
========================= */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }

      const user = results[0];
      const isValid = bcrypt.compareSync(password, user.password);

      if (!isValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ token });
    }
  );
});

/* =========================
   GITHUB OAUTH
========================= */
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, name: req.user.name, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?token=${token}`
    );
  }
);

export default router;
